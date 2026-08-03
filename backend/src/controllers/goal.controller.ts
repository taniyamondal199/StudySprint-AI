import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prisma/client";

export class GoalController {
  /**
   * Create a new study goal.
   */
  public static async createGoal(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const { title, targetValue, type, category } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!title || !targetValue || !type || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const goal = await prisma.goal.create({
        data: {
          title,
          targetValue: parseInt(targetValue, 10),
          type, // DAILY, WEEKLY, MONTHLY
          category,
          userId,
        },
      });

      return res.status(201).json(goal);
    } catch (error) {
      console.error("Create goal error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * List all user goals.
   */
  public static async getGoals(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const goals = await prisma.goal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return res.json(goals);
    } catch (error) {
      console.error("Get goals error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Update goal progress or title.
   */
  public static async updateGoal(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const id = req.params.id as string;
    const { currentValue, title } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const goal = await prisma.goal.findFirst({
        where: { id, userId },
      });

      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }

      const updatedGoal = await prisma.goal.update({
        where: { id },
        data: {
          ...(currentValue !== undefined && { currentValue: parseInt(currentValue, 10) }),
          ...(title && { title }),
        },
      });

      return res.json(updatedGoal);
    } catch (error) {
      console.error("Update goal error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Delete a goal.
   */
  public static async deleteGoal(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const id = req.params.id as string;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const goal = await prisma.goal.findFirst({
        where: { id, userId },
      });

      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }

      await prisma.goal.delete({
        where: { id },
      });

      return res.json({ message: "Goal deleted successfully" });
    } catch (error) {
      console.error("Delete goal error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
