import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prisma/client";

export class UserController {
  /**
   * Get user's own profile.
   */
  public static async getProfile(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          challenges: { take: 5, orderBy: { createdAt: "desc" } },
          achievements: true,
          nfts: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Update user profile settings.
   */
  public static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const { username, bio, avatar } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(username && { username }),
          ...(bio !== undefined && { bio }),
          ...(avatar && { avatar }),
        },
      });

      return res.json(updatedUser);
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get QR Profile representation.
   */
  public static async getQR(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          walletAddress: true,
          username: true,
          level: true,
          xp: true,
          streak: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // We package this structured format. The frontend will render it as a visual QR Code.
      const qrData = {
        app: "StudySprint AI",
        wallet: user.walletAddress,
        username: user.username,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        joined: user.createdAt,
      };

      return res.json({ qrString: JSON.stringify(qrData), profile: user });
    } catch (error) {
      console.error("Get QR profile error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Search users for social friends listing.
   */
  public static async searchUsers(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const { query } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const users = await prisma.user.findMany({
        where: {
          id: { not: userId },
          ...(query && {
            OR: [
              { username: { contains: query as string, mode: "insensitive" } },
              { walletAddress: { contains: query as string, mode: "insensitive" } },
            ],
          }),
        },
        select: {
          id: true,
          walletAddress: true,
          username: true,
          avatar: true,
          level: true,
          streak: true,
        },
        take: 10,
      });

      return res.json(users);
    } catch (error) {
      console.error("Search users error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
