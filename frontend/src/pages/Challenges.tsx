import React, { useState, useEffect } from "react";
import { challengeAPI } from "../services/api";
import { useWallet } from "../context/WalletContext";
import { triggerConfetti } from "../utils/confetti";
import { 
  Trophy, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  ExternalLink,
  Flame,
  Award,
  AlertCircle
} from "lucide-react";

export const Challenges: React.FC = () => {
  const { isConnected, refreshProfile } = useWallet();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Form State
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "DSA",
    difficulty: "Easy",
    deadline: "",
    duration: 60,
  });

  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await challengeAPI.getChallenges();
      setChallenges(res.data);
    } catch (err) {
      console.error("Failed to load challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.deadline) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await challengeAPI.createChallenge({
        ...form,
        duration: parseInt(form.duration.toString(), 10),
      });
      setChallenges([res.data, ...challenges]);
      setShowAddForm(false);
      setForm({
        title: "",
        description: "",
        category: "DSA",
        difficulty: "Easy",
        deadline: "",
        duration: 60,
      });
    } catch (err) {
      console.error("Failed to create challenge:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return;
    try {
      await challengeAPI.deleteChallenge(id);
      setChallenges(challenges.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete challenge:", err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const res = await challengeAPI.completeChallenge(id);
      triggerConfetti();
      setChallenges(prev =>
        prev.map(c => (c.id === id ? { ...c, status: "COMPLETED", txHash: res.data.challenge.txHash } : c))
      );
      refreshProfile();
      alert(`Challenge Completed! Proof sent to Injective Testnet.\nTx: ${res.data.challenge.txHash}`);
    } catch (err) {
      console.error("Failed to complete challenge:", err);
    }
  };

  const activeChallenges = challenges.filter(c => c.status === "PENDING");
  const completedChallenges = challenges.filter(c => c.status === "COMPLETED");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-slate-800 dark:text-white">Study Sprints</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Log study targets and secure on-chain completion credentials</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black shadow-md shadow-primary/15 hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Challenge
        </button>
      </div>

      {/* Create form Popover */}
      {showAddForm && (
        <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/80 max-w-xl animate-fade-in">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Set Custom Sprint Target</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Title *</label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleInputChange}
                className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                placeholder="e.g. Study Operating Systems Memory Allocation"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Description</label>
              <textarea
                name="description"
                rows={2}
                value={form.description}
                onChange={handleInputChange}
                className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl p-4 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                placeholder="Briefly summarize what needs completion..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="DSA">Data Structures & Algos</option>
                  <option value="Web3">Injective Smart Contracts</option>
                  <option value="DBMS">Database Systems (DBMS)</option>
                  <option value="OS">Operating Systems (OS)</option>
                  <option value="General">General Study</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Difficulty</label>
                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Easy">Easy (1.0x XP)</option>
                  <option value="Medium">Medium (1.5x XP)</option>
                  <option value="Hard">Hard (2.0x XP)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Duration (Minutes)</label>
                <input
                  type="number"
                  name="duration"
                  min="5"
                  required
                  value={form.duration}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Deadline *</label>
                <input
                  type="date"
                  name="deadline"
                  required
                  value={form.deadline}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                className="flex-1 py-3.5 bg-primary text-white rounded-xl text-xs font-black shadow-md shadow-primary/10 hover:opacity-95 transition-all"
              >
                Broadcast Challenge
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3.5 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="space-y-6">
          <div className="h-44 shimmer-skeleton rounded-3xl w-full"></div>
          <div className="h-44 shimmer-skeleton rounded-3xl w-full"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Active target grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Sprints</h3>
            
            {activeChallenges.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 text-slate-400 text-xs font-semibold">
                No active sprints. Click "Create Challenge" to launch a new study target!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeChallenges.map((c) => (
                  <div key={c.id} className="glass-card rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between hover:shadow-sm transition-all space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          c.difficulty === "Easy" ? "bg-emerald-500/15 text-emerald-500" :
                          c.difficulty === "Medium" ? "bg-amber-500/15 text-amber-500" :
                          "bg-rose-500/15 text-rose-500"
                        }`}>
                          {c.difficulty}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{c.category}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-white leading-normal pr-4 truncate">{c.title}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal line-clamp-2">{c.description || "No description provided."}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-900">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due: {new Date(c.deadline).toLocaleDateString()}</span>
                        <span>⏲️ {c.duration} Mins</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleComplete(c.id)}
                          className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-sm transition-all"
                        >
                          Complete & Record
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                          title="Delete Target"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historical Completed proofs listing */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">On-Chain Verified Sprints</h3>
            
            {completedChallenges.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 text-slate-400 text-xs font-semibold">
                No verified records. Complete an active sprint target to broadcast proofs on-chain.
              </div>
            ) : (
              <div className="space-y-3">
                {completedChallenges.map((c) => (
                  <div 
                    key={c.id} 
                    className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 mb-1">
                        <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500/10" /> Verified On-Chain</span>
                        <span>&middot;</span>
                        <span>{c.category}</span>
                        <span>&middot;</span>
                        <span>Completed: {new Date(c.completionDate).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-white truncate">{c.title}</h4>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-900">
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Rewards Claimed</span>
                        <span className="text-xs font-black text-amber-500 flex items-center gap-1 justify-end mt-0.5">
                          +{c.xpReward} XP &middot; +{c.coinReward} Coins
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`https://testnet.explorer.injective.network/transaction/${c.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          Explorer <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                          title="Delete Log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
