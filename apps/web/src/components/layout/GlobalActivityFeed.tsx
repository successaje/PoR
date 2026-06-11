"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMock } from "./MockProvider";
import { AGENTS } from "@/lib/mockEngine";

export function GlobalActivityFeed() {
  const { globalLogs, activeVerification } = useMock();
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalLogs]);

  return (
    <div className="w-80 h-[calc(100vh-61px)] border-l border-white/[0.04] bg-[#000000]/40 backdrop-blur-md flex flex-col hidden lg:flex">
      <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
        <h3 className="font-sans text-[10px] text-white/40 tracking-[0.2em] uppercase">
          Activity Log
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
          <span className="text-[9px] font-mono text-white/30 tracking-widest">REALTIME</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar font-mono text-[10px] tracking-wide relative">
        {globalLogs.length === 0 && activeVerification.state === "PENDING" ? (
          <div className="text-white/20 uppercase tracking-widest text-center mt-10">System monitoring...</div>
        ) : (
          <AnimatePresence initial={false}>
            {globalLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="pb-4 border-b border-white/[0.02] last:border-0"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`tracking-widest ${
                    log.actionType === 'ANOMALY' ? 'text-amber-500/80' : 'text-white/60'
                  }`}>
                    {log.agent.toUpperCase()}
                  </span>
                  <span className="text-white/20">{new Date(log.timestamp).toISOString().split("T")[1].slice(0, 8)}</span>
                </div>
                
                <div className="text-white/40 leading-relaxed font-sans text-[11px] font-light">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, ease: "linear" }}
                  >
                    {log.message}
                  </motion.span>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest ${
                    log.actionType === "ANOMALY" ? "text-amber-500/60 bg-amber-500/10" :
                    log.actionType === "COMPLETED" ? "text-emerald-500/60 bg-emerald-500/10" :
                    "text-white/40 bg-white/5"
                  }`}>
                    {log.actionType}
                  </span>
                  
                  <span className="text-white/20 ml-auto flex items-center gap-1">
                    CF: <span className="text-white/50">{(log.confidence * 100).toFixed(0)}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={logsEndRef} />
        
        {/* Gradient fade at bottom to avoid harsh cutoffs */}
        <div className="sticky bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
