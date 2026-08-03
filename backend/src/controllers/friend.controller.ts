import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prisma/client";

export class FriendController {
  /**
   * Send a friend request.
   */
  public static async addFriend(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const { friendWalletOrId } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!friendWalletOrId) return res.status(400).json({ error: "friendWalletOrId is required" });

    try {
      // Find friend user
      const targetUser = await prisma.user.findFirst({
        where: {
          OR: [
            { id: friendWalletOrId },
            { walletAddress: { equals: friendWalletOrId.toLowerCase(), mode: "insensitive" } },
          ],
        },
      });

      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (targetUser.id === userId) {
        return res.status(400).json({ error: "You cannot add yourself as a friend" });
      }

      // Check if relationship already exists
      const existing = await prisma.friend.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: targetUser.id },
            { senderId: targetUser.id, receiverId: userId },
          ],
        },
      });

      if (existing) {
        return res.status(400).json({
          error: existing.status === "ACCEPTED" ? "Already friends" : "Friend request already pending",
        });
      }

      // Create request
      const request = await prisma.friend.create({
        data: {
          senderId: userId,
          receiverId: targetUser.id,
          status: "PENDING",
        },
      });

      // Notify the receiver
      const senderUser = await prisma.user.findUnique({ where: { id: userId } });
      await prisma.notification.create({
        data: {
          userId: targetUser.id,
          type: "FRIEND_REQUEST",
          title: "New Friend Request",
          message: `${senderUser?.username || "Someone"} sent you a friend request.`,
        },
      });

      return res.status(201).json(request);
    } catch (error) {
      console.error("Add friend error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Accept friend request.
   */
  public static async acceptFriend(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const { requestId } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!requestId) return res.status(400).json({ error: "requestId is required" });

    try {
      const request = await prisma.friend.findUnique({ where: { id: requestId } });

      if (!request || request.receiverId !== userId) {
        return res.status(404).json({ error: "Friend request not found or unauthorized" });
      }

      const updated = await prisma.friend.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
      });

      // Notify sender
      const receiverUser = await prisma.user.findUnique({ where: { id: userId } });
      await prisma.notification.create({
        data: {
          userId: request.senderId,
          type: "FRIEND_REQUEST",
          title: "Friend Request Accepted",
          message: `${receiverUser?.username || "A user"} accepted your friend request.`,
        },
      });

      return res.json(updated);
    } catch (error) {
      console.error("Accept friend error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Reject or remove friend request.
   */
  public static async rejectOrRemove(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    const id = req.params.id as string; // Friendship/Request ID

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const friendship = await prisma.friend.findFirst({
        where: {
          id,
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      });

      if (!friendship) {
        return res.status(404).json({ error: "Friendship not found" });
      }

      await prisma.friend.delete({
        where: { id },
      });

      return res.json({ message: "Friendship removed successfully" });
    } catch (error) {
      console.error("Remove friend error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * List all friends (status ACCEPTED).
   */
  public static async getFriends(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const friends = await prisma.friend.findMany({
        where: {
          status: "ACCEPTED",
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        include: {
          sender: {
            select: {
              id: true,
              walletAddress: true,
              username: true,
              avatar: true,
              level: true,
              streak: true,
            },
          },
          receiver: {
            select: {
              id: true,
              walletAddress: true,
              username: true,
              avatar: true,
              level: true,
              streak: true,
            },
          },
        },
      });

      // Map to return friend's profile directly
      const list = friends.map((f) => {
        const friendProfile = f.senderId === userId ? f.receiver : f.sender;
        return {
          friendshipId: f.id,
          ...friendProfile,
        };
      });

      // Get incoming pending requests
      const pending = await prisma.friend.findMany({
        where: {
          receiverId: userId,
          status: "PENDING",
        },
        include: {
          sender: {
            select: {
              id: true,
              walletAddress: true,
              username: true,
              avatar: true,
              level: true,
            },
          },
        },
      });

      const pendingList = pending.map((p) => ({
        requestId: p.id,
        ...p.sender,
      }));

      return res.json({ friends: list, pending: pendingList });
    } catch (error) {
      console.error("Get friends error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
