import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prisma/client";
import { InjectiveService } from "../services/injective.service";

export class ChallengeController {
  /**
   * Create a new study challenge.
   */
  public static async createChallenge(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const { title, description, category, difficulty, deadline, duration } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!title || !category || !difficulty || !deadline || !duration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Calculate gamified rewards
      let multiplier = 1;
      if (difficulty.toLowerCase() === "medium") multiplier = 1.5;
      if (difficulty.toLowerCase() === "hard") multiplier = 2.0;

      const xpReward = Math.round(duration * 2 * multiplier);
      const coinReward = Math.round(duration * multiplier);

      const challenge = await prisma.challenge.create({
        data: {
          title,
          description,
          category,
          difficulty,
          deadline: new Date(deadline),
          duration: parseInt(duration, 10),
          xpReward,
          coinReward,
          status: "PENDING",
          userId,
        },
      });

      return res.status(201).json(challenge);
    } catch (error) {
      console.error("Create challenge error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * List all user challenges.
   */
  public static async getChallenges(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const challenges = await prisma.challenge.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return res.json(challenges);
    } catch (error) {
      console.error("Get challenges error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Delete a challenge.
   */
  public static async deleteChallenge(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const challenge = await prisma.challenge.findFirst({
        where: { id, userId },
      });

      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }

      await prisma.challenge.delete({
        where: { id },
      });

      return res.json({ message: "Challenge deleted successfully" });
    } catch (error) {
      console.error("Delete challenge error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Complete a challenge, grant rewards, update streaks, verify on Injective, check achievements.
   */
  public static async completeChallenge(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const challenge = await prisma.challenge.findFirst({
        where: { id, userId },
      });

      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }

      if (challenge.status === "COMPLETED") {
        return res.status(400).json({ error: "Challenge is already completed" });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ error: "User not found" });

      // 1. Submit transaction to Injective Blockchain
      const onChainTxHash = await InjectiveService.recordChallengeCompletion(
        challenge.id,
        user.walletAddress,
        challenge.difficulty,
        challenge.xpReward,
        challenge.coinReward
      );

      // Update challenge in DB
      const completedChallenge = await prisma.challenge.update({
        where: { id },
        data: {
          status: "COMPLETED",
          completionDate: new Date(),
          txHash: onChainTxHash,
        },
      });

      // 2. Compute streaks
      let newStreak = user.streak;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!user.lastActiveDate) {
        newStreak = 1;
      } else {
        const lastActive = new Date(user.lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - lastActive.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          // Active on consecutive day
          newStreak += 1;
        } else if (diffDays > 1) {
          // Streak broken
          newStreak = 1;
        }
        // If diffDays === 0, user already did a challenge today, keep current streak
      }

      // 3. XP Progression leveling formula
      let currentXp = user.xp + challenge.xpReward;
      let currentLevel = user.level;
      let levelUp = false;

      // level n threshold: 100 * level (100 XP, 250 XP, 500 XP, 800 XP...)
      const getXpThreshold = (lvl: number) => {
        return 100 * (lvl * (lvl + 1)) / 2;
      };

      while (currentXp >= getXpThreshold(currentLevel)) {
        currentLevel += 1;
        levelUp = true;
      }

      // 4. Update user details
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          xp: currentXp,
          level: currentLevel,
          coins: user.coins + challenge.coinReward,
          streak: newStreak,
          lastActiveDate: new Date(),
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId,
          type: "CHALLENGE_COMPLETE",
          title: "Challenge Completed!",
          message: `Finished "${challenge.title}". Gained +${challenge.xpReward} XP and +${challenge.coinReward} Coins.`,
        },
      });

      if (levelUp) {
        await prisma.notification.create({
          data: {
            userId,
            type: "LEVEL_UP",
            title: `Level Up! Level ${currentLevel}`,
            message: `Awesome job! You reached Level ${currentLevel}. Keep Sprinting!`,
          },
        });
      }

      // 5. Evaluate achievements & mint NFT milestones
      const achievementsUnlocked: string[] = [];
      const mintedNFTs: any[] = [];

      const countCompleted = await prisma.challenge.count({
        where: { userId, status: "COMPLETED" },
      });

      const totalSessions = await prisma.studySession.findMany({ where: { userId } });
      const totalHours = totalSessions.reduce((acc, s) => acc + s.duration, 0) / 60;

      const userAchievements = await prisma.achievement.findMany({ where: { userId } });
      const hasAchievement = (title: string) => userAchievements.some((a) => a.title === title);

      // Checker helper for achievements and NFT minting
      const checkAndMint = async (
        achTitle: string,
        achDesc: string,
        badgeId: string,
        condition: boolean
      ) => {
        if (condition && !hasAchievement(achTitle)) {
          // Unlock local achievement
          await prisma.achievement.create({
            data: {
              title: achTitle,
              description: achDesc,
              badgeId,
              userId,
            },
          });
          achievementsUnlocked.push(achTitle);

          // Upload metadata and mint NFT on Injective
          const ipfsUri = await InjectiveService.uploadToIPFS(achTitle, achDesc, badgeId);
          const mintData = await InjectiveService.mintAchievementNFT(
            user.walletAddress,
            achTitle.replace(/\s+/g, "_"),
            badgeId,
            ipfsUri
          );

          // Save NFT to DB
          const nftRecord = await prisma.nFT.create({
            data: {
              title: achTitle,
              description: achDesc,
              badgeId,
              ipfsUri: mintData.ipfsUri,
              txHash: mintData.txHash,
              userId,
            },
          });

          // Trigger notification
          await prisma.notification.create({
            data: {
              userId,
              type: "NFT_MINTED",
              title: `NFT Minted: ${achTitle}!`,
              message: `Milestone reached! Your NFT proof has been minted on Injective.`,
            },
          });

          mintedNFTs.push(nftRecord);
        }
      };

      // Achievement Milestones
      await checkAndMint("First Sprint", "Complete your first study challenge", "badge_first_challenge", countCompleted >= 1);
      await checkAndMint("Habit Builder", "Maintain a 3-Day study streak", "badge_streak_3", newStreak >= 3);
      await checkAndMint("Unstoppable Focus", "Maintain a 7-Day study streak", "badge_streak_7", newStreak >= 7);
      await checkAndMint("Scholar Sovereign", "Maintain a 30-Day study streak", "badge_streak_30", newStreak >= 30);
      await checkAndMint("Elite Veteran", "Complete 50 study challenges", "badge_challenges_50", countCompleted >= 50);
      await checkAndMint("Legendary Sprinter", "Complete 100 study challenges", "badge_challenges_100", countCompleted >= 100);
      await checkAndMint("Grand Thinker", "Reach 100 hours of study", "badge_hours_100", totalHours >= 100);
      await checkAndMint("Ascended Mind", "Reach Level 10", "badge_level_10", currentLevel >= 10);

      return res.json({
        challenge: completedChallenge,
        xpEarned: challenge.xpReward,
        coinsEarned: challenge.coinReward,
        streak: newStreak,
        level: currentLevel,
        levelUp,
        achievementsUnlocked,
        mintedNFTs,
      });
    } catch (error) {
      console.error("Complete challenge error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
