"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMock } from "@/components/layout/MockProvider";
import { AGENTS } from "@/lib/mockEngine";

export default function VerifyPage() {
  const { activeVerification, startVerification, globalLogs } = useMock();
  const [assetId, setAssetId] = useState("");
  
  const isSubmitting = activeVerification.state !== "IDLE" && activeVerification.state !== "FINALIZED";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId) return;
    startVerification(assetId);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#000000] text-white">
      
      {/* Left Panel: Submission Form */}
      <div className="w-full md:w-[400px] p-10 border-r border-white/[0.04] bg-[#000000] flex flex-col relative z-10">
        <div className="flex-grow">
          <div className="mb-12">
            <h2 className="text-2xl font-light mb-2 text-white/90 tracking-tight">Verify Asset</h2>
            <p className="text-white/40 text-[11px] font-sans font-light tracking-wide">Input registry parameters to initialize the multi-agent consensus protocol.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] flex justify-between">
                <span>Registry Identifier</span>
                <span className="text-white/20">MVP</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  placeholder="REG-8492-TX"
                  className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white placeholder:text-white/20 transition-colors"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !assetId}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-sans text-[11px] tracking-[0.2em] uppercase py-4 transition-colors disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-2 h-2 bg-white/50 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                  INITIALIZING...
                </>
              ) : (
                "EXECUTE CONSENSUS"
              )}
            </button>
          </form>
        </div>

        {/* Dynamic Confidence Meter */}
        <div className="mt-auto pt-10 border-t border-white/[0.04]">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
              Confidence Delta
            </span>
            <span className="text-4xl font-light text-white/90 font-mono tracking-tighter">
              {activeVerification.confidence.toFixed(1)}<span className="text-white/30 text-xl ml-1">%</span>
            </span>
          </div>
          <div className="h-[2px] w-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-white/80"
              initial={{ width: 0 }}
              animate={{ width: `${activeVerification.confidence}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Right Panel: Live System Details */}
      <div className="flex-1 p-10 relative flex flex-col bg-[#020202]">
        {activeVerification.state === "IDLE" ? (
          <div className="m-auto flex flex-col items-center justify-center text-white/20">
             <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-6">
               <div className="w-2 h-2 bg-white/10"></div>
             </div>
            <div className="font-mono tracking-[0.2em] uppercase text-[10px]">Awaiting Target Input</div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            
            {/* Agent Activation Sequence */}
            <div className="mb-12">
              <h4 className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase border-b border-white/[0.04] pb-3 mb-6">Node Activation Matrix</h4>
              <div className="flex gap-4">
                {Object.keys(AGENTS).map((agent, i) => {
                  const isActive = activeVerification.state !== 'IDLE';
                  return (
                    <motion.div
                      key={agent}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.2, duration: 1 }}
                      className="flex flex-col gap-3"
                    >
                      <div className={`w-8 h-8 border flex items-center justify-center transition-colors duration-1000 ${isActive ? 'border-white/30 bg-white/5' : 'border-white/5'}`}>
                        <div className={`w-1.5 h-1.5 transition-colors duration-1000 ${isActive ? 'bg-white/80' : 'bg-white/10'}`}></div>
                      </div>
                      <span className="font-mono text-[8px] uppercase tracking-widest text-white/40">{agent.substring(0,3)}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Debate Chamber */}
            <div className="flex-1 flex flex-col min-h-0 mb-8">
               <h4 className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase border-b border-white/[0.04] pb-3 mb-6 flex justify-between">
                 <span>Debate Timeline</span>
                 <span className="text-white/60 animate-[pulse_3s_ease-in-out_infinite]">{activeVerification.state}</span>
               </h4>
               
               <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                  <AnimatePresence>
                    {globalLogs.filter(l => l.actionType === "DEBATING" || l.actionType === "ANOMALY").map((log) => (
                       <motion.div
                         key={log.id}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, ease: "easeOut" }}
                         className={`pl-4 border-l border-white/[0.05]`}
                       >
                         <div className="flex items-center gap-4 mb-2 font-mono text-[9px] tracking-[0.2em] uppercase">
                            <span className="text-white/60">{log.agent}</span>
                            <span className="text-white/20">CF: {log.confidence.toFixed(2)}</span>
                            {log.actionType === "ANOMALY" && <span className="text-amber-500/60">ANOMALY DETECTED</span>}
                         </div>
                         <div className="text-[12px] text-white/80 font-sans font-light leading-relaxed">
                           "{log.message}"
                         </div>
                       </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </div>

            {/* Final Result */}
            {activeVerification.state === "FINALIZED" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="p-8 bg-white/[0.02] border border-white/10"
              >
                <div className="flex items-center gap-4 text-white/90 mb-8 font-sans font-medium tracking-[0.2em] uppercase text-[11px] border-b border-white/[0.04] pb-4">
                  <div className="w-2 h-2 bg-emerald-500/80"></div>
                  Consensus Achieved
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-[10px] tracking-widest uppercase">
                  <div>
                    <div className="text-white/30 mb-2">Final Score</div>
                    <div className="text-xl text-white/90">{activeVerification.confidence.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-white/30 mb-2">Fraud Prob</div>
                    <div className="text-lg text-white/60">0.024</div>
                  </div>
                  <div>
                    <div className="text-white/30 mb-2">Est Value</div>
                    <div className="text-lg text-white/60">{activeVerification.valueEstimate || "$418,000"}</div>
                  </div>
                  <div>
                    <div className="text-white/30 mb-2">Status</div>
                    <div className="text-lg text-white/90">VERIFIED</div>
                  </div>
                </div>
                
                <button className="mt-8 w-full py-4 bg-white hover:bg-white/90 text-black font-sans text-[11px] tracking-[0.2em] uppercase transition-colors">
                  Issue Truth Certificate
                </button>
              </motion.div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
