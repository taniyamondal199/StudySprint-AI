import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserController } from "../controllers/user.controller";
import { ChallengeController } from "../controllers/challenge.controller";
import { GoalController } from "../controllers/goal.controller";
import { SessionController } from "../controllers/session.controller";
import { LeaderboardController } from "../controllers/leaderboard.controller";
import { NFTController } from "../controllers/nft.controller";
import { FriendController } from "../controllers/friend.controller";
import { NotificationController } from "../controllers/notification.controller";
import { AnalyticsController } from "../controllers/analytics.controller";
import { AIController } from "../controllers/ai.controller";
import { AdminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// --- Authentication (Public) ---
router.post("/auth/challenge", AuthController.getChallenge);
router.post("/auth/verify", AuthController.verify);

// --- User Profile (Private) ---
router.get("/users/profile", authMiddleware, UserController.getProfile);
router.put("/users/profile", authMiddleware, UserController.updateProfile);
router.get("/users/qr", authMiddleware, UserController.getQR);
router.get("/users/search", authMiddleware, UserController.searchUsers);

// --- Challenges (Private) ---
router.get("/challenges", authMiddleware, ChallengeController.getChallenges);
router.post("/challenges", authMiddleware, ChallengeController.createChallenge);
router.delete("/challenges/:id", authMiddleware, ChallengeController.deleteChallenge);
router.post("/challenges/:id/complete", authMiddleware, ChallengeController.completeChallenge);

// --- Goals (Private) ---
router.get("/goals", authMiddleware, GoalController.getGoals);
router.post("/goals", authMiddleware, GoalController.createGoal);
router.put("/goals/:id", authMiddleware, GoalController.updateGoal);
router.delete("/goals/:id", authMiddleware, GoalController.deleteGoal);

// --- Study Sessions (Private) ---
router.post("/sessions", authMiddleware, SessionController.createSession);
router.post("/sessions/sync", authMiddleware, SessionController.syncOfflineSessions);

// --- Leaderboard (Private) ---
router.get("/leaderboard", authMiddleware, LeaderboardController.getLeaderboard);

// --- NFTs (Private) ---
router.get("/nfts", authMiddleware, NFTController.getNFTs);

// --- Friend Connections (Private) ---
router.get("/friends", authMiddleware, FriendController.getFriends);
router.post("/friends", authMiddleware, FriendController.addFriend);
router.post("/friends/accept", authMiddleware, FriendController.acceptFriend);
router.delete("/friends/:id", authMiddleware, FriendController.rejectOrRemove);

// --- Notifications (Private) ---
router.get("/notifications", authMiddleware, NotificationController.getNotifications);
router.put("/notifications", authMiddleware, NotificationController.markRead);
router.put("/notifications/:id", authMiddleware, NotificationController.markRead);

// --- Analytics (Private) ---
router.get("/analytics", authMiddleware, AnalyticsController.getStats);
router.get("/analytics/report", authMiddleware, AnalyticsController.getPdfReport);

// --- AI Companion Services (Public/Private depending on preference, securing here for user specificity) ---
router.post("/ai/plan", authMiddleware, AIController.generatePlan);
router.post("/ai/quiz", authMiddleware, AIController.generateQuiz);
router.post("/ai/notes", authMiddleware, AIController.generateNotesSummary);

// --- Admin Features (Private) ---
router.get("/admin/stats", authMiddleware, AdminController.getPlatformStats);
router.post("/admin/featured-challenge", authMiddleware, AdminController.createFeaturedChallenge);
router.delete("/admin/users/:id", authMiddleware, AdminController.deleteUser);

export default router;
