import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { challengeAPI, notificationAPI } from "../services/api";
import { PomodoroTimer } from "../components/PomodoroTimer";
import { triggerConfetti } from "../utils/confetti";
import { 
  Coins, 
  Flame, 
  Trophy, 
  Sparkles, 
  Clock, 
  ExternalLink,
  CheckCircle,
  HelpCircle,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const { user, refreshProfile } = useWallet();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showProofPopup, setShowProofPopup] = useState<boolean>(false);
  const [proofData, setProofData] = useState<any>(null);

  useEffect(() => {
    fetchTodayChallenges();
  }, []);

  const fetchTodayChallenges = async () => {
    try {
      const res = await challengeAPI.getChallenges();
      // Show pending challenges first
      setChallenges(res.data.slice(0, 4));
    } catch (err) {
      console.error("Failed to load dashboard challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChallenge = async (id: string) => {
    try {
      const res = await challengeAPI.completeChallenge(id);
      triggerConfetti();
      
      // Update local state
      setChallenges(prev =>
        prev.map(c => (c.id === id ? { ...c, status: "COMPLETED", txHash: res.data.challenge.txHash } : c))
      );
      
      // Setup proof dialog
      setProofData({
        title: res.data.challenge.title,
        xpEarned: res.data.xpEarned,
        coinsEarned: res.data.coinsEarned,
        txHash: res.data.challenge.txHash,
        levelUp: res.data.levelUp,
        level: res.data.level,
        nfts: res.data.mintedNFTs || [],
      });
      setShowProofPopup(true);
      refreshProfile();
    } catch (err) {
      console.error("Failed to complete challenge:", err);
      alert("Failed to record completion. Please check connection.");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      {user && (
        <div className="p-8 rounded-3xl bg-gradient-to-tr from-primary to-secondary text-white relative overflow-hidden shadow-lg shadow-primary/10">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-white/5 skew-x-12 translate-x-10 pointer-events-none"></div>
          <div className="relative z-10 space-y-2 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-black">
              Welcome back, {user.username}!
            </h2>
            <p className="text-xs md:text-sm text-slate-100/90 leading-relaxed font-semibold">
              Ready for today's study sprints? Complete pending challenges to broadcast proofs to Injective and unlock custom NFT badges.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Pomodoro & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Pomodoro Timer */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest self-start mb-4">
            Study Clock
          </h3>
          <PomodoroTimer />
        </div>

        {/* Right Column: Challenges List & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Active Challenges
            </h3>
            <Link 
              to="/challenges" 
              className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Manage Sprints
            </Link>
          </div>

          <div className="glass-card rounded-3xl p-6 shadow-md border border-slate-200/60 dark:border-slate-800">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 shimmer-skeleton rounded-2xl w-full"></div>
                ))}
              </div>
            ) : challenges.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No active challenges</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Generate a study plan with AI or create a custom challenge to start earning rewards.</p>
                </div>
                <Link
                  to="/challenges"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                >
                  Create Challenge
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {challenges.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      c.status === "COMPLETED"
                        ? "bg-slate-50/50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-900 opacity-60"
                        : "bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 hover:shadow-sm"
                    }`}
                  >
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          c.difficulty === "Easy" ? "bg-emerald-500/15 text-emerald-500" :
                          c.difficulty === "Medium" ? "bg-amber-500/15 text-amber-500" :
                          "bg-rose-500/15 text-rose-500"
                        }`}>
                          {c.difficulty}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">{c.category}</span>
                      </div>
                      <h4 className={`font-bold text-sm text-slate-800 dark:text-white mt-1 truncate ${
                        c.status === "COMPLETED" ? "line-through" : ""
                      }`}>
                        {c.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{c.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {c.status === "COMPLETED" ? (
                        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                          <CheckCircle className="w-4 h-4 fill-emerald-500/15" />
                          <span>Saved On-Chain</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCompleteChallenge(c.id)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-sm transition-all"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proof Dialog modal popup */}
      {showProofPopup && proofData && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card max-w-md w-full rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-3xl">
              🏆
            </div>
            
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Proof of Completion Validated</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your completed study challenge has been cryptographically recorded on the Injective Blockchain.
              </p>
            </div>

            {/* Stats Earned summary */}
            <div className="grid grid-cols-2 gap-4 bg-slate-100 dark:bg-slate-900/60 p-4 rounded-2xl">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">XP Earned</span>
                <span className="text-lg font-black text-primary">+{proofData.xpEarned} XP</span>
              </div>
              <div className="text-center border-l border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Gold Coins</span>
                <span className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
                  <Coins className="w-4.5 h-4.5 fill-amber-500" />
                  +{proofData.coinsEarned}
                </span>
              </div>
            </div>

            {/* Level up notifier */}
            {proofData.levelUp && (
              <div className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-500 rounded-2xl text-xs font-black flex items-center justify-center gap-2 animate-bounce">
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Level Up! You reached Level {proofData.level}</span>
              </div>
            )}

            {/* NFT unlocked indicators */}
            {proofData.nfts.length > 0 && (
              <div className="p-3.5 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary rounded-2xl text-xs font-bold text-center">
                🎉 Unlocked NFT Badge: <span className="font-extrabold">{proofData.nfts[0].title}</span>
              </div>
            )}

            {/* Transaction Hash explorer link */}
            <div className="space-y-1 text-left">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Injective Transaction Proof</span>
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="font-mono truncate pr-4">
                  {proofData.txHash}
                </span>
                <a
                  href={`https://testnet.explorer.injective.network/transaction/${proofData.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:text-primary-dark hover:underline flex items-center gap-1 shrink-0"
                >
                  Explorer <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowProofPopup(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-xs font-black shadow-md transition-all"
            >
              Continue Sprints
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
