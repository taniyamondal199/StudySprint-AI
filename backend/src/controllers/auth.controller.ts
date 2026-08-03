import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";
import { InjectiveService } from "../services/injective.service";

const JWT_SECRET = process.env.JWT_SECRET || "studysprint_jwt_secret_key";

export class AuthController {
  /**
   * Request a challenge message for signature verification.
   */
  public static async getChallenge(req: Request, res: Response): Promise<any> {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: "walletAddress is required" });
    }

    const timestamp = Date.now();
    const challenge = `StudySprint AI Login Challenge:\nWallet: ${walletAddress.toLowerCase()}\nTimestamp: ${timestamp}\n\nSign this message to log in to StudySprint.`;

    return res.json({ challenge });
  }

  /**
   * Verify wallet signature and return JWT token.
   */
  public static async verify(req: Request, res: Response): Promise<any> {
    const { walletAddress, message, signature } = req.body;

    if (!walletAddress || !message || !signature) {
      return res.status(400).json({ error: "walletAddress, message, and signature are required" });
    }

    // Parse timestamp from message to prevent replay attacks
    const tsMatch = message.match(/Timestamp: (\d+)/);
    if (!tsMatch) {
      return res.status(400).json({ error: "Invalid challenge message structure" });
    }

    const messageTimestamp = parseInt(tsMatch[1], 10);
    const timeDiff = Date.now() - messageTimestamp;
    
    // Accept challenges signed within the last 10 minutes
    if (timeDiff > 10 * 60 * 1000 || timeDiff < -60 * 1000) {
      return res.status(400).json({ error: "Challenge message has expired" });
    }

    // Verify signature
    const isValid = InjectiveService.verifyWalletSignature(walletAddress, message, signature);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid wallet signature" });
    }

    try {
      // Find or create user
      let user = await prisma.user.findUnique({
        where: { walletAddress: walletAddress.toLowerCase() },
      });

      if (!user) {
        // Generate random placeholder username
        const randNum = Math.floor(1000 + Math.random() * 9000);
        user = await prisma.user.create({
          data: {
            walletAddress: walletAddress.toLowerCase(),
            username: `Sprinter_${randNum}`,
            avatar: `avatar_${Math.floor(Math.random() * 8) + 1}`,
          },
        });

        // Add a welcome notification
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: "LEVEL_UP",
            title: "Welcome to StudySprint AI!",
            message: "Earn XP by completing study sprints and unlock NFT Achievements verified on Injective.",
          },
        });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, walletAddress: user.walletAddress },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          username: user.username,
          bio: user.bio,
          avatar: user.avatar,
          level: user.level,
          xp: user.xp,
          coins: user.coins,
          streak: user.streak,
        },
      });
    } catch (error) {
      console.error("Auth verification database error:", error);
      return res.status(500).json({ error: "Internal server error during authentication" });
    }
  }
}
