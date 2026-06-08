"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MOCK_ASSETS, AGENTS } from "@/lib/mockEngine";

export default function CertificatesPage() {
  return (
    <div className="p-10 min-h-full bg-[#000000] text-white">
      <div className="mb-12 flex items-center justify-between border-b border-white/[0.04] pb-6">
        <div>
          <h2 className="text-2xl font-light text-white/90 tracking-tight mb-2">Truth Certificates</h2>
          <p className="text-white/30 text-[10px] font-mono tracking-[0.2em] uppercase">Cryptographic Verification Instruments</p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase">
          <span className="text-white/40">TOTAL_MINTED:</span>
          <span className="text-white/80">12,492</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {MOCK_ASSETS.map((asset, i) => {
          const score = (92.4 + (i * 2.1)).toFixed(1);
          const tokenId = `0x7F${i}A9B${(i*3).toString(16).padStart(2, '0')}...E${i}1C`;

          return (
            <Link href={`/case/${asset.id}`} key={asset.id} className="block group">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 1.5, ease: "easeOut" }}
                className="flex flex-col md:flex-row bg-[#000000] border border-white/5 group-hover:border-white/20 transition-colors duration-700 h-full"
              >
              {/* NFT Visual Representation */}
              <div className="w-full md:w-48 bg-[#020202] border-r border-white/5 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-security-grid opacity-20"></div>
                
                <div className="absolute top-4 left-4 text-[7px] font-mono text-white/30 tracking-[0.2em]">ERC-721</div>
                <div className="absolute bottom-4 right-4 text-[7px] font-mono text-white/30 tracking-[0.2em]">SECURE</div>
                
                <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-4 group-hover:border-white/30 transition-colors duration-700">
                  <div className="w-2 h-2 bg-white/20 group-hover:bg-white/80 transition-colors duration-700"></div>
                </div>
                <div className="text-xl font-light text-white/90 font-mono tracking-tighter">{score}</div>
              </div>

              {/* Certificate Data */}
              <div className="flex-1 p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-sm font-medium text-white/80 mb-2">{asset.address}</h3>
                    <div className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">
                      {asset.type}
                    </div>
                  </div>
                  <span className="px-2 py-1 border border-white/10 text-white/60 text-[9px] font-sans tracking-[0.2em] uppercase">
                    Verified
                  </span>
                </div>

                <div className="space-y-4 font-mono text-[10px] tracking-widest">
                  <div className="flex justify-between border-b border-white/[0.04] pb-2">
                    <span className="text-white/30">TOKEN_ID</span>
                    <span className="text-white/80">{tokenId}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.04] pb-2">
                    <span className="text-white/30">TIMESTAMP</span>
                    <span className="text-white/60">2026-05-28T14:42Z</span>
                  </div>
                  <div className="pt-2">
                    <div className="text-white/30 mb-3">CONSENSUS_NODES</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(AGENTS).map(agent => (
                        <span key={agent} className="px-1.5 py-0.5 bg-white/5 text-[8px] text-white/40 uppercase tracking-[0.2em]">
                          {agent}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
