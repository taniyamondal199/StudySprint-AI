import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prisma/client";

export class NotificationController {
  /**
   * Fetch all notifications for the user.
   */
  public static async getNotifications(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 30,
      });

      return res.json(notifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Mark all notifications as read or mark a specific notification.
   */
  public static async markRead(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const id = req.params.id as string | undefined; // Optional notification ID

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      if (id) {
        // Mark specific read
        const notif = await prisma.notification.findFirst({
          where: { id: id as string, userId },
        });

        if (!notif) return res.status(404).json({ error: "Notification not found" });

        const updated = await prisma.notification.update({
          where: { id: id as string },
          data: { isRead: true },
        });
        return res.json(updated);
      } else {
        // Mark all read
        await prisma.notification.updateMany({
          where: { userId, isRead: false },
          data: { isRead: true },
        });
        return res.json({ message: "All notifications marked as read" });
      }
    } catch (error) {
      console.error("Mark notification read error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
