import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { 
  Trophy, 
  Cpu, 
  Award, 
  Flame, 
  ArrowRight, 
  CheckCircle, 
  Layers, 
  ShieldAlert,
  ChevronDown
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const { connectWallet, isConnecting, keplrInstalled } = useWallet();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is StudySprint AI?",
      a: "StudySprint AI is a gamified study tracker that combines AI learning tools (study planner, MCQ quiz generator, revision notes summarizer) with the Injective blockchain. It rewards consistent focus sessions with level progressions, coins, and mintable NFT achievements.",
    },
    {
      q: "Do I need real money to use the Injective wallet features?",
      a: "No! StudySprint AI is configured to use the Injective Testnet by default. You can use free testnet INJ tokens from the faucet to register completed challenges and mint NFT achievement badges.",
    },
    {
      q: "How does the Offline Mode work?",
      a: "The platform is a Progressive Web App (PWA). If you lose internet connection, your Pomodoro sessions are stored locally in the browser's IndexedDB. As soon as you reconnect, they are synced back to the backend automatically without duplicate entries.",
    },
    {
      q: "What if I do not have a Keplr Wallet installed?",
      a: "No problem! You can click the 'Simulator Login' option in the connect dropdown. This launches a test profile with pre-configured mock data, allowing you to try all dashboard and AI features instantly.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 selection:bg-primary selection:text-white">
      {/* Landing Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-md">
            <span className="text-white font-extrabold text-lg">S</span>
          </div>
          <h1 className="font-extrabold text-md tracking-wider">
            StudySprint <span className="text-primary">AI</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => connectWallet(true)}
            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
          >
            Simulator Demo
          </button>
          <button
            onClick={() => connectWallet(false)}
            disabled={isConnecting}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-all flex items-center gap-2"
          >
            <WalletIcon className="w-3.5 h-3.5" />
            {isConnecting ? "Connecting..." : "Connect Keplr"}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black tracking-wide uppercase">
            <Flame className="w-3.5 h-3.5 fill-current animate-bounce" /> Injective HackQuest Entry
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
            Level Up Your Study Habits on <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Injective</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
            StudySprint AI blends elite cognitive learning hacks with Injective smart contracts. Master subjects with AI study planners, test yourself with AI quizzes, and lock in credentials as verifiable on-chain NFTs.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => connectWallet(false)}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-primary/20 hover:opacity-95 transition-all flex items-center gap-2 group"
            >
              Start Your Sprint 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => connectWallet(true)}
              className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-sm font-bold transition-all"
            >
              Explore Sandboxed
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-xs font-bold text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60 max-w-md">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Keplr Connect</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> PWA Support</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Offline Sync</span>
          </div>
        </div>

        {/* Animated Vector Illustration */}
        <div className="flex justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          
          <svg className="w-full max-w-md animate-[bounce_6s_infinite_ease-in-out]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="heroGrad" x1="0" y1="0" x2="500" y2="500">
                <stop offset="0%" stopColor="#6C63FF" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            {/* Background elements */}
            <circle cx="250" cy="250" r="180" fill="url(#heroGrad)" fillOpacity="0.05" />
            <circle cx="250" cy="250" r="140" fill="url(#heroGrad)" fillOpacity="0.08" />
            
            {/* Monitor Console */}
            <rect x="100" y="100" width="300" height="220" rx="20" fill="#0F172A" />
            <rect x="110" y="110" width="280" height="200" rx="12" fill="#1E293B" />
            
            {/* Code Lines on Screen */}
            <rect x="130" y="130" width="100" height="12" rx="4" fill="#6C63FF" />
            <rect x="130" y="150" width="160" height="12" rx="4" fill="#3B82F6" />
            <rect x="130" y="170" width="120" height="12" rx="4" fill="#FFD700" />
            <rect x="130" y="190" width="70" height="12" rx="4" fill="#EF4444" />
            
            {/* Grid items */}
            <rect x="130" y="220" width="60" height="60" rx="10" fill="#6C63FF" fillOpacity="0.2" />
            <rect x="200" y="220" width="60" height="60" rx="10" fill="#3B82F6" fillOpacity="0.2" />
            <rect x="270" y="220" width="60" height="60" rx="10" fill="#FFD700" fillOpacity="0.2" />
            
            {/* Shield Star floating */}
            <path d="M410 160 C420 160 430 165 430 175 C430 195 410 215 410 215 C410 215 390 195 390 175 C390 165 400 160 410 160 Z" fill="#FFD700" />
            <polygon points="410,172 412,177 417,177 413,180 415,185 410,182 405,185 407,180 403,177 408,177" fill="#1E293B" />

            {/* Pomodoro Clock floating */}
            <circle cx="90" cy="240" r="30" fill="#FF4B2B" />
            <circle cx="90" cy="240" r="24" fill="#FFFFFF" />
            <path d="M90 224 V240 H102" stroke="#FF4B2B" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white dark:bg-slate-900/40 py-20 px-8 border-y border-slate-200/50 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              The ultimate Web3 Study Arsenal
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Why use simple checklists? StudySprint AI integrates cutting-edge productivity tools with on-chain mechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 space-y-4 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">🤖 AI Companion Suite</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Generate tailored study planners, configure mock MCQ revision quizzes, and summarize long-form text notes into bullet-proof revision notes automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 space-y-4 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shadow-inner">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">🔗 Verified Injective Proofs</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Every study challenge completed records an immutable hash directly on Injective. Mint milestones as premium customized SVG-badge NFTs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 space-y-4 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">🏆 Leaderboard Competitions</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Gain XP and gold coins by completing Pomodoros. Compete weekly, monthly, or all-time against peer learners with custom-designed visual cards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-8 max-w-7xl mx-auto space-y-12">
        <h3 className="text-2xl md:text-3xl font-black text-center text-slate-900 dark:text-white">
          How It Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-2">1</div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Connect Keplr Wallet</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">Securely sign in with your public Injective wallet address. Zero username/password signup needed.</p>
          </div>
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-2">2</div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Study & Level Up</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">Track Pomodoros, submit challenges, and check off objectives. Earn XP and coins for consistency.</p>
          </div>
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-2">3</div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Mint Badges as NFTs</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">Commit proofs to the Injective block. Mint custom SVG badges to your wallet, viewable on explorer.</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-slate-100 dark:bg-slate-900/30 py-20 px-8">
        <div className="max-w-3xl mx-auto space-y-10">
          <h3 className="text-2xl md:text-3xl font-black text-center text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-xs md:text-sm text-slate-800 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === index ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="py-12 border-t border-slate-200/50 dark:border-slate-800/40 text-center space-y-4 px-8 bg-white dark:bg-slate-950">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">S</div>
          <span className="font-extrabold text-sm text-slate-800 dark:text-white">StudySprint AI</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal max-w-md mx-auto">
          Built for the Injective HackQuest showcase. Gamified Web3 cognitive companion for modern students.
        </p>
        <div className="flex justify-center gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-primary transition-colors flex items-center gap-1.5"><GithubIcon className="w-3.5 h-3.5" /> Repository</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-primary transition-colors">Injective Explorer</a>
        </div>
      </footer>
    </div>
  );
};

// SVG Wallet helper
const WalletIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
  </svg>
);

// SVG Github helper
const GithubIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);
