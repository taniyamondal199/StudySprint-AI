import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prisma/client";

export class NFTController {
  /**
   * Fetch all NFTs owned by the user.
   */
  public static async getNFTs(req: AuthenticatedRequest, res: Response): Promise<any> {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const nfts = await prisma.nFT.findMany({
        where: { userId },
        orderBy: { mintDate: "desc" },
      });

      return res.json(nfts);
    } catch (error) {
      console.error("Fetch NFTs error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
