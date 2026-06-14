"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AGENTS } from "@/lib/mockEngine";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-full font-sans text-white bg-[#000000]">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-12 md:px-24 overflow-hidden border-b border-white/[0.04]">
        <div className="z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-3 py-1 border border-white/10 text-white/60 text-[10px] font-mono uppercase tracking-[0.2em] mb-12"
            >
              <div className="w-1.5 h-1.5 bg-white/40"></div>
              System V1.0 Online
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-light tracking-tight mb-8 text-white/90 leading-[1.1]"
            >
              Can Reality <br/>
              Be Verified?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
              className="text-lg text-white/40 max-w-xl mb-12 leading-relaxed font-light"
            >
              Proof-of-Reality is a decentralized AI consensus protocol for verifying real-world assets. Autonomous verification agents independently investigate, debate, and synthesize ground-truth data before immutable on-chain commitment.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
              className="flex gap-6"
            >
              <Link href="/verify" className="group flex items-center gap-4 px-8 py-4 bg-white text-black text-[11px] font-sans tracking-[0.2em] uppercase transition-all hover:bg-white/90">
                Launch Verification
              </Link>
              <Link href="/consensus" className="flex items-center gap-4 px-8 py-4 bg-transparent border border-white/10 text-white/70 text-[11px] font-sans tracking-[0.2em] uppercase transition-all hover:border-white/30 hover:text-white">
                Watch Consensus
              </Link>
            </motion.div>
          </div>

          {/* Right side: Mathematically precise SVG radial graphic */}
          <div className="flex-1 w-full relative h-[600px] hidden lg:block opacity-60">
            {mounted && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                  >
                    <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="200" cy="200" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    
                    {/* Rotating nodes */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <g key={angle} transform={`rotate(${angle} 200 200)`}>
                        <line x1="200" y1="40" x2="200" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <rect x="198" y="38" width="4" height="4" fill="rgba(255,255,255,0.8)" />
                        <rect x="199" y="119" width="2" height="2" fill="rgba(255,255,255,0.4)" />
                      </g>
                    ))}
                  </motion.g>
                  {/* Central Hub */}
                  <rect x="195" y="195" width="10" height="10" fill="rgba(255,255,255,0.9)" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 1.5 STATS BAR */}
      <section className="py-12 border-b border-white/[0.04] px-12 md:px-24 bg-[#020202]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-center md:text-left">
          
          <div className="pt-4 md:pt-0 md:pr-8 md:border-r border-white/10">
            <div className="font-mono text-3xl text-white/90 mb-2">$4.2B</div>
            <div className="font-sans text-[10px] text-white/40 uppercase tracking-[0.2em]">Assets Verified</div>
          </div>
          
          <div className="pt-4 md:pt-0 md:px-8 md:border-r border-white/10">
            <div className="font-mono text-3xl text-white/90 mb-2">18,492</div>
            <div className="font-sans text-[10px] text-white/40 uppercase tracking-[0.2em]">Cases Processed</div>
          </div>
          
          <div className="pt-4 md:pt-0 md:px-8 md:border-r border-white/10">
            <div className="font-mono text-3xl text-white/90 mb-2">92.8%</div>
            <div className="font-sans text-[10px] text-white/40 uppercase tracking-[0.2em]">Avg Truth Score</div>
          </div>
          
          <div className="pt-4 md:pt-0 md:px-8 md:border-r border-white/10">
            <div className="font-mono text-3xl text-white/90 mb-2">1,847</div>
            <div className="font-sans text-[10px] text-white/40 uppercase tracking-[0.2em]">Active Validators</div>
          </div>
          
          <div className="pt-4 md:pt-0 md:pl-8">
            <div className="font-mono text-3xl text-white/90 mb-2">34</div>
            <div className="font-sans text-[10px] text-white/40 uppercase tracking-[0.2em]">Jurisdictions</div>
          </div>

        </div>
      </section>

      {/* 1.75 WHY POR EXISTS */}
      <section className="py-32 border-b border-white/[0.04] px-12 md:px-24 bg-black">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-light text-white/90 tracking-tight uppercase tracking-[0.2em] text-[12px] text-white/30 font-mono">
            Why PoR Exists
          </h2>
          <div className="space-y-6 text-2xl md:text-4xl font-light text-white/40 leading-relaxed tracking-tight">
            <p>RWA fraud and verification failures cost billions every year.</p>
            <p>Traditional oracles verify data.</p>
            <p className="text-white/90">PoR verifies <span className="italic text-emerald-400">reality</span>.</p>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (PIPELINE) */}
      <section className="py-32 border-b border-white/[0.04] px-12 md:px-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-3xl font-light text-white/90 mb-4 tracking-tight">The Verification Pipeline</h2>
            <p className="text-white/30 font-mono text-[10px] tracking-[0.2em] uppercase">Proprietary 5-Stage Consensus Protocol</p>
          </div>
          
          <div className="relative">
            {/* Extremely thin static line */}
            <div className="absolute top-3 left-0 w-full h-[1px] bg-white/[0.05] z-0"></div>
            
            <div className="grid grid-cols-5 gap-4 relative z-10">
              {[
                { title: "Submit Asset", desc: "Data ingestion & indexing" },
                { title: "Agents Activate", desc: "Node allocation" },
                { title: "Investigation", desc: "Parallel data sourcing" },
                { title: "Consensus", desc: "Debate & validation" },
                { title: "Truth Minted", desc: "Immutable on-chain record" }
              ].map((step, i) => (
                <div key={i} className="group cursor-default">
                  <div className="w-6 h-6 border border-white/10 bg-[#000000] flex items-center justify-center mb-6 transition-colors duration-500 group-hover:border-white/40">
                    <div className="w-1.5 h-1.5 bg-white/20 group-hover:bg-white/80 transition-colors duration-500"></div>
                  </div>
                  <div className="font-mono text-[10px] text-white/30 mb-2 tracking-[0.2em]">0{i+1}</div>
                  <div className="text-sm font-medium text-white/70 mb-2 transition-colors duration-500 group-hover:text-white">{step.title}</div>
                  <div className="text-[11px] font-sans text-white/40 font-light opacity-0 transition-opacity duration-500 group-hover:opacity-100">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEET THE AGENTS */}
      <section className="py-32 px-12 md:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-light text-white/90 mb-4 tracking-tight">Intelligence Nodes</h2>
              <p className="text-white/30 font-mono text-[10px] tracking-[0.2em] uppercase">Autonomous Analysis Agents</p>
            </div>
            <div className="font-mono text-[10px] text-white/30 tracking-[0.2em]">ACTIVE_NODES: {Object.keys(AGENTS).length}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/[0.04]">
            {Object.entries(AGENTS).map(([name, data], i) => (
              <div 
                key={name}
                className="group p-8 bg-[#000000] hover:bg-[#050505] transition-colors duration-700 relative"
              >
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h3 className="text-sm font-medium tracking-widest uppercase text-white/80 group-hover:text-white transition-colors duration-700">{name}</h3>
                    <div className="text-[10px] font-mono text-white/30 mt-2 uppercase tracking-[0.2em]">{data.role}</div>
                  </div>
                  <div className="w-2 h-2 border border-white/20 group-hover:bg-white/80 transition-all duration-700"></div>
                </div>
                
                <div className="space-y-4 font-mono text-[10px] tracking-wider">
                  <div className="flex justify-between border-b border-white/[0.04] pb-2">
                    <span className="text-white/30">STATUS</span>
                    <span className="text-white/60">ONLINE</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.04] pb-2">
                    <span className="text-white/30">ACCURACY</span>
                    <span className="text-white/80">{(94.1 + (i * 0.65)).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">CONSENSUS WGT</span>
                    <span className="text-white/80">{(0.12 + (i * 0.015)).toFixed(3)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FUTURE NODE NETWORK */}
      <section className="py-32 px-12 md:px-24 bg-black relative overflow-hidden border-t border-white/[0.04]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block px-3 py-1 mb-8 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] tracking-[0.2em] uppercase">
            Status: Coming in Phase II
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-white/90 tracking-tight mb-8">
            Future Node Network
          </h2>
          <p className="text-white/40 text-lg font-light mb-16 max-w-2xl mx-auto leading-relaxed">
            The PoR protocol will soon decentralize the agent execution layer. Anyone can become a validator to secure real-world truth.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[10px] tracking-[0.2em] uppercase mb-16 text-white/60">
            <div className="p-8 border border-white/10 bg-black hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">Stake MNT</div>
            <div className="p-8 border border-white/10 bg-black hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">Run Agent</div>
            <div className="p-8 border border-white/10 bg-black hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">Earn Fees</div>
            <div className="p-8 border border-white/10 bg-black hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">Reputation System</div>
          </div>

          <Link href="/nodes/apply" className="inline-flex items-center gap-4 px-8 py-4 bg-white text-black text-[11px] font-sans tracking-[0.2em] uppercase transition-all hover:bg-white/90">
            Become a Validator
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/[0.04] text-center font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">
        Proof-of-Reality Protocol © 2026
      </footer>
    </div>
  );
}
