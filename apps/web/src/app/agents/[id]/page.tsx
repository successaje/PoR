"use client";

import { motion } from "framer-motion";
import { AGENTS } from "@/lib/verificationEngine";
import Link from "next/link";
import { use } from "react";
import { NodeId } from "@/config/nodes";

export default function AgentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  // Need to correctly type the id or check if it exists in AGENTS
  const agentName = id as NodeId;
  const agent = AGENTS[agentName];

  if (!agent) {
    return (
      <div className="min-h-full bg-black text-white p-10 flex items-center justify-center">
        <div className="text-white/40 font-mono tracking-widest uppercase text-[10px]">Agent Not Found</div>
      </div>
    );
  }

  // Generate some deterministic stats based on the agent name
  const nameIndex = Object.keys(AGENTS).indexOf(agentName);
  const accuracy = (94.5 + (nameIndex * 0.45)).toFixed(2);
  const tasks = Math.floor(1250 + (nameIndex * 340));
  const flagged = Math.floor(tasks * 0.05);
  const repScore = (0.81 + (nameIndex * 0.02)).toFixed(3);

  return (
    <div className="min-h-full font-sans text-white bg-[#000000] p-8 md:p-16">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/[0.04] pb-8">
        <div>
          <Link href="/agents" className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest mb-6 inline-flex items-center gap-2 transition-colors">
            ← Back to Agent Network
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-3 h-3 rounded-sm ${agent.color.replace('text-', 'bg-')}`}></div>
            <h1 className="text-4xl font-light tracking-tight text-white/90">{agent.id}</h1>
          </div>
          <p className="font-mono text-[12px] text-white/40 tracking-[0.2em] uppercase">{agent.role}</p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-2 flex items-center gap-2 ${agent.activationState === 'ACTIVE' ? 'text-emerald-500/80' : 'text-amber-500/80'}`}>
            <div className={`w-2 h-2 rounded-full ${agent.activationState === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
            {agent.activationState} NODE
          </div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Reputation: {repScore}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Schema */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-[#050505] border border-white/10 p-8 space-y-8">
            <div>
              <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-2">Consensus Accuracy</h3>
              <div className="text-5xl font-light text-white/90">{accuracy}<span className="text-2xl text-white/30">%</span></div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/[0.04]">
              <div>
                <h3 className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Total Operations</h3>
                <div className="text-xl text-white/80 font-light">{tasks.toLocaleString()}</div>
              </div>
              <div>
                <h3 className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Anomalies Flagged</h3>
                <div className="text-xl text-amber-400/80 font-light">{flagged.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="bg-[#050505] border border-white/10 p-8">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white/20"></div>
              Data Output Schema
            </h3>
            <div className="font-mono text-[10px] text-white/60 bg-black p-4 border border-white/5 break-all">
              {agent.outputSchema}
            </div>
          </div>
          
        </div>

        {/* Right Column: Description, Tools, Node Operators */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-[#050505] border border-white/10 p-8">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white/20"></div>
              Operational Profile
            </h3>
            
            <p className="text-sm text-white/70 font-light leading-relaxed mb-8">
              {agent.description}
            </p>
            
            <div className="pt-8 border-t border-white/[0.04]">
              <h4 className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">Integrated Tooling Array</h4>
              <div className="flex flex-wrap gap-3">
                {agent.tools.map((tool, i) => (
                  <span key={i} className="px-3 py-1.5 bg-black border border-white/10 text-[10px] font-mono text-white/50 tracking-widest uppercase">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#050505] border border-white/10 p-8">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white/20"></div>
              Live Operator Network
            </h3>
            
            <div className="space-y-3">
              {/* Visualizing a few node operators for this specific agent class */}
              {[...Array(4)].map((_, i) => {
                const isOnline = i !== 3; // Make the last one offline just for flavor
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 bg-black border border-white/[0.05]"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500/50'}`}></div>
                      <span className="font-mono text-[10px] text-white/60 tracking-widest uppercase">
                        Node_Op_0x{Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}
                      </span>
                    </div>
                    <div className="flex gap-6 font-mono text-[9px] tracking-[0.2em] uppercase">
                      <span className="text-white/30">Uptime: {isOnline ? '99.9%' : '84.2%'}</span>
                      <span className={isOnline ? 'text-emerald-400/70' : 'text-red-400/50'}>{isOnline ? 'SYNCED' : 'OFFLINE'}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/[0.04] text-right">
              <Link href="/nodes/apply" className="text-[10px] font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-widest transition-colors">
                Apply to run this node class ↗
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
