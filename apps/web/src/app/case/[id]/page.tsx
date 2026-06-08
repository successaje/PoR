"use client";

import { motion } from "framer-motion";
import { AGENTS } from "@/lib/mockEngine";
import Link from "next/link";
import { use } from "react";

export default function VerificationRoom({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const mockDebateLogs = [
    { time: "00:00:12", agent: "Atlas", action: "SCANNING", text: "Cross-referencing global geospatial registry. Coordinates validated." },
    { time: "00:00:14", agent: "Oracle", action: "SCANNING", text: "Querying local municipal databases for ownership records." },
    { time: "00:00:18", agent: "Prism", action: "DEBATING", text: "Discrepancy found in valuation metric derived from local property registries. Flagging for cross-examination." },
    { time: "00:00:21", agent: "Ledger", action: "DEBATING", text: "Cross-referencing Prism's claim. Historical transaction data does not support the discrepancy. Suggesting re-evaluation." },
    { time: "00:00:25", agent: "Aegis", action: "RESOLUTION", text: "Conflict resolution initiated. Weighting Ledger's historical index higher. Discrepancy resolved." },
    { time: "00:00:28", agent: "Aletheia", action: "CONSENSUS", text: "Synthesizing final cryptographic evidence layer. Consensus achieved." }
  ];

  return (
    <div className="min-h-full font-sans text-white bg-[#000000] p-8 md:p-16">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/[0.04] pb-8">
        <div>
          <Link href="/certificates" className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest mb-6 inline-flex items-center gap-2 transition-colors">
            ← Back to Registry
          </Link>
          <h1 className="text-4xl font-light tracking-tight text-white/90 mb-2">Verification Case</h1>
          <p className="font-mono text-[12px] text-white/40 tracking-[0.2em] uppercase">{id}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Finalized & Minted
          </div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Mantle Network: 0x8f...4b9c</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Summary & Evidence */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Summary Cards */}
          <div className="bg-[#050505] border border-white/10 p-8 space-y-8">
            <div>
              <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-2">Truth Score</h3>
              <div className="text-5xl font-light text-white/90">96.8<span className="text-2xl text-white/30">%</span></div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/[0.04]">
              <div>
                <h3 className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Fraud Risk</h3>
                <div className="text-xl text-emerald-400 font-light">1.2%</div>
              </div>
              <div>
                <h3 className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Risk Level</h3>
                <div className="text-xl text-emerald-400 font-light">LOW</div>
              </div>
              <div className="col-span-2">
                <h3 className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Market Value (Est.)</h3>
                <div className="text-2xl text-white/80 font-light">$1,450,000</div>
              </div>
            </div>
          </div>

          {/* Evidence Layer */}
          <div className="bg-[#050505] border border-white/10 p-8">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white/20"></div>
              Evidence Layer
            </h3>
            <div className="space-y-4 font-mono text-[10px] text-white/60">
              <div className="flex flex-col">
                <span className="text-white/30 uppercase tracking-widest mb-1">Root Hash (SHA-256)</span>
                <span className="break-all">0x8a92f8e134b9c7d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8</span>
              </div>
              <div className="flex flex-col pt-4 border-t border-white/[0.04]">
                <span className="text-white/30 uppercase tracking-widest mb-1">Data Sources Evaluated</span>
                <span>• Sentinel Geospatial Array (V2)</span>
                <span>• Global Ownership Registry Index</span>
                <span>• Mantle Historical Transaction Graph</span>
              </div>
              <div className="flex flex-col pt-4 border-t border-white/[0.04]">
                <span className="text-white/30 uppercase tracking-widest mb-1">Certificate NFT</span>
                <a href="#" className="text-cyan-500 hover:text-cyan-400 flex items-center gap-2">
                  View on OpenSea ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Debate & Consensus */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Consensus Breakdown */}
          <div className="bg-[#050505] border border-white/10 p-8">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white/20"></div>
              Consensus Breakdown
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(AGENTS).map(([name, data], i) => (
                <div key={name} className="p-4 bg-black border border-white/[0.05]">
                  <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex justify-between">
                    <span>{name}</span>
                    <span className="text-white/20">{data.role.split(" ")[0]}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-light text-white/90">{(94.1 + (i * 0.65)).toFixed(1)}<span className="text-sm text-white/30">%</span></span>
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Weight: {(0.12 + (i * 0.015)).toFixed(2)}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 mt-3">
                    <div className="h-full bg-white/20" style={{ width: `${94.1 + (i * 0.65)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Debate Timeline */}
          <div className="bg-[#050505] border border-white/10 p-8">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white/20"></div>
              Debate Timeline
            </h3>
            
            <div className="space-y-6">
              {mockDebateLogs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`pl-6 border-l-2 ${
                    log.action === "DEBATING" ? "border-amber-500/50" : 
                    log.action === "RESOLUTION" ? "border-emerald-500/50" : 
                    "border-white/10"
                  } relative`}
                >
                  <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${
                    log.action === "DEBATING" ? "bg-amber-500" : 
                    log.action === "RESOLUTION" ? "bg-emerald-500" : 
                    "bg-white/20"
                  }`}></div>
                  
                  <div className="flex items-center gap-4 mb-2 font-mono text-[9px] tracking-[0.2em] uppercase">
                    <span className="text-white/30">{log.time}</span>
                    <span className={
                      log.action === "DEBATING" ? "text-amber-400" : 
                      log.action === "RESOLUTION" ? "text-emerald-400" : 
                      "text-white/60"
                    }>{log.agent}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/40">{log.action}</span>
                  </div>
                  <p className="text-sm text-white/80 font-light leading-relaxed">
                    "{log.text}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
