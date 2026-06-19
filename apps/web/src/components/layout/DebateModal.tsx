"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AgentLog } from "@/lib/verificationEngine";
import { useEffect, useRef } from "react";

interface DebateModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AgentLog[];
}

export function DebateModal({ isOpen, onClose, logs }: DebateModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as logs arrive (if the user opens it early)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  // Filter only the debate-related logs
  const debateLogs = logs.filter(log => 
    ["DEBATING", "ARBITRATING", "RESOLUTION", "SCANNING", "CONSENSUS"].includes(log.actionType)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 m-auto w-full max-w-4xl h-[80vh] bg-[#050505] border border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
              <div>
                <h2 className="font-sans text-[14px] text-white tracking-[0.2em] uppercase">The Debate Chamber</h2>
                <p className="font-mono text-[10px] text-white/40 tracking-widest mt-2 uppercase">Forced Structured Disagreement Protocol</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 border border-white/10 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative"
            >
              {debateLogs.length === 0 ? (
                <div className="text-center text-white/20 font-mono text-[11px] uppercase tracking-widest mt-20">
                  No debate logs available.
                </div>
              ) : (
                debateLogs.map((log) => {
                  // Determine styling based on agent/action
                  let borderColor = "border-white/10";
                  let avatarBg = "bg-white/5";
                  let textColor = "text-white/70";
                  let agentColor = "text-white/50";
                  
                  if (log.agent === "Prism") {
                    borderColor = "border-amber-500/20";
                    avatarBg = "bg-amber-500/10";
                    agentColor = "text-amber-500";
                  } else if (log.agent === "Ledger") {
                    borderColor = "border-emerald-500/20";
                    avatarBg = "bg-emerald-500/10";
                    agentColor = "text-emerald-500";
                  } else if (log.agent === "Aegis") {
                    borderColor = "border-rose-500/30";
                    avatarBg = "bg-rose-500/10";
                    agentColor = "text-rose-400";
                    textColor = "text-rose-100/90";
                  }

                  const isResolution = log.actionType === "RESOLUTION" || log.actionType === "CONSENSUS";

                  return (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-6 ${isResolution ? "bg-white/[0.02] p-6 border border-rose-500/20 rounded-sm" : ""}`}
                    >
                      {/* Avatar */}
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full border ${borderColor} ${avatarBg} flex items-center justify-center font-mono text-[10px] tracking-widest ${agentColor} uppercase shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                          {log.agent.slice(0, 3)}
                        </div>
                        <div className={`px-2 py-0.5 text-[8px] uppercase tracking-widest border border-white/10 ${avatarBg} text-white/60`}>
                          {log.actionType}
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className={`font-mono text-[12px] uppercase tracking-widest ${agentColor} font-bold`}>
                            {log.agent}
                          </span>
                          <span className="font-mono text-[10px] text-white/20">
                            {new Date(log.timestamp).toISOString().split("T")[1].slice(0, 8)}
                          </span>
                          {log.txHash && (
                            <a 
                              href={`https://explorer.sepolia.mantle.xyz/tx/${log.txHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-[8px] text-cyan-500/40 hover:text-cyan-400 uppercase tracking-widest transition-colors ml-auto"
                            >
                              [TX: {log.txHash.slice(0,6)}...{log.txHash.slice(-4)}]
                            </a>
                          )}
                        </div>
                        <p className={`font-sans text-[13px] leading-relaxed tracking-wide ${textColor}`}>
                          {log.message}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-white/[0.05] bg-black text-center font-mono text-[9px] text-white/30 uppercase tracking-[0.2em]">
              Aletheia Consensus Engine v2.0.4 • Cryptographic Audit Trail
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
