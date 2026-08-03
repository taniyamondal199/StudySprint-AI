import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prisma/client";

export class AdminController {
  /**
   * Fetch aggregated statistics for the entire platform.
   */
  public static async getPlatformStats(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      const usersCount = await prisma.user.count();
      const challengesCount = await prisma.challenge.count();
      const completedChallengesCount = await prisma.challenge.count({
        where: { status: "COMPLETED" },
      });
      const sessions = await prisma.studySession.findMany();
      const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
      const nftsCount = await prisma.nFT.count();

      return res.json({
        totalUsers: usersCount,
        totalChallengesCreated: challengesCount,
        totalChallengesCompleted: completedChallengesCount,
        totalStudyHours: parseFloat(totalHours.toFixed(1)),
        totalNftsMinted: nftsCount,
      });
    } catch (error) {
      console.error("Fetch admin stats error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Delete a spam user profile.
   */
  public static async deleteUser(req: AuthenticatedRequest, res: Response): Promise<any> {
    const id = req.params.id as string;

    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await prisma.user.delete({ where: { id } });

      return res.json({ message: `User ${user.username} deleted successfully` });
    } catch (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Dispatch a featured challenge to all current users.
   */
  public static async createFeaturedChallenge(req: AuthenticatedRequest, res: Response): Promise<any> {
    const { title, description, category, difficulty, duration } = req.body;

    if (!title || !category || !difficulty || !duration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const users = await prisma.user.findMany();
      let multiplier = 1;
      if (difficulty.toLowerCase() === "medium") multiplier = 1.5;
      if (difficulty.toLowerCase() === "hard") multiplier = 2.0;

      const xpReward = Math.round(duration * 2 * multiplier);
      const coinReward = Math.round(duration * multiplier);

      const challengePromises = users.map((u) => {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7); // 7 days deadline

        return prisma.challenge.create({
          data: {
            title: `🏆 Featured: ${title}`,
            description,
            category,
            difficulty,
            deadline,
            duration: parseInt(duration, 10),
            xpReward,
            coinReward,
            status: "PENDING",
            userId: u.id,
          },
        });
      });

      await Promise.all(challengePromises);

      // Notify all users
      const notificationPromises = users.map((u) =>
        prisma.notification.create({
          data: {
            userId: u.id,
            type: "CHALLENGE_COMPLETE",
            title: "New Featured Challenge Available!",
            message: `Accept the new featured challenge: "${title}" for extra rewards!`,
          },
        })
      );
      await Promise.all(notificationPromises);

      return res.status(201).json({
        message: `Featured challenge dispatched to ${users.length} users.`,
      });
    } catch (error) {
      console.error("Create featured challenge error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
