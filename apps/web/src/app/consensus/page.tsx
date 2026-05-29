"use client";

import { motion } from "framer-motion";
import { MOCK_ASSETS, AGENTS } from "@/lib/mockEngine";

export default function LiveConsensusPage() {
  return (
    <div className="p-10 min-h-full bg-[#000000] text-white">
      <div className="mb-12 flex items-center justify-between border-b border-white/[0.04] pb-6">
        <div>
          <h2 className="text-2xl font-light text-white/90 tracking-tight mb-2">Network Consensus</h2>
          <p className="text-white/30 text-[10px] font-mono tracking-[0.2em] uppercase">Global Verification Telemetry</p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span className="w-1.5 h-1.5 bg-white/20"></span>
          SYS_LOAD: 0.34
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/[0.04]">
        {MOCK_ASSETS.map((asset, i) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.2, duration: 1.5, ease: "easeOut" }}
            className="bg-[#000000] p-8 hover:bg-[#020202] transition-colors duration-700 group"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase mb-2">ASSET_ID: {asset.id}</div>
                <div className="text-sm text-white/80 font-sans tracking-wide mb-1">{asset.address}</div>
                <div className="text-white/30 text-[10px] font-mono tracking-widest">{asset.type} // {asset.value}</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-1 bg-white/5 text-white/60 text-[8px] font-mono tracking-[0.2em] uppercase border border-white/5 group-hover:border-white/20 transition-colors">
                  {i === 0 ? "SCANNING" : i === 1 ? "DEBATING" : "FINALIZED"}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase border-b border-white/[0.04] pb-2">
                <span>Active Nodes</span>
                <span>CF_SCORE</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {Object.keys(AGENTS).slice(0, 3 + i).map((agent, j) => (
                    <div key={agent} className="w-6 h-6 border border-white/10 bg-[#000000] flex items-center justify-center">
                      <span className="font-mono text-[7px] text-white/40">{agent.substring(0,2).toUpperCase()}</span>
                    </div>
                  ))}
                </div>
                <div className="text-2xl font-light text-white/90 font-mono tracking-tighter">
                  {i === 0 ? "42.0" : i === 1 ? "87.4" : "99.1"}
                </div>
              </div>

              <div className="h-[1px] w-full bg-white/5 relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-white/40"
                  style={{ width: i === 0 ? "42%" : i === 1 ? "87%" : "100%" }}
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
