import React, { useState, useEffect } from "react";
import { leaderboardAPI } from "../services/api";
import { 
  ListOrdered, 
  Search, 
  Coins, 
  Flame, 
  Award,
  Crown,
  TrendingUp,
  Clock,
  CheckSquare
} from "lucide-react";

export const Leaderboard: React.FC = () => {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [period, setPeriod] = useState<string>("all-time");
  const [sortBy, setSortBy] = useState<string>("xp");

  useEffect(() => {
    fetchRankings();
  }, [period, sortBy]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const res = await leaderboardAPI.getLeaderboard(sortBy, period);
      setRankings(res.data);
    } catch (err) {
      console.error("Failed to load rankings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Filter rankings based on search query
  const filteredRankings = rankings.filter((r) =>
    r.username.toLowerCase().includes(search.toLowerCase()) ||
    r.walletAddress.toLowerCase().includes(search.toLowerCase())
  );

  // Top 3 for Podium
  const top3 = filteredRankings.slice(0, 3);
  const remaining = filteredRankings.slice(3);

  // Podium Positions mapping (Top 2 is left, Top 1 is center, Top 3 is right)
  const podiumData = [
    { rank: 2, data: top3[1], color: "from-slate-350 to-slate-400 dark:from-slate-700 dark:to-slate-800", label: "Silver", height: "h-36" },
    { rank: 1, data: top3[0], color: "from-amber-400 to-amber-500", label: "Gold", height: "h-44" },
    { rank: 3, data: top3[2], color: "from-amber-700 to-amber-800", label: "Bronze", height: "h-28" }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-slate-800 dark:text-white">Arena Leaderboard</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Compete with student sprinters in global study tournaments</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search sprinter..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-4 items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-4">
        {/* Period Switch */}
        <div className="flex bg-slate-100 dark:bg-slate-900/80 p-0.5 rounded-xl border border-slate-200/20 dark:border-slate-800/40">
          {(["weekly", "monthly", "all-time"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
                period === t
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Sort Metrics Switch */}
        <div className="flex bg-slate-100 dark:bg-slate-900/80 p-0.5 rounded-xl border border-slate-200/20 dark:border-slate-800/40">
          {[
            { key: "xp", label: "XP", icon: TrendingUp },
            { key: "challenges", label: "Targets", icon: CheckSquare },
            { key: "hours", label: "Hours", icon: Clock },
            { key: "nfts", label: "NFTs", icon: Award }
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.key}
                onClick={() => setSortBy(m.key)}
                className={`px-3 py-2 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-1.5 ${
                  sortBy === m.key
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-60 shimmer-skeleton rounded-3xl w-full"></div>
          <div className="h-32 shimmer-skeleton rounded-3xl w-full"></div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Animated Podium (Only render when there's top candidates) */}
          {top3.length > 0 && (
            <div className="flex items-end justify-center gap-4 md:gap-8 pt-8 max-w-2xl mx-auto">
              
              {/* Silver (Rank 2) - Render Left */}
              {top3[1] && (
                <div className="flex flex-col items-center w-28 md:w-32 animate-[fade-in_0.5s]">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-350 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xl mb-2">🧑‍💻</div>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-white truncate max-w-full">{top3[1].username}</span>
                  <span className="text-[10px] text-slate-400 font-bold mb-3">Lvl {top3[1].level}</span>
                  <div className="w-full bg-gradient-to-t from-slate-400/40 to-slate-500/10 border border-slate-300 dark:border-slate-800 rounded-t-3xl h-28 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-500">2</span>
                    <span className="text-[9px] font-bold text-slate-400">
                      {sortBy === "xp" ? `${top3[1].xp} XP` :
                       sortBy === "challenges" ? `${top3[1].completedChallengesCount} Target` :
                       sortBy === "hours" ? `${top3[1].studyHours} Hrs` : `${top3[1].nftsCount} NFTs`}
                    </span>
                  </div>
                </div>
              )}

              {/* Gold (Rank 1) - Render Center */}
              {top3[0] && (
                <div className="flex flex-col items-center w-32 md:w-36 animate-[fade-in_0.3s]">
                  <div className="relative">
                    <Crown className="w-6 h-6 text-amber-400 fill-amber-400 absolute -top-4 left-1/2 -translate-x-1/2 rotate-12" />
                    <div className="w-16 h-16 rounded-full border-4 border-amber-400 bg-amber-50 dark:bg-slate-900 flex items-center justify-center text-2xl mb-2 shadow-lg">🧙‍♂️</div>
                  </div>
                  <span className="text-sm font-black text-slate-855 dark:text-white truncate max-w-full">{top3[0].username}</span>
                  <span className="text-xs text-amber-500 font-bold mb-3">Lvl {top3[0].level}</span>
                  <div className="w-full bg-gradient-to-t from-amber-400/30 to-amber-500/10 border border-amber-400/30 rounded-t-3xl h-36 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-amber-500">1</span>
                    <span className="text-[10px] font-black text-amber-600">
                      {sortBy === "xp" ? `${top3[0].xp} XP` :
                       sortBy === "challenges" ? `${top3[0].completedChallengesCount} Targets` :
                       sortBy === "hours" ? `${top3[0].studyHours} Hrs` : `${top3[0].nftsCount} NFTs`}
                    </span>
                  </div>
                </div>
              )}

              {/* Bronze (Rank 3) - Render Right */}
              {top3[2] && (
                <div className="flex flex-col items-center w-28 md:w-32 animate-[fade-in_0.6s]">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-700 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xl mb-2">🚀</div>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-white truncate max-w-full">{top3[2].username}</span>
                  <span className="text-[10px] text-slate-400 font-bold mb-3">Lvl {top3[2].level}</span>
                  <div className="w-full bg-gradient-to-t from-amber-700/40 to-amber-800/10 border border-amber-700/30 rounded-t-3xl h-24 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-amber-800">3</span>
                    <span className="text-[9px] font-bold text-slate-400">
                      {sortBy === "xp" ? `${top3[2].xp} XP` :
                       sortBy === "challenges" ? `${top3[2].completedChallengesCount} Target` :
                       sortBy === "hours" ? `${top3[2].studyHours} Hrs` : `${top3[2].nftsCount} NFTs`}
                    </span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Leaderboard Rankings List */}
          <div className="glass-card rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-md overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-6">
              <span className="w-12">Rank</span>
              <span className="flex-1">Student Sprinter</span>
              <span className="w-24 text-center">Streak</span>
              <span className="w-28 text-right">Score</span>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-900">
              {filteredRankings.length === 0 ? (
                <div className="p-10 text-center text-xs text-slate-400 dark:text-slate-500">
                  No sprinters match the search criteria.
                </div>
              ) : (
                filteredRankings.map((r) => (
                  <div 
                    key={r.id} 
                    className="p-4 px-6 flex items-center justify-between text-xs hover:bg-slate-100/30 dark:hover:bg-slate-900/10 transition-colors"
                  >
                    {/* Rank */}
                    <span className="w-12 font-black text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      {r.rank === 1 && "🥇"}
                      {r.rank === 2 && "🥈"}
                      {r.rank === 3 && "🥉"}
                      {r.rank > 3 && `#${r.rank}`}
                    </span>

                    {/* Username & Avatar */}
                    <div className="flex-1 flex items-center gap-3 pr-4 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center text-sm shrink-0">
                        {r.avatar === "avatar_1" && "🧑‍🎓"}
                        {r.avatar === "avatar_2" && "👩‍💻"}
                        {r.avatar === "avatar_3" && "🧙‍♂️"}
                        {r.avatar === "avatar_4" && "🚀"}
                        {r.avatar === "avatar_5" && "🐱"}
                        {r.avatar === "avatar_6" && "🎓"}
                        {r.avatar === "avatar_7" && "🦁"}
                        {r.avatar === "avatar_8" && "🦄"}
                        {!r.avatar.startsWith("avatar_") && "⚡"}
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-slate-800 dark:text-slate-100 block truncate">{r.username}</span>
                        <span className="text-[9px] font-bold text-slate-400 select-all font-mono block truncate">{r.walletAddress}</span>
                      </div>
                    </div>

                    {/* Streak */}
                    <span className="w-24 text-center font-black text-red-500 flex items-center justify-center gap-1">
                      <Flame className="w-4 h-4 fill-red-500/15" /> {r.streak}d
                    </span>

                    {/* Metrics value */}
                    <div className="w-28 text-right shrink-0">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {sortBy === "xp" && `${r.xp} XP`}
                        {sortBy === "challenges" && `${r.completedChallengesCount} Sprints`}
                        {sortBy === "hours" && `${r.studyHours} Hrs`}
                        {sortBy === "nfts" && `${r.nftsCount} NFTs`}
                      </span>
                      <span className="text-[9px] text-slate-400 block font-medium">Level {r.level}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
