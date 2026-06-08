"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AGENTS } from "@/lib/mockEngine";

export default function AgentsPage() {
  return (
    <div className="p-10 min-h-full bg-[#000000] text-white">
      <div className="mb-12 flex items-center justify-between border-b border-white/[0.04] pb-6">
        <div>
          <h2 className="text-2xl font-light text-white/90 tracking-tight mb-2">Agent Metrics</h2>
          <p className="text-white/30 text-[10px] font-mono tracking-[0.2em] uppercase">Intelligence Node Performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/[0.04]">
        {Object.entries(AGENTS).map(([name, data], i) => {
          const accuracy = (94.5 + (i * 0.45)).toFixed(2);
          const tasks = Math.floor(1250 + (i * 340));
          const repScore = (0.81 + (i * 0.02)).toFixed(3);

          return (
            <Link href={`/agents/${name}`} key={name} className="block group">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15, duration: 1.5, ease: "easeOut" }}
                className="bg-[#000000] border border-transparent group-hover:border-white/10 group-hover:bg-[#020202] transition-colors duration-700 relative overflow-hidden h-full"
              >
              <div className="p-8">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-sm font-medium tracking-widest uppercase text-white/80">{name}</h3>
                    <div className="text-[9px] font-mono text-white/30 mt-2 uppercase tracking-[0.2em]">{data.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">REP_SCORE</div>
                    <div className="text-white/80 font-mono text-sm">{repScore}</div>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-[10px] tracking-widest">
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                    <span className="text-white/40">ACCURACY</span>
                    <span className="text-white/80">{accuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                    <span className="text-white/40">OPERATIONS</span>
                    <span className="text-white/60">{tasks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">FLAGGED</span>
                    <span className="text-white/60">{Math.floor(tasks * 0.05).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Ultra-minimal sparkline */}
              <div className="h-16 w-full relative overflow-hidden flex items-end opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <motion.path 
                    d={`M0,${70 - i*2} L20,${60 + i*3} L40,${50 - i*4} L60,${65 + i} L80,${30 - i*2} L100,${20 + i}`}
                    fill="none"
                    stroke="rgba(255,255,255,1)"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
