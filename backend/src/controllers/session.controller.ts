import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prisma/client";

export class SessionController {
  /**
   * Save a newly completed study session (e.g. Pomodoro timer finish).
   * Automatically updates matching user goals.
   */
  public static async createSession(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const { id, duration, startTime, endTime, category, mode } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!duration || !startTime || !endTime || !category || !mode) {
      return res.status(400).json({ error: "Missing required session fields" });
    }

    try {
      // Deduplicate check (if ID is client-supplied and already exists)
      if (id) {
        const existing = await prisma.studySession.findUnique({ where: { id } });
        if (existing) {
          return res.status(200).json(existing);
        }
      }

      const session = await prisma.studySession.create({
        data: {
          id: id || undefined,
          duration: parseInt(duration, 10),
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          category,
          mode,
          synced: true,
          userId,
        },
      });

      // Update matching user goals
      await this.updateUserGoals(userId, category, parseInt(duration, 10));

      return res.status(201).json(session);
    } catch (error) {
      console.error("Create study session error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Batch synchronize offline-recorded study sessions.
   */
  public static async syncOfflineSessions(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const { sessions } = req.body; // Array of session objects

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!sessions || !Array.isArray(sessions)) {
      return res.status(400).json({ error: "Sessions array is required" });
    }

    try {
      const syncedSessions = [];
      let totalSyncedDuration = 0;

      for (const s of sessions) {
        if (!s.id || !s.duration || !s.startTime || !s.endTime || !s.category || !s.mode) {
          continue; // Skip invalid records
        }

        // Deduplication check
        const existing = await prisma.studySession.findUnique({ where: { id: s.id } });
        if (existing) {
          continue; // Skip duplicates
        }

        const session = await prisma.studySession.create({
          data: {
            id: s.id,
            duration: parseInt(s.duration, 10),
            startTime: new Date(s.startTime),
            endTime: new Date(s.endTime),
            category: s.category,
            mode: s.mode,
            synced: true,
            userId,
          },
        });

        syncedSessions.push(session);
        totalSyncedDuration += session.duration;

        // Update goals for this specific session category
        await this.updateUserGoals(userId, session.category, session.duration);
      }

      return res.json({
        message: "Offline sync completed successfully",
        count: syncedSessions.length,
        synced: syncedSessions,
        totalSyncedDuration,
      });
    } catch (error) {
      console.error("Offline sync study sessions error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Helper to increment user goals that match study categories.
   */
  private static async updateUserGoals(userId: string, category: string, durationMinutes: number) {
    try {
      // Find goals for this user that are active and either match the category or are a general category
      const goals = await prisma.goal.findMany({
        where: {
          userId,
          OR: [
            { category: { equals: category, mode: "insensitive" } },
            { category: { equals: "general", mode: "insensitive" } },
            { category: { equals: "all", mode: "insensitive" } },
          ],
        },
      });

      for (const goal of goals) {
        await prisma.goal.update({
          where: { id: goal.id },
          data: {
            currentValue: {
              increment: durationMinutes,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error updating user goals from session:", error);
    }
  }
}
