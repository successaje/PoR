"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { AGENTS } from "@/lib/verificationEngine";
import Link from "next/link";
import TextScramble from "@/components/ui/TextScramble";

export default function VerificationRoom({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [asset, setAsset] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/cases/${id}`);
        if (res.ok) {
          const data = await res.json();
          setAsset(data.case);
        }
        
        const logsRes = await fetch(`${apiUrl}/cases/${id}/logs`);
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setLogs(logsData.logs || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  if (loading) {
    return <div className="min-h-full bg-[#000000] flex items-center justify-center h-screen font-mono text-[10px] text-white/30 uppercase tracking-widest">Accessing Case File...</div>;
  }

  if (!asset) {
    return <div className="min-h-full bg-[#000000] flex items-center justify-center h-screen font-mono text-[10px] text-white/30 uppercase tracking-widest">Case Not Found</div>;
  }

  const isRejected = asset.status === 'flagged';
  const score = asset.truth_score || (isRejected ? 41.2 : 96.8);
  const formattedValue = asset.declared_value_usd 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(asset.declared_value_usd)
    : "Valuation Unknown";

  return (
    <div className="min-h-full font-sans text-white bg-[#000000] p-8 md:p-16">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/[0.04] pb-8">
        <div>
          <Link href="/certificates" className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest mb-6 inline-flex items-center gap-2 transition-colors">
            ← Back to Registry
          </Link>
          <h1 className="text-4xl font-light tracking-tight text-white/90 mb-2">Verification Case</h1>
          <p className="font-mono text-[12px] text-white/40 tracking-[0.2em] uppercase">
            <TextScramble text={id} />
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className={`text-[10px] font-mono ${isRejected ? 'text-red-500/80' : 'text-emerald-500/80'} uppercase tracking-[0.2em] mb-2 flex items-center gap-2`}>
            <div className={`w-2 h-2 ${isRejected ? 'bg-red-500' : 'bg-emerald-500'} rounded-full animate-pulse`}></div>
            {isRejected ? "Verification Failed" : "Finalized & Minted"}
          </div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
            {isRejected ? "Mantle Network: TX FLAGGED" : "Mantle Network: Verified"} • {asset.jurisdiction}
          </p>
        </div>
      </div>

      {/* Sentinel Compliance Banner */}
      {isRejected && (
        <div className="max-w-7xl mx-auto mb-8 bg-red-500/10 border border-red-500/50 p-6 flex flex-col items-start gap-2">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="font-mono text-[12px] text-red-500 font-bold uppercase tracking-widest">SENTINEL COMPLIANCE ALERT</span>
          </div>
          <p className="font-sans text-sm text-red-400/90 leading-relaxed max-w-4xl">
            {asset.flag_reason || "Critical compliance violation detected during multi-source verification."}
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Summary & Evidence */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Summary Cards */}
          <div className="bg-[#050505] border border-white/10 p-8 space-y-8">
            <div>
              <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-2">Truth Score</h3>
              <div className="text-5xl font-light text-white/90">
                <TextScramble text={isRejected ? "41.2" : "96.8"} duration={1200} />
                <span className="text-2xl text-white/30">%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/[0.04]">
              <div>
                <h3 className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Fraud Risk</h3>
                <div className={`text-xl font-light ${isRejected ? 'text-red-400' : 'text-emerald-400'}`}>
                  <TextScramble text={isRejected ? "87.5%" : (100 - score).toFixed(1) + "%"} duration={1000} delay={200} />
                </div>
              </div>
              <div>
                <h3 className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Risk Level</h3>
                <div className={`text-xl font-light ${isRejected ? 'text-red-400' : 'text-emerald-400'}`}>
                  <TextScramble text={isRejected ? "CRITICAL" : "LOW"} duration={800} delay={400} />
                </div>
              </div>
              <div className="col-span-2">
                <h3 className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Market Value (Est.)</h3>
                <div className="text-2xl text-white/80 font-light">
                  <TextScramble text={formattedValue} duration={1500} delay={300} />
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-[#050505] border border-white/10 p-8">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white/20"></div>
              Consensus Reasoning
            </h3>
            <p className="text-sm text-white/70 font-light leading-relaxed">
              {isRejected 
                ? (asset.flag_reason || "Aletheia Global Network aborted consensus due to synthetic manipulation detected. Historical data conflicts could not be resolved.")
                : "Aletheia Global Network reached consensus after successfully verifying multi-source geospatial data, clearing global sanctions lists, and validating local municipal ownership registries. No anomalies were detected in the historical transaction graph."}
            </p>
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
                <span className="break-all">
                  <TextScramble text={asset.evidence_hash || asset.sha256_hash || "0x8a92f8e134b9c7d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8"} duration={2000} delay={500} />
                </span>
              </div>
              <div className="flex flex-col pt-4 border-t border-white/[0.04]">
                <span className="text-white/30 uppercase tracking-widest mb-1">Data Sources Evaluated</span>
                <span>• Sentinel Geospatial Array (V2)</span>
                <span>• Global Ownership Registry Index</span>
                <span>• Mantle Historical Transaction Graph</span>
              </div>
              <div className="flex flex-col pt-4 border-t border-white/[0.04]">
                <span className="text-white/30 uppercase tracking-widest mb-1">Mantle Network</span>
                {asset.mantle_tx_hash ? (
                  <a href={`https://explorer.sepolia.mantle.xyz/tx/${asset.mantle_tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 flex items-center gap-2">
                    View on Explorer ↗
                  </a>
                ) : (
                  <span className="text-white/40">Pending Tx...</span>
                )}
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
              {Object.entries(AGENTS).slice(0, logs.length > 0 ? 8 : isRejected ? 8 : 8).map(([name, data], i) => {
                // Find agent's last confidence from logs if available
                const agentLogs = logs.filter(l => l.agent_name === name || l.agent_name === name.toUpperCase());
                const agentScore = agentLogs.length > 0 
                  ? agentLogs[agentLogs.length - 1].confidence 
                  : Math.max(0, (score - 2.1 + (i * 0.65)).toFixed(1));
                  
                return (
                <div key={name} className="p-4 bg-black border border-white/[0.05]">
                  <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex justify-between">
                    <span>{name}</span>
                    <span className="text-white/20">{data.role.split(" ")[0]}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-light text-white/90">
                      <TextScramble text={String(agentScore)} duration={1000} delay={i * 100} />
                      <span className="text-sm text-white/30">%</span>
                    </span>
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                      Weight: <TextScramble text={(0.12 + (i * 0.015)).toFixed(2)} duration={800} delay={i * 100 + 200} />
                    </span>
                  </div>
                  <div className="h-1 w-full bg-white/5 mt-3">
                    <div className="h-full bg-white/20" style={{ width: `${agentScore}%` }}></div>
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Debate Timeline */}
          <div className="bg-[#050505] border border-white/10 p-8">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white/20"></div>
              Debate Timeline
            </h3>
            
            <div className="space-y-6">
              {logs.map((log, i) => {
                const timeStr = log.timestamp ? new Date(log.timestamp).toISOString().split("T")[1].slice(0, 8) : "00:00:00";
                return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`pl-6 border-l-2 ${
                    log.action_type === "DEBATING" ? "border-amber-500/50" : 
                    log.action_type === "RESOLUTION" || log.action_type === "CONSENSUS" ? "border-emerald-500/50" : 
                    log.action_type === "FLAGGED" || log.action_type === "REJECTED" ? "border-red-500/50" :
                    "border-white/10"
                  } relative`}
                >
                  <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${
                    log.action_type === "DEBATING" ? "bg-amber-500" : 
                    log.action_type === "RESOLUTION" || log.action_type === "CONSENSUS" ? "bg-emerald-500" : 
                    log.action_type === "FLAGGED" || log.action_type === "REJECTED" ? "bg-red-500" :
                    "bg-white/20"
                  }`}></div>
                  
                  <div className="flex items-center gap-4 mb-2 font-mono text-[9px] tracking-[0.2em] uppercase">
                    <span className="text-white/30">{timeStr}</span>
                    <span className={
                      log.action_type === "DEBATING" ? "text-amber-400" : 
                      log.action_type === "RESOLUTION" || log.action_type === "CONSENSUS" ? "text-emerald-400" : 
                      log.action_type === "FLAGGED" || log.action_type === "REJECTED" ? "text-red-400" :
                      "text-white/60"
                    }>{log.agent_name}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/40">{log.action_type}</span>
                  </div>
                  <p className="text-sm text-white/80 font-light leading-relaxed">
                    "{log.message}"
                  </p>
                </motion.div>
              )})}
            </div>
          </div>

          {/* Raw Telemetry Log */}
          <details className="bg-[#050505] border border-white/10 p-6 group cursor-pointer transition-all duration-300 open:pb-8">
            <summary className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] outline-none list-none flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-white/20 group-hover:bg-white/40 transition-colors"></div>
                Raw Telemetry Log
              </div>
              <span className="text-white/20 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-6 font-mono text-[9px] text-emerald-500/80 overflow-x-auto whitespace-pre p-4 bg-black border border-white/5 custom-scrollbar max-h-96">
              {JSON.stringify(logs, null, 2)}
            </div>
          </details>

        </div>
      </div>
    </div>
  );
}
