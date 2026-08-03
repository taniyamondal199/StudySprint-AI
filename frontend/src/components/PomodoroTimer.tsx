import React, { useState, useEffect, useRef } from "react";
import { sessionAPI } from "../services/api";
import { OfflineDB } from "../utils/db";
import { useWallet } from "../context/WalletContext";
import { Play, Pause, RotateCcw, Award, AlertCircle, RefreshCw } from "lucide-react";
import { triggerConfetti } from "../utils/confetti";

export const PomodoroTimer: React.FC = () => {
  const { isConnected, refreshProfile } = useWallet();

  const [mode, setMode] = useState<"25/5" | "50/10" | "custom">("25/5");
  const [customMinutes, setCustomMinutes] = useState<number>(45);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("DSA");
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  const timerRef = useRef<any>(null);
  const sessionStartRef = useRef<Date | null>(null);

  // Synchronize timer config when mode changes
  useEffect(() => {
    resetTimer();
  }, [mode, customMinutes]);

  // Handle countdown intervals
  useEffect(() => {
    if (isActive) {
      if (!sessionStartRef.current) {
        sessionStartRef.current = new Date();
      }
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Sync offline sessions automatically when user returns online
  useEffect(() => {
    const handleOnline = () => {
      syncOfflineQueue();
    };
    window.addEventListener("online", handleOnline);
    // Initial load check
    if (navigator.onLine) {
      syncOfflineQueue();
    }
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const resetTimer = () => {
    setIsActive(false);
    sessionStartRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);

    let mins = 25;
    if (mode === "50/10") {
      mins = isBreak ? 10 : 50;
    } else if (mode === "custom") {
      mins = isBreak ? 5 : customMinutes;
    } else {
      // 25/5
      mins = isBreak ? 5 : 25;
    }

    setTimeLeft(mins * 60);
    setTotalSeconds(mins * 60);
  };

  const handleTimerComplete = async () => {
    setIsActive(false);
    playAlarmSound();
    triggerConfetti();

    const endTime = new Date();
    const startTime = sessionStartRef.current || new Date(endTime.getTime() - totalSeconds * 1000);
    const durationMinutes = Math.round(totalSeconds / 60);

    // Save study session
    const sessionPayload = {
      id: crypto.randomUUID(),
      duration: durationMinutes,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      category,
      mode: mode.toUpperCase(),
    };

    if (navigator.onLine && isConnected) {
      try {
        await sessionAPI.saveSession(sessionPayload);
        refreshProfile();
      } catch (err) {
        console.warn("Failed to save session online, saving offline:", err);
        await OfflineDB.saveSession(sessionPayload);
      }
    } else {
      console.log("Offline mode or not connected. Storing study session in IndexedDB queue.");
      await OfflineDB.saveSession(sessionPayload);
    }

    alert(isBreak ? "Break completed! Ready to focus?" : "Study sprint completed! Great job, take a break.");
    setIsBreak(!isBreak);
    sessionStartRef.current = null;
  };

  const syncOfflineQueue = async () => {
    if (!navigator.onLine || !isConnected || isSyncing) return;
    
    try {
      const pending = await OfflineDB.getPendingSessions();
      if (pending.length === 0) return;

      setIsSyncing(true);
      console.log(`Syncing ${pending.length} offline study sessions...`);
      
      const res = await sessionAPI.syncOfflineSessions(pending);
      if (res.status === 200) {
        await OfflineDB.clearDB();
        refreshProfile();
        console.log("Offline sessions synchronized successfully.");
      }
    } catch (err) {
      console.error("Failed to sync offline sessions:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Real-time audio synthesizer for Alarm
  const playAlarmSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Ring chime
      const playChime = (time: number, freq: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.5, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(time);
        osc.stop(time + 0.8);
      };

      const now = audioCtx.currentTime;
      playChime(now, 523.25); // C5
      playChime(now + 0.2, 659.25); // E5
      playChime(now + 0.4, 783.99); // G5
      playChime(now + 0.6, 1046.50); // C6
    } catch (error) {
      console.warn("Audio Context beep failed:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  // SVG Circumference calculations for Circular Progress Bar
  const strokeRadius = 80;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeOffset = strokeCircumference - (timeLeft / totalSeconds) * strokeCircumference;

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col items-center shadow-lg border border-slate-200/60 dark:border-slate-800 transition-all max-w-sm w-full">
      {/* Mode Switches */}
      <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1 rounded-2xl w-full mb-6">
        {(["25/5", "50/10", "custom"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setMode(t);
              setIsBreak(false);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all capitalize ${
              mode === t
                ? "bg-primary text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Category selector */}
      <div className="w-full flex items-center justify-between gap-3 mb-6">
        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Focus Area:
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-100 dark:bg-slate-900 border-0 text-xs font-bold rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="DSA">Data Structures & Algos (DSA)</option>
          <option value="Web3">Injective Smart Contracts</option>
          <option value="DBMS">Database Systems (DBMS)</option>
          <option value="OS">Operating Systems (OS)</option>
          <option value="General">General Study</option>
        </select>
      </div>

      {/* Circular Progress Countdown */}
      <div className="relative w-56 h-56 flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="112"
            cy="112"
            r={strokeRadius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="112"
            cy="112"
            r={strokeRadius}
            className={`transition-all duration-300 ${
              isBreak ? "stroke-emerald-400" : "stroke-primary"
            }`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeCircumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Time Text Overlay */}
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-extrabold tracking-tight tabular-nums text-slate-800 dark:text-white">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
            {isBreak ? "☕ BREAK TIME" : "⚡ FOCUS TIME"}
          </span>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-4 w-full justify-center mb-4">
        <button
          onClick={resetTimer}
          className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl transition-all"
          title="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleActive}
          className={`px-8 py-3 rounded-2xl text-sm font-extrabold shadow-md flex items-center gap-2 transition-all ${
            isActive
              ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-slate-800/20"
              : "bg-primary text-white shadow-primary/20 hover:opacity-95"
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-current" /> Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Focus
            </>
          )}
        </button>
      </div>

      {/* Custom Duration Slider */}
      {mode === "custom" && (
        <div className="w-full space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
          <div className="flex justify-between text-xs font-bold text-slate-400 dark:text-slate-500">
            <span>Sprint Duration</span>
            <span>{customMinutes} mins</span>
          </div>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(parseInt(e.target.value))}
            className="w-full accent-primary bg-slate-200 dark:bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}

      {/* Sync indicator */}
      {isSyncing && (
        <div className="flex items-center gap-1.5 text-[10px] text-primary font-bold animate-pulse mt-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Syncing offline sessions...</span>
        </div>
      )}
    </div>
  );
};
