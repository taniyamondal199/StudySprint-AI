import React from "react";
import { NavLink } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { SVGBadge } from "./SVGBadge";
import { 
  LayoutDashboard, 
  Trophy, 
  Cpu, 
  ListOrdered, 
  Award, 
  Users, 
  BarChart3, 
  LogOut, 
  Moon, 
  Sun,
  Coins,
  Flame
} from "lucide-react";

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ darkMode, setDarkMode }) => {
  const { user, walletAddress, disconnectWallet } = useWallet();

  const getXpThreshold = (lvl: number) => {
    return 100 * (lvl * (lvl + 1)) / 2;
  };

  const getPreviousThreshold = (lvl: number) => {
    if (lvl <= 1) return 0;
    return getXpThreshold(lvl - 1);
  };

  const levelProgressPercentage = () => {
    if (!user) return 0;
    const prev = getPreviousThreshold(user.level);
    const next = getXpThreshold(user.level);
    const currentDiff = user.xp - prev;
    const totalDiff = next - prev;
    return Math.max(0, Math.min(100, Math.round((currentDiff / totalDiff) * 100)));
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Challenges", path: "/challenges", icon: Trophy },
    { name: "AI Companion", path: "/ai-companion", icon: Cpu },
    { name: "Leaderboard", path: "/leaderboard", icon: ListOrdered },
    { name: "NFT Gallery", path: "/nft-gallery", icon: Award },
    { name: "Friends", path: "/friends", icon: Users },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 flex flex-col glass-card border-r border-slate-200 dark:border-slate-800 z-30 transition-all">
      {/* Logo Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-md">
          <span className="text-white font-extrabold text-xl tracking-tight">S</span>
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-slate-800 dark:text-white tracking-wide">
            StudySprint <span className="text-primary">AI</span>
          </h1>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Web3 Learning Companion</span>
        </div>
      </div>

      {/* Gamified Profile Box */}
      {user && (
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-primary/40 flex items-center justify-center text-xl">
              {user.avatar === "avatar_1" && "🧑‍🎓"}
              {user.avatar === "avatar_2" && "👩‍💻"}
              {user.avatar === "avatar_3" && "🧙‍♂️"}
              {user.avatar === "avatar_4" && "🚀"}
              {user.avatar === "avatar_5" && "🐱"}
              {user.avatar === "avatar_6" && "🎓"}
              {user.avatar === "avatar_7" && "🦁"}
              {user.avatar === "avatar_8" && "🦄"}
              {!user.avatar.startsWith("avatar_") && "⚡"}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-sm text-slate-800 dark:text-white truncate">{user.username}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full uppercase">
                  Lvl {user.level}
                </span>
                <div className="flex items-center text-[10px] font-bold text-amber-500 gap-0.5">
                  <Coins className="w-3 h-3 fill-amber-500" />
                  {user.coins}
                </div>
                <div className="flex items-center text-[10px] font-bold text-red-500 gap-0.5">
                  <Flame className="w-3 h-3 fill-red-500" />
                  {user.streak}d
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>XP: {user.xp}</span>
              <span>Lvl {user.level + 1}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Options */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer System controls */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {/* Theme Toggler */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200"
        >
          <span className="flex items-center gap-2">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${darkMode ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
            <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </div>
        </button>

        {/* Wallet Address & Logout */}
        {walletAddress && (
          <div className="bg-slate-100 dark:bg-slate-900/60 p-3 rounded-xl flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
              Connected Wallet
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate pr-2">
                {walletAddress.substring(0, 7)}...{walletAddress.substring(walletAddress.length - 5)}
              </span>
              <button
                onClick={disconnectWallet}
                className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-500/10"
                title="Disconnect Wallet"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
