"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <TopNav />

      <main className="pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              Programmable Trust. <br />
              <span className="text-white/40">Priced for Scale.</span>
            </h1>
            <p className="text-white/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Proof-of-Reality is economically self-sustaining from day one. 
              Our pricing model ensures high-quality multi-agent consensus while aggressively targeting Mantle-based CDP lending markets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
            
            {/* Developer Tier */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="border border-white/10 p-8 flex flex-col relative group overflow-hidden bg-white/[0.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <h3 className="text-xl font-medium mb-2">Testnet Integrator</h3>
              <p className="text-white/40 text-sm mb-8 h-10">For developers building on Mantle Sepolia.</p>
              
              <div className="mb-8">
                <span className="text-4xl font-light">$0</span>
                <span className="text-white/40 text-sm">/verification</span>
              </div>
              
              <ul className="space-y-4 mb-auto text-sm text-white/60 font-mono">
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-white" /> 3 AI Agents Active
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-white" /> Simulated Evidence
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-white" /> Testnet Truth Certificates
                </li>
              </ul>
              
              <Link href="/verify" className="w-full py-4 mt-12 bg-white/5 hover:bg-white/10 border border-white/10 text-center font-mono text-[10px] tracking-widest uppercase transition-colors">
                Start Building
              </Link>
            </motion.div>

            {/* Protocol Integrator */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="border border-white/30 p-8 flex flex-col relative group overflow-hidden bg-white/[0.04]"
            >
              <div className="absolute top-0 right-0 p-2">
                <span className="bg-white text-black text-[9px] uppercase tracking-widest px-2 py-1 font-mono font-bold">
                  Recommended
                </span>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <h3 className="text-xl font-medium mb-2">Lending Protocol</h3>
              <p className="text-white/40 text-sm mb-8 h-10">For Mantle CDPs needing a decentralized collateral oracle.</p>
              
              <div className="mb-8">
                <span className="text-4xl font-light">$50</span>
                <span className="text-white/40 text-sm">/verification</span>
              </div>
              
              <ul className="space-y-4 mb-auto text-sm text-white/80 font-mono">
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-emerald-400" /> All 7 Agents Active
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-emerald-400" /> Live Web2 API Ingestion
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-emerald-400" /> Mainnet Truth Certificates
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-emerald-400" /> 15% discount if paid in $POR
                </li>
              </ul>
              
              <Link href="/verify" className="w-full py-4 mt-12 bg-white text-black hover:bg-white/90 text-center font-mono text-[10px] tracking-widest uppercase transition-colors">
                Integrate Oracle
              </Link>
            </motion.div>

            {/* Enterprise Tier */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="border border-white/10 p-8 flex flex-col relative group overflow-hidden bg-white/[0.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <h3 className="text-xl font-medium mb-2">Enterprise Issuer</h3>
              <p className="text-white/40 text-sm mb-8 h-10">For institutional RWA tokenizers handling $10M+ assets.</p>
              
              <div className="mb-8">
                <span className="text-4xl font-light">Custom</span>
              </div>
              
              <ul className="space-y-4 mb-auto text-sm text-white/60 font-mono">
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-white" /> Dedicated Custom Agents
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-white" /> Hardware Node Isolation
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-white" /> Legal Framework Integration
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-white" /> Hourly Truth Decay Batches
                </li>
              </ul>
              
              <Link href="mailto:contact@porprotocol.com" className="w-full py-4 mt-12 bg-white/5 hover:bg-white/10 border border-white/10 text-center font-mono text-[10px] tracking-widest uppercase transition-colors">
                Contact Sales
              </Link>
            </motion.div>

          </div>

          {/* Unit Economics Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-t border-white/10 pt-20"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl tracking-tight mb-4">Transparent Unit Economics</h2>
              <p className="text-white/50 text-sm max-w-xl mx-auto">
                How the $50 Protocol Integrator fee is trustlessly routed via smart contracts.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Box 1 */}
              <div className="flex-1 p-8 border border-white/5 bg-white/[0.02]">
                <div className="text-emerald-400 font-mono text-[10px] tracking-widest uppercase mb-4">AI Inference Cost</div>
                <div className="text-4xl font-light mb-2">$5.00 <span className="text-white/30 text-lg">/ 10%</span></div>
                <p className="text-white/50 text-xs leading-relaxed">
                  Covers the raw LLM inference costs (OpenAI, Anthropic) and premium Web2 API calls (satellite imagery, localized property databases) required by the 7 Aletheia agents to reach consensus.
                </p>
              </div>

              {/* Box 2 */}
              <div className="flex-1 p-8 border border-white/5 bg-white/[0.02]">
                <div className="text-white font-mono text-[10px] tracking-widest uppercase mb-4">Node Operator Rewards</div>
                <div className="text-4xl font-light mb-2">$35.00 <span className="text-white/30 text-lg">/ 70%</span></div>
                <p className="text-white/50 text-xs leading-relaxed">
                  Paid out to the decentralized network of Node Operators running the AI Agents. Distributed proportionally based on agent participation and historical accuracy in the Debate Chamber. (Requires $POR stake).
                </p>
              </div>

              {/* Box 3 */}
              <div className="flex-1 p-8 border border-white/5 bg-white/[0.02]">
                <div className="text-white font-mono text-[10px] tracking-widest uppercase mb-4">Protocol Treasury</div>
                <div className="text-4xl font-light mb-2">$10.00 <span className="text-white/30 text-lg">/ 20%</span></div>
                <p className="text-white/50 text-xs leading-relaxed">
                  Captured by the PoR Protocol Treasury. Used for continuous $POR buyback-and-burn mechanisms and ongoing protocol development.
                </p>
              </div>
            </div>

          </motion.div>

        </div>
      </main>
    </div>
  );
}
