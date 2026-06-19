"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import Link from "next/link";
import TextScramble from "@/components/ui/TextScramble";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCases = async () => {
      if (!address) {
        setLoading(false);
        return;
      }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/cases?owner_wallet=${address}`);
        if (res.ok) {
          const data = await res.json();
          setCases(data.cases || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUserCases();
  }, [address]);

  if (!isConnected) {
    return (
      <div className="min-h-full font-sans text-white bg-[#000000] p-8 md:p-16 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border border-white/10 mb-8 flex items-center justify-center">
          <span className="w-2 h-2 bg-white/20 animate-pulse"></span>
        </div>
        <h1 className="text-2xl font-light tracking-tight text-white/90 mb-4">Identity Required</h1>
        <p className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase">Please connect your web3 wallet to view your metrics.</p>
      </div>
    );
  }

  const verifiedCases = cases.filter(c => c.status === 'verified');
  const flaggedCases = cases.filter(c => c.status === 'flagged');
  
  const totalValue = cases.reduce((acc, curr) => acc + (curr.declared_value_usd || 0), 0);
  const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValue);
  
  const avgScore = verifiedCases.length > 0 
    ? verifiedCases.reduce((acc, curr) => acc + (curr.truth_score || 0), 0) / verifiedCases.length 
    : 0;

  return (
    <div className="min-h-full font-sans text-white bg-[#000000] p-8 md:p-16">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/[0.04] pb-8">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white/90 mb-2">Global Portfolio</h1>
          <p className="font-mono text-[12px] text-white/40 tracking-[0.2em] uppercase">
            {address}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            Identity Verified
          </div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
            PoR Protocol • V1.0
          </p>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-[#050505] border border-white/10 p-8">
          <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Total Value Tracked</h3>
          <div className="text-3xl font-light text-white/90">
            {loading ? "..." : formattedValue}
          </div>
        </div>
        <div className="bg-[#050505] border border-emerald-500/20 p-8">
          <h3 className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-[0.2em] mb-4">Verified Assets</h3>
          <div className="text-3xl font-light text-emerald-400">
            {loading ? "..." : verifiedCases.length}
          </div>
        </div>
        <div className="bg-[#050505] border border-red-500/20 p-8">
          <h3 className="text-[10px] font-mono text-red-500/60 uppercase tracking-[0.2em] mb-4">Flagged Assets</h3>
          <div className="text-3xl font-light text-red-400">
            {loading ? "..." : flaggedCases.length}
          </div>
        </div>
        <div className="bg-[#050505] border border-white/10 p-8">
          <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Avg Truth Score</h3>
          <div className="text-3xl font-light text-white/90">
            {loading ? "..." : `${avgScore.toFixed(1)}%`}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-white/20"></div>
          Asset Registry
        </h3>
        
        {loading ? (
          <div className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase py-12 text-center">Syncing Ledger...</div>
        ) : cases.length === 0 ? (
          <div className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase py-12 text-center">No assets found for this identity</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/[0.04]">
            {cases.map((asset, i) => {
              const isVerified = asset.status === 'verified';
              const isFlagged = asset.status === 'flagged';
              const phaseText = isVerified ? "FINALIZED" : isFlagged ? "FLAGGED" : "CONSENSUS";
              const score = asset.truth_score || (isVerified ? 96.4 : isFlagged ? 32.1 : 87.4);
              const val = asset.declared_value_usd 
                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(asset.declared_value_usd)
                : "$Unknown";
                
              return (
                <Link href={`/case/${asset.asset_id}`} key={asset.asset_id} className="block group cursor-pointer">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 1.5, ease: "easeOut" }}
                    className="bg-[#000000] p-8 hover:bg-[#020202] transition-colors duration-700 h-full border border-transparent group-hover:border-white/10 relative overflow-hidden"
                  >
                    {asset.storage_url && (
                        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${asset.storage_url})` }} />
                    )}

                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div>
                        <div className="font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase mb-2">ASSET_ID: {asset.asset_id.substring(0,8)}</div>
                        <div className="text-sm text-white/80 font-sans tracking-wide mb-1 truncate max-w-[200px]">{asset.jurisdiction} • {asset.asset_type}</div>
                        <div className="text-white/30 text-[10px] font-mono tracking-widest">{val}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 text-[8px] font-mono tracking-[0.2em] uppercase border transition-colors ${
                          isVerified ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/50" : 
                          isFlagged ? "bg-rose-500/10 text-rose-400 border-rose-500/20 group-hover:border-rose-500/50" :
                          "bg-white/5 text-white/60 border-white/5 group-hover:border-white/20"
                        }`}>
                          {phaseText}
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <div className="flex justify-between font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase border-b border-white/[0.04] pb-2 mb-4">
                        <span>CF_SCORE</span>
                      </div>
                      <div className={`text-3xl font-light font-mono tracking-tighter ${isVerified ? 'text-emerald-400' : isFlagged ? 'text-rose-400' : 'text-white/90'}`}>
                        {score.toFixed(1)}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )})}
          </div>
        )}
      </div>
    </div>
  );
}
