import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useWallet } from "./context/WalletContext";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { Challenges } from "./pages/Challenges";
import { AICompanion } from "./pages/AICompanion";
import { Leaderboard } from "./pages/Leaderboard";
import { NFTGallery } from "./pages/NFTGallery";
import { Friends } from "./pages/Friends";
import { Analytics } from "./pages/Analytics";

export default function App() {
  const { isConnected } = useWallet();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("studysprint_theme") === "dark";
  });

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("studysprint_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("studysprint_theme", "light");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      {!isConnected ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
          
          <div className="flex-1 pl-64 pt-16 flex flex-col min-w-0">
            <Navbar />
            <main className="flex-1 p-8 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/ai-companion" element={<AICompanion />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/nft-gallery" element={<NFTGallery />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}
