"use client";

import { PROTOCOL_NODES } from "@/config/nodes";
import { motion } from "framer-motion";

export default function NodeNetworkPage() {
  const nodes = Object.values(PROTOCOL_NODES);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/[0.04] pb-6">
          <div>
            <h1 className="text-3xl font-light text-white/90 tracking-tight mb-2">Validator Network</h1>
            <p className="text-white/40 text-[11px] font-mono tracking-widest uppercase mb-6">
              Decentralized Intelligence Operators
            </p>
            <div className="flex gap-8 font-mono text-[10px] tracking-widest uppercase">
              <div className="flex flex-col"><span className="text-white/30">Active Operators</span><span className="text-white/90 text-sm mt-1">42</span></div>
              <div className="flex flex-col"><span className="text-white/30">Node Classes</span><span className="text-white/90 text-sm mt-1">8</span></div>
              <div className="flex flex-col"><span className="text-white/30">Consensus Accuracy</span><span className="text-emerald-400 text-sm mt-1">98.2%</span></div>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <a href="/nodes/apply" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-sans text-[10px] tracking-[0.2em] uppercase transition-colors">
              Apply as Operator
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nodes.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="border border-white/10 bg-white/[0.02] p-6 flex flex-col hover:border-white/20 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`text-[10px] font-mono tracking-widest uppercase ${node.color}`}>
                  {node.id}
                </div>
                <div className={`px-2 py-1 text-[8px] font-mono uppercase tracking-widest ${node.activationState === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {node.activationState}
                </div>
              </div>
              
              <div className="text-white/80 font-light text-sm mb-4">
                {node.role}
              </div>
              
              <div className="text-white/40 text-xs font-light mb-8 flex-1">
                {node.description}
              </div>

              <div className="pt-4 border-t border-white/[0.04]">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[9px] font-mono text-white/30 tracking-[0.2em] uppercase">Reputation</span>
                  <span className="text-sm font-mono text-white/80">{node.reputationScore.toFixed(1)}</span>
                </div>
                <div className="h-1 w-full bg-white/5">
                  <div className={`h-full ${node.color}`} style={{ width: `${node.reputationScore}%` }}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
