import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { notificationAPI } from "../services/api";
import { 
  Bell, 
  Wifi, 
  WifiOff, 
  Wallet,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { 
    walletAddress, 
    isConnected, 
    isConnecting, 
    connectWallet, 
    keplrInstalled 
  } = useWallet();

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);
  const [showWalletMenu, setShowWalletMenu] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Fetch initial notifications if connected
    if (isConnected) {
      fetchNotifications();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isConnected]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 fixed top-0 right-0 left-64 glass-nav flex items-center justify-between px-8 z-20 transition-all duration-300">
      {/* Title Placeholder / Search */}
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          StudySprint Platform
        </h2>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-5">
        {/* Network Status Badge */}
        <div 
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
            isOnline 
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
              : "bg-rose-500/10 text-rose-500 border-rose-500/20"
          }`}
          title={isOnline ? "Server connected" : "Browsing offline. Logging Pomodoro to IndexedDB."}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span>{isOnline ? "Online" : "Offline"}</span>
        </div>

        {/* Notifications Popover */}
        {isConnected && (
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowWalletMenu(false);
                if (!showNotifDropdown) fetchNotifications();
              }}
              className="relative p-2 rounded-xl text-slate-500 hover:text-primary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-80 glass-card rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800 p-4 z-40 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white">Activity Feed</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs text-primary hover:underline font-bold"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-xl text-xs transition-colors ${
                          n.isRead 
                            ? "bg-transparent text-slate-500 dark:text-slate-400" 
                            : "bg-primary/5 text-slate-800 dark:text-slate-100 font-medium"
                        }`}
                      >
                        <div className="flex justify-between font-bold mb-0.5 text-slate-700 dark:text-slate-300">
                          <span>{n.title}</span>
                          <span className="text-[9px] text-slate-400 font-medium">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keplr Connect Button / Wallet Info */}
        <div className="relative">
          {isConnected && walletAddress ? (
            <button
              onClick={() => {
                setShowWalletMenu(!showWalletMenu);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-xs font-extrabold shadow-md shadow-primary/20 hover:opacity-95 transition-all"
            >
              <Wallet className="w-4 h-4" />
              <span>
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                setShowWalletMenu(!showWalletMenu);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-extrabold shadow-md shadow-primary/20 transition-all"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}

          {showWalletMenu && !isConnected && (
            <div className="absolute right-0 mt-3 w-64 glass-card rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800 p-4 z-40 space-y-3">
              <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Select Connection Method
              </h3>
              
              {/* Option 1: Keplr Wallet */}
              <button
                onClick={() => {
                  setShowWalletMenu(false);
                  connectWallet(false);
                }}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-white text-base">K</div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Keplr Wallet</p>
                    <p className="text-[10px] text-slate-400">Injective Testnet</p>
                  </div>
                </div>
                {!keplrInstalled && (
                  <span className="text-[8px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-black uppercase">Install</span>
                )}
              </button>

              {/* Option 2: Mock Login for sandboxes */}
              <button
                onClick={() => {
                  setShowWalletMenu(false);
                  connectWallet(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/10 hover:bg-primary/20 dark:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-primary"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-white text-base">✨</div>
                  <div className="text-left">
                    <p className="text-xs font-bold">Simulator Login</p>
                    <p className="text-[10px] opacity-80">Test Sandbox User</p>
                  </div>
                </div>
                <HelpCircle className="w-4 h-4" />
              </button>

              {!keplrInstalled && (
                <p className="text-[10px] text-slate-400 leading-normal text-center bg-slate-50 dark:bg-slate-900/40 p-2 rounded-xl">
                  Keplr extension not found. Click "Simulator Login" to explore the platform instantly!
                </p>
              )}
            </div>
          )}

          {showWalletMenu && isConnected && (
            <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800 p-3 z-40">
              <div className="p-2 flex items-center gap-2 text-xs font-bold text-emerald-500">
                <CheckCircle className="w-4 h-4 fill-emerald-500/20" />
                <span>Connected on Testnet</span>
              </div>
              <p className="p-2 text-[10px] text-slate-400 select-all font-mono break-all bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                {walletAddress}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
