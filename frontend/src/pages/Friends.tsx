import React, { useState, useEffect } from "react";
import { friendAPI, userAPI } from "../services/api";
import { useWallet } from "../context/WalletContext";
import { 
  Users, 
  Search, 
  UserPlus, 
  UserMinus, 
  Check, 
  X, 
  Flame, 
  Coins, 
  Award,
  HelpCircle,
  Clock
} from "lucide-react";

export const Friends: React.FC = () => {
  const { user } = useWallet();
  const [friends, setFriends] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searching, setSearching] = useState<boolean>(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await friendAPI.getFriends();
      setFriends(res.data.friends || []);
      setPending(res.data.pending || []);
    } catch (err) {
      console.error("Failed to load friends list:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    try {
      const res = await userAPI.searchUsers(searchQuery);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Failed to search users:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFriend = async (walletOrId: string) => {
    try {
      await friendAPI.addFriend(walletOrId);
      alert("Friend request sent!");
      // Reset search results
      setSearchResults(searchResults.filter(u => u.id !== walletOrId && u.walletAddress !== walletOrId));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to send request.");
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await friendAPI.acceptFriend(requestId);
      // Reload lists
      fetchFriends();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveOrReject = async (friendshipOrRequestId: string) => {
    try {
      await friendAPI.removeFriend(friendshipOrRequestId);
      // Reload lists
      fetchFriends();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-slate-800 dark:text-white">Friends Network</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Connect with peer sprinters, track streaks, and learn together</p>
          </div>
        </div>

        {/* Add Friend Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search username or wallet..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-black shadow-md shadow-primary/10 transition-all shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search results listing */}
      {searchQuery && (searchResults.length > 0 || searching) && (
        <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-xs text-slate-455 dark:text-slate-400 uppercase tracking-widest">Search Results</h3>
          {searching ? (
            <div className="h-10 shimmer-skeleton rounded-xl"></div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-900">
              {searchResults.map((resUser) => (
                <div key={resUser.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🧑‍🎓</span>
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-white block">{resUser.username}</span>
                      <span className="text-[9px] text-slate-400 select-all font-mono block">{resUser.walletAddress}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFriend(resUser.id)}
                    className="px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-black rounded-xl transition-all flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Request
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid: Pending Invites & Friend cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Pending Requests Feed */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Pending Invites ({pending.length})
          </h3>

          <div className="glass-card rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm min-h-[150px]">
            {pending.length === 0 ? (
              <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-10">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {pending.map((p) => (
                  <div key={p.requestId} className="flex items-center justify-between text-xs p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl">
                    <div className="min-w-0 pr-3">
                      <span className="font-extrabold text-slate-800 dark:text-white truncate block">{p.username}</span>
                      <span className="text-[9px] text-slate-400 block font-bold">Lvl {p.level}</span>
                    </div>
                    
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAcceptRequest(p.requestId)}
                        className="p-1.5 bg-emerald-500 text-white rounded-lg hover:opacity-90 transition-all"
                        title="Accept"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveOrReject(p.requestId)}
                        className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                        title="Reject"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Friends Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Active Friends ({friends.length})
          </h3>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-40 shimmer-skeleton rounded-3xl"></div>
              <div className="h-40 shimmer-skeleton rounded-3xl"></div>
            </div>
          ) : friends.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl text-slate-400 text-xs font-semibold py-14">
              <HelpCircle className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-2" />
              <span>No friends added yet. Use the search box above to connect!</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {friends.map((f) => (
                <div 
                  key={f.id} 
                  className="glass-card rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between hover:shadow-sm transition-all space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg">
                      {f.avatar === "avatar_1" && "🧑‍🎓"}
                      {f.avatar === "avatar_2" && "👩‍💻"}
                      {f.avatar === "avatar_3" && "🧙‍♂️"}
                      {f.avatar === "avatar_4" && "🚀"}
                      {f.avatar === "avatar_5" && "🐱"}
                      {f.avatar === "avatar_6" && "🎓"}
                      {f.avatar === "avatar_7" && "🦁"}
                      {f.avatar === "avatar_8" && "🦄"}
                      {!f.avatar.startsWith("avatar_") && "⚡"}
                    </div>
                    
                    <div className="min-w-0">
                      <span className="font-extrabold text-slate-800 dark:text-white truncate block">{f.username}</span>
                      <span className="text-[10px] text-primary font-bold">Level {f.level}</span>
                    </div>
                  </div>

                  {/* Comparisons box */}
                  <div className="flex justify-between border-t border-slate-100 dark:border-slate-900 pt-3 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1 text-red-500">
                      <Flame className="w-4 h-4 fill-red-500/15" /> Streak: {f.streak}d
                    </span>
                    
                    <button
                      onClick={() => handleRemoveOrReject(f.friendshipId)}
                      className="text-rose-500 hover:text-rose-600 transition-all flex items-center gap-1"
                    >
                      <UserMinus className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
