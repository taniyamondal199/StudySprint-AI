import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://backend-api-production-111a.up.railway.app/api";

// Create Axios Instance
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to inject JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("studysprint_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  getChallenge: (walletAddress: string) =>
    api.post("/auth/challenge", { walletAddress }),
  verify: (walletAddress: string, message: string, signature: string) =>
    api.post("/auth/verify", { walletAddress, message, signature }),
};

export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: { username?: string; bio?: string; avatar?: string }) =>
    api.put("/users/profile", data),
  getQRData: () => api.get("/users/qr"),
  searchUsers: (query: string) => api.get(`/users/search?query=${query}`),
};

export const challengeAPI = {
  getChallenges: () => api.get("/challenges"),
  createChallenge: (data: {
    title: string;
    description?: string;
    category: string;
    difficulty: string;
    deadline: string;
    duration: number;
  }) => api.post("/challenges", data),
  deleteChallenge: (id: string) => api.delete(`/challenges/${id}`),
  completeChallenge: (id: string) => api.post(`/challenges/${id}/complete`),
};

export const goalAPI = {
  getGoals: () => api.get("/goals"),
  createGoal: (data: {
    title: string;
    targetValue: number;
    type: string;
    category: string;
  }) => api.post("/goals", data),
  updateGoal: (id: string, data: { currentValue?: number; title?: string }) =>
    api.put(`/goals/${id}`, data),
  deleteGoal: (id: string) => api.delete(`/goals/${id}`),
};

export const sessionAPI = {
  saveSession: (data: {
    id?: string;
    duration: number;
    startTime: string;
    endTime: string;
    category: string;
    mode: string;
  }) => api.post("/sessions", data),
  syncOfflineSessions: (sessions: any[]) =>
    api.post("/sessions/sync", { sessions }),
};

export const leaderboardAPI = {
  getLeaderboard: (sortBy = "xp", period = "all-time") =>
    api.get(`/leaderboard?sortBy=${sortBy}&period=${period}`),
};

export const nftAPI = {
  getNFTs: () => api.get("/nfts"),
};

export const friendAPI = {
  getFriends: () => api.get("/friends"),
  addFriend: (friendWalletOrId: string) =>
    api.post("/friends", { friendWalletOrId }),
  acceptFriend: (requestId: string) =>
    api.post("/friends/accept", { requestId }),
  removeFriend: (id: string) => api.delete(`/friends/${id}`),
};

export const notificationAPI = {
  getNotifications: () => api.get("/notifications"),
  markAllRead: () => api.put("/notifications"),
  markRead: (id: string) => api.put(`/notifications/${id}`),
};

export const analyticsAPI = {
  getStats: () => api.get("/analytics"),
  getReportData: () => api.get("/analytics/report"),
};

export const aiAPI = {
  generatePlan: (data: { subject: string; hoursPerDay: number; examDate: string }) =>
    api.post("/ai/plan", data),
  generateQuiz: (topic: string) => api.post("/ai/quiz", { topic }),
  generateNotesSummary: (notes: string) => api.post("/ai/notes", { notes }),
};

export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  createFeaturedChallenge: (data: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    duration: number;
  }) => api.post("/admin/featured-challenge", data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
};
