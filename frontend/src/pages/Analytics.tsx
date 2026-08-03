import React, { useState, useEffect } from "react";
import { analyticsAPI } from "../services/api";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  Clock, 
  Download, 
  Award,
  Sparkles,
  Layers,
  CheckCircle2
} from "lucide-react";

export const Analytics: React.FC = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await analyticsAPI.getStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const res = await analyticsAPI.getReportData();
      const report = res.data;

      // Construct a clean, print-friendly template in a new window
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Pop-up blocker is preventing the download. Please allow pop-ups.");
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>${report.title} - ${report.studentProfile.username}</title>
            <style>
              body { font-family: 'Inter', 'Helvetica Neue', sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; }
              .header { text-align: center; border-bottom: 2px solid #6c63ff; padding-bottom: 20px; margin-bottom: 30px; }
              .header h1 { margin: 0; color: #6c63ff; font-size: 24px; }
              .header p { margin: 5px 0 0 0; color: #64748b; font-size: 14px; }
              .profile-box { display: flex; justify-content: space-between; background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e2e8f0; }
              .profile-box div { flex: 1; }
              .profile-box h3 { margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; }
              .profile-box p { margin: 0; font-weight: bold; font-size: 14px; color: #334155; }
              .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
              .grid-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; text-align: center; }
              .grid-card h3 { margin: 0; font-size: 11px; text-transform: uppercase; color: #94a3b8; }
              .grid-card p { margin: 10px 0 0 0; font-size: 20px; font-weight: 800; color: #6c63ff; }
              .section-title { font-size: 16px; font-weight: bold; border-left: 4px solid #6c63ff; padding-left: 10px; margin-bottom: 15px; color: #334155; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
              th { background: #f8fafc; color: #475569; font-weight: bold; }
              .hash { font-family: monospace; color: #64748b; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${report.title}</h1>
              <p>Generated on ${report.generatedAt}</p>
            </div>
            
            <div class="profile-box">
              <div>
                <h3>Sprinter Profile</h3>
                <p>${report.studentProfile.username}</p>
              </div>
              <div>
                <h3>Wallet Address</h3>
                <p class="hash">${report.studentProfile.walletAddress}</p>
              </div>
              <div>
                <h3>Platform Level</h3>
                <p>Level ${report.studentProfile.level} (${report.studentProfile.xp} XP)</p>
              </div>
              <div>
                <h3>Daily Streak</h3>
                <p>${report.studentProfile.streak} Days</p>
              </div>
            </div>

            <div class="grid">
              <div class="grid-card">
                <h3>Total Hours</h3>
                <p>${report.aggregates.totalHours} hrs</p>
              </div>
              <div class="grid-card">
                <h3>Total Sprints</h3>
                <p>${report.aggregates.totalSessions}</p>
              </div>
              <div class="grid-card">
                <h3>Completed Targets</h3>
                <p>${report.aggregates.completedChallenges}</p>
              </div>
              <div class="grid-card">
                <h3>Badge NFTs</h3>
                <p>${report.aggregates.mintedNfts}</p>
              </div>
            </div>

            <div class="section-title">Verified Sprints Log</div>
            <table>
              <thead>
                <tr>
                  <th>Target Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Completion Proof Hash (Injective)</th>
                </tr>
              </thead>
              <tbody>
                ${report.challengesSummary.map((c: any) => `
                  <tr>
                    <td><b>${c.title}</b></td>
                    <td>${c.category}</td>
                    <td>${c.difficulty}</td>
                    <td class="hash">${c.txHash || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="section-title font-bold">Milestones & Achievements</div>
            <table>
              <thead>
                <tr>
                  <th>Achievement Title</th>
                  <th>Description</th>
                  <th>Unlocked At</th>
                </tr>
              </thead>
              <tbody>
                ${report.achievementsSummary.map((a: any) => `
                  <tr>
                    <td><b>${a.title}</b></td>
                    <td>${a.description}</td>
                    <td>${new Date(a.unlockedAt).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error("Failed to export report:", err);
      alert("Failed to export. Please check connection.");
    }
  };

  // --- GitHub Heatmap calculation ---
  const renderHeatmap = () => {
    if (!stats || !stats.heatmap) return null;

    const days = 365;
    const heatmapCells = [];
    const today = new Date();
    
    // Convert heatmap list to a fast key-value map
    const heatMapLookup: { [dateStr: string]: number } = {};
    stats.heatmap.forEach((cell: any) => {
      heatMapLookup[cell.date] = cell.minutes;
    });

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const minutes = heatMapLookup[dateStr] || 0;

      let color = "bg-slate-200 dark:bg-slate-800";
      if (minutes > 0 && minutes <= 30) color = "bg-primary/20 dark:bg-primary/10";
      else if (minutes > 30 && minutes <= 60) color = "bg-primary/50 dark:bg-primary/40";
      else if (minutes > 60) color = "bg-primary text-white";

      heatmapCells.push(
        <div
          key={dateStr}
          className={`w-3.5 h-3.5 rounded-sm heatmap-cell ${color}`}
          title={`${date.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}: ${minutes} study mins`}
        ></div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1 max-w-full justify-start select-none">
        {heatmapCells}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-slate-800 dark:text-white">Analytics Hub</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Track and review detailed study progress over time</p>
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-64 shimmer-skeleton rounded-3xl"></div>
          <div className="h-64 shimmer-skeleton rounded-3xl"></div>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          
          {/* Numerical Analytics Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block tracking-wider">Productivity Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-primary">{stats.productivityScore}%</span>
                <span className="text-[9px] text-slate-400 font-bold flex items-center gap-0.5"><Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" /> Optimal</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block tracking-wider">Daily Streak</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-red-500 flex items-center gap-1">
                  <Flame className="w-6 h-6 fill-red-500" /> {stats.streak} Days
                </span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block tracking-wider">Study Duration</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-1">
                  <Clock className="w-5 h-5 text-slate-500" /> {stats.totalStudyHours} Hrs
                </span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block tracking-wider">Challenge Finish Rate</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {stats.completionRate}%
                </span>
              </div>
            </div>

          </div>

          {/* Recharts Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Daily study hours (last 7 days) */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-sm text-slate-855 dark:text-white">Daily Focus Sprints (Hours)</h4>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-black text-slate-400">7d history</span>
              </div>

              <div className="h-60 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.last7Days} margin={{ left: -25, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-900" />
                    <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="hours" stroke="#6C63FF" strokeWidth="2.5" fillOpacity={1} fill="url(#areaGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly study hours */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-sm text-slate-855 dark:text-white">Weekly Focus Sprints (Hours)</h4>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-black text-slate-400">4w history</span>
              </div>

              <div className="h-60 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.weekly} margin={{ left: -25, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-900" />
                    <XAxis dataKey="week" stroke="#94a3b8" tickLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* GitHub Streak Heatmap */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Activity Heatmap</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Focus minutes logged over the past 365 days. Hover cells to inspect.</p>
            </div>
            
            {renderHeatmap()}
            
            <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 border-t border-slate-100 dark:border-slate-900 pt-4 mt-2">
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-slate-200 dark:bg-slate-800 rounded-sm"></span> No Study</span>
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-primary/20 dark:bg-primary/10 rounded-sm"></span> 1-30 mins</span>
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-primary/50 dark:bg-primary/40 rounded-sm"></span> 31-60 mins</span>
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-primary rounded-sm"></span> &gt;60 mins</span>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-8 text-center text-xs text-slate-400">Failed to load statistics.</div>
      )}
    </div>
  );
};
