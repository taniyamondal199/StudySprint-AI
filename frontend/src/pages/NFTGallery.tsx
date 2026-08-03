import React, { useState, useEffect } from "react";
import { nftAPI } from "../services/api";
import { SVGBadge } from "../components/SVGBadge";
import { 
  Award, 
  ExternalLink, 
  Calendar, 
  Globe, 
  Cpu,
  Layers,
  HelpCircle
} from "lucide-react";

export const NFTGallery: React.FC = () => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const res = await nftAPI.getNFTs();
      setNfts(res.data);
    } catch (err) {
      console.error("Failed to load NFTs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-slate-800 dark:text-white">NFT Achievement Gallery</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Collect verifiable Web3 milestone achievements on Injective</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 shimmer-skeleton rounded-3xl w-full"></div>
          ))}
        </div>
      ) : nfts.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl">
          <Award className="w-16 h-16 text-slate-200 dark:text-slate-855 mx-auto" />
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No NFTs minted yet</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto leading-normal">
              Complete key milestones (streak days, challenges numbers, study hours) to trigger automatic NFT mints on Injective.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {nfts.map((n) => (
            <div
              key={n.id}
              onClick={() => setSelectedNFT(n)}
              className="glass-card rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center space-y-4"
            >
              <div className="w-24 h-24 rounded-full bg-slate-100/50 dark:bg-slate-900/60 flex items-center justify-center border-2 border-primary/20 shadow-inner">
                <SVGBadge badgeId={n.badgeId} size={70} />
              </div>

              <div className="space-y-1 w-full">
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white truncate">{n.title}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{n.description}</p>
              </div>

              <div className="w-full border-t border-slate-100 dark:border-slate-900/80 pt-3 flex items-center justify-between text-[9px] font-bold text-slate-400">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(n.mintDate).toLocaleDateString()}</span>
                <span className="text-primary hover:underline flex items-center gap-0.5 shrink-0">Details &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NFT Detail Modal popover */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card max-w-md w-full rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6 text-center">
            
            <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto border-2 border-primary/25 shadow-md">
              <SVGBadge badgeId={selectedNFT.badgeId} size={100} />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{selectedNFT.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {selectedNFT.description}
              </p>
            </div>

            {/* Blockchain Details block */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-900 text-left">
              
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Metadata Storage</span>
                <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="font-mono truncate pr-4 text-[10px]">
                    {selectedNFT.ipfsUri}
                  </span>
                  <a
                    href={`https://ipfs.io/ipfs/${selectedNFT.ipfsUri.replace("ipfs://", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-0.5 shrink-0"
                  >
                    IPFS <Globe className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Injective Transaction Proof</span>
                <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="font-mono truncate pr-4 text-[10px]">
                    {selectedNFT.txHash}
                  </span>
                  <a
                    href={`https://testnet.explorer.injective.network/transaction/${selectedNFT.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-0.5 shrink-0"
                  >
                    Explorer <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>

            <button
              onClick={() => setSelectedNFT(null)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-xs font-black shadow-md transition-all"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
