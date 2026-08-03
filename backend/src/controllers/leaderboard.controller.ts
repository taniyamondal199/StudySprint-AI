import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prisma/client";

export class LeaderboardController {
  /**
   * Fetch rankings with options for filters (sortBy, period).
   */
  public static async getLeaderboard(req: AuthenticatedRequest, res: Response): Promise<any> {
    const { sortBy = "xp", period = "all-time" } = req.query;

    try {
      const dateFilter: any = {};
      const now = new Date();

      if (period === "weekly") {
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter.createdAt = { gte: lastWeek };
      } else if (period === "monthly") {
        const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter.createdAt = { gte: lastMonth };
      }

      // Fetch users with related relations
      const users = await prisma.user.findMany({
        include: {
          challenges: {
            where: {
              status: "COMPLETED",
              ...(period !== "all-time" && { completionDate: dateFilter.createdAt }),
            },
          },
          sessions: {
            where: {
              ...(period !== "all-time" && { startTime: dateFilter.createdAt }),
            },
          },
          nfts: {
            where: {
              ...(period !== "all-time" && { mintDate: dateFilter.createdAt }),
            },
          },
        },
      });

      // Map and calculate aggregated stats
      const leaderboardData = users.map((u) => {
        const completedChallengesCount = u.challenges.length;
        const totalDurationMinutes = u.sessions.reduce((sum, s) => sum + s.duration, 0);
        const studyHours = parseFloat((totalDurationMinutes / 60).toFixed(1));
        const nftsCount = u.nfts.length;

        return {
          id: u.id,
          username: u.username,
          walletAddress: u.walletAddress,
          avatar: u.avatar,
          level: u.level,
          xp: u.xp,
          streak: u.streak,
          completedChallengesCount,
          studyHours,
          nftsCount,
        };
      });

      // Sort data dynamically
      leaderboardData.sort((a: any, b: any) => {
        if (sortBy === "challenges") {
          return b.completedChallengesCount - a.completedChallengesCount;
        } else if (sortBy === "hours") {
          return b.studyHours - a.studyHours;
        } else if (sortBy === "nfts") {
          return b.nftsCount - a.nftsCount;
        } else {
          // Default sorting: XP
          return b.xp - a.xp;
        }
      });

      // Add ranks
      const rankedData = leaderboardData.map((item, index) => ({
        rank: index + 1,
        ...item,
      }));

      return res.json(rankedData);
    } catch (error) {
      console.error("Fetch leaderboard error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
