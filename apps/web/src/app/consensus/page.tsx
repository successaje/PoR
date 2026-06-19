"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AGENTS } from "@/lib/verificationEngine";

export default function LiveConsensusPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/cases`);
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
    fetchCases();
  }, []);

  return (
    <div className="p-10 min-h-full bg-[#000000] text-white">
      <div className="mb-12 flex items-center justify-between border-b border-white/[0.04] pb-6">
        <div>
          <h2 className="text-2xl font-light text-white/90 tracking-tight mb-2">Network Consensus</h2>
          <p className="text-white/30 text-[10px] font-mono tracking-[0.2em] uppercase">Global Verification Telemetry</p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span className="w-1.5 h-1.5 bg-emerald-500/80 animate-pulse"></span>
          SYS_LOAD: 0.34
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">
          Syncing Global State...
        </div>
      ) : cases.length === 0 ? (
        <div className="flex justify-center items-center h-64 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">
          No cases found
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/[0.04]">
        {cases.map((asset, i) => {
          const isVerified = asset.status === 'verified';
          const isFlagged = asset.status === 'flagged';
          const phaseText = isVerified ? "FINALIZED" : isFlagged ? "FLAGGED" : "CONSENSUS";
          const score = asset.truth_score || (isVerified ? 96.4 : isFlagged ? 32.1 : 87.4);
          const formattedValue = asset.declared_value_usd 
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
            {/* Background image fade */}
            {asset.storage_url && (
                <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${asset.storage_url})` }} />
            )}

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <div className="font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase mb-2">ASSET_ID: {asset.asset_id.substring(0,8)}</div>
                <div className="text-sm text-white/80 font-sans tracking-wide mb-1 truncate max-w-[200px]">{asset.jurisdiction} • {asset.asset_type}</div>
                <div className="text-white/30 text-[10px] font-mono tracking-widest">{formattedValue}</div>
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

              <div className="space-y-6 relative z-10">
              <div className="flex justify-between font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase border-b border-white/[0.04] pb-2">
                <span>Active Nodes</span>
                <span>CF_SCORE</span>
              </div>
              
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Object.keys(AGENTS).slice(0, isVerified || isFlagged ? 8 : 5).map((agent, j) => (
                      <div key={agent} className="w-6 h-6 border border-white/10 bg-[#000000] flex items-center justify-center">
                        <span className="font-mono text-[7px] text-white/40">{agent.substring(0,2).toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`text-2xl font-light font-mono tracking-tighter ${isVerified ? 'text-emerald-400' : isFlagged ? 'text-rose-400' : 'text-white/90'}`}>
                    {score.toFixed(1)}
                  </div>
                </div>
  
                <div className="h-[1px] w-full bg-white/5 relative">
                  <div 
                    className={`absolute top-0 left-0 h-full ${isVerified ? 'bg-emerald-500/40' : isFlagged ? 'bg-rose-500/40' : 'bg-white/40'}`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </Link>
          );
        })}
      </div>
      )}
    </div>
  );
}
