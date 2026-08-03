import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prisma/client";

export class AnalyticsController {
  /**
   * Get comprehensive study statistics for the analytics page.
   */
  public static async getStats(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ error: "User not found" });

      // Fetch all user sessions
      const sessions = await prisma.studySession.findMany({
        where: { userId },
        orderBy: { startTime: "asc" },
      });

      // Fetch challenges
      const challenges = await prisma.challenge.findMany({ where: { userId } });
      const completedCount = challenges.filter((c) => c.status === "COMPLETED").length;
      const totalCount = challenges.length;
      const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      // 1. Calculate Daily Study Hours (Last 7 Days)
      const last7DaysData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);

        const nextDay = new Date(d);
        nextDay.setDate(nextDay.getDate() + 1);

        const daySessions = sessions.filter(
          (s) => new Date(s.startTime) >= d && new Date(s.startTime) < nextDay
        );
        const dayMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
        
        last7DaysData.push({
          date: d.toLocaleDateString("en-US", { weekday: "short" }),
          fullDate: d.toISOString().split("T")[0],
          hours: parseFloat((dayMinutes / 60).toFixed(2)),
          minutes: dayMinutes,
        });
      }

      // 2. Calculate Weekly Study Hours (Last 4 Weeks)
      const weeklyData = [];
      for (let i = 3; i >= 0; i--) {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - i * 7 - startOfWeek.getDay()); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7);

        const weekSessions = sessions.filter(
          (s) => new Date(s.startTime) >= startOfWeek && new Date(s.startTime) < endOfWeek
        );
        const weekMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);

        weeklyData.push({
          week: `Week ${4 - i}`,
          hours: parseFloat((weekMinutes / 60).toFixed(2)),
        });
      }

      // 3. Heatmap calendar data (past 365 days)
      const heatmap: { [dateStr: string]: number } = {};
      sessions.forEach((s) => {
        const dateStr = new Date(s.startTime).toISOString().split("T")[0];
        heatmap[dateStr] = (heatmap[dateStr] || 0) + s.duration;
      });

      const heatmapArray = Object.keys(heatmap).map((date) => ({
        date,
        count: Math.ceil(heatmap[date] / 10), // scale count for calendar cell intensity
        minutes: heatmap[date],
      }));

      // 4. Calculate Productivity Score (formula based on completion rates + streak + study hours)
      const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
      let productivityScore = 30; // base score
      productivityScore += Math.min(30, completionRate * 0.3);
      productivityScore += Math.min(20, user.streak * 2);
      productivityScore += Math.min(20, totalHours * 0.5);
      productivityScore = Math.min(100, Math.round(productivityScore));

      return res.json({
        totalStudyHours: parseFloat(totalHours.toFixed(1)),
        completionRate,
        streak: user.streak,
        xp: user.xp,
        coins: user.coins,
        level: user.level,
        productivityScore,
        last7Days: last7DaysData,
        weekly: weeklyData,
        heatmap: heatmapArray,
      });
    } catch (error) {
      console.error("Get analytics stats error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Return structured report data for PDF generation.
   */
  public static async getPdfReport(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          challenges: { where: { status: "COMPLETED" } },
          sessions: true,
          achievements: true,
          nfts: true,
        },
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      const totalDuration = user.sessions.reduce((sum, s) => sum + s.duration, 0);
      const studyHours = (totalDuration / 60).toFixed(1);

      const report = {
        title: "StudySprint AI Performance Report",
        generatedAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        studentProfile: {
          username: user.username,
          walletAddress: user.walletAddress,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
        },
        aggregates: {
          totalHours: studyHours,
          totalSessions: user.sessions.length,
          completedChallenges: user.challenges.length,
          unlockedAchievements: user.achievements.length,
          mintedNfts: user.nfts.length,
        },
        challengesSummary: user.challenges.map((c) => ({
          title: c.title,
          category: c.category,
          difficulty: c.difficulty,
          completionDate: c.completionDate,
          txHash: c.txHash,
        })),
        achievementsSummary: user.achievements.map((a) => ({
          title: a.title,
          description: a.description,
          unlockedAt: a.unlockedAt,
        })),
      };

      return res.json(report);
    } catch (error) {
      console.error("Get PDF report error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
