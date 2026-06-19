"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import TextScramble from "@/components/ui/TextScramble";

export default function LendingVaultPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/cases`);
        if (res.ok) {
          const data = await res.json();
          const verifiedCases = (data.cases || []).filter((c: any) => c.status === 'verified');
          setCases(verifiedCases);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const tvl = cases.reduce((acc, curr) => acc + (curr.declared_value_usd || 0), 0);
  const formattedTvl = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(tvl);

  return (
    <div className="min-h-full font-sans text-white bg-[#000000] p-8 md:p-16">
      
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/[0.04] pb-8 gap-8">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white/90 mb-2">PoR Lending Vault</h1>
          <p className="font-mono text-[12px] text-white/40 tracking-[0.2em] uppercase max-w-2xl leading-relaxed">
            Borrow stablecoins against mathematically verified real-world assets. Only assets with a 100% truth consensus on the Mantle network are eligible as collateral.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[10px] font-mono text-cyan-500/80 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            Vault Active
          </div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
            Contract: PoRLendingVault.sol
          </p>
        </div>
      </div>

      {/* Global Vault Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-[#050505] border border-white/10 p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4 relative z-10">Total Value Locked (TVL)</h3>
          <div className="text-4xl font-light text-cyan-400 relative z-10">
            {loading ? "..." : formattedTvl}
          </div>
        </div>
        <div className="bg-[#050505] border border-white/10 p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4 relative z-10">Avg. Collateral Ratio</h3>
          <div className="text-4xl font-light text-emerald-400 relative z-10">
            150<span className="text-xl text-white/30">%</span>
          </div>
        </div>
        <div className="bg-[#050505] border border-white/10 p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4 relative z-10">Available Liquidity</h3>
          <div className="text-4xl font-light text-amber-400 relative z-10">
            $42.5<span className="text-xl text-white/30">M</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-white/20"></div>
          Eligible Collateral
        </h3>

        {loading ? (
          <div className="py-12 text-center font-mono text-[10px] text-white/30 uppercase tracking-widest">Querying Vault...</div>
        ) : cases.length === 0 ? (
          <div className="py-12 text-center font-mono text-[10px] text-white/30 uppercase tracking-widest">No eligible collateral found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((asset, i) => {
              const maxBorrow = (asset.declared_value_usd * 0.65); // 65% LTV
              const formattedBorrow = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(maxBorrow);
              const val = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(asset.declared_value_usd);

              return (
                <div key={asset.asset_id} className="bg-black border border-white/10 flex flex-col h-full group hover:border-cyan-500/30 transition-colors duration-500">
                  {/* Image Header */}
                  <div className="h-40 relative overflow-hidden border-b border-white/5">
                    {asset.storage_url ? (
                      <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 scale-100 group-hover:scale-105" style={{ backgroundImage: `url(${asset.storage_url})` }}></div>
                    ) : (
                      <div className="absolute inset-0 bg-white/5"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <span className="text-xs font-mono text-white/60 tracking-widest uppercase">{asset.asset_type}</span>
                      <span className="text-[10px] font-mono px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">VERIFIED</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="text-white/90 font-medium truncate mb-6">{asset.jurisdiction}</h4>
                    
                    <div className="space-y-4 mb-8 flex-1">
                      <div className="flex justify-between items-center font-mono text-[10px] tracking-widest">
                        <span className="text-white/40">Asset Value</span>
                        <span className="text-white/80">{val}</span>
                      </div>
                      <div className="flex justify-between items-center font-mono text-[10px] tracking-widest">
                        <span className="text-white/40">Max LTV</span>
                        <span className="text-white/80">65.0%</span>
                      </div>
                      <div className="flex justify-between items-center font-mono text-[10px] tracking-widest">
                        <span className="text-white/40">Borrow APR</span>
                        <span className="text-cyan-400">4.2%</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-6 border-t border-white/[0.04] mt-auto">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">Available to Borrow</span>
                        <span className="text-xl font-light text-cyan-400">{formattedBorrow}</span>
                      </div>
                      <button className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors font-mono text-[10px] tracking-[0.2em] uppercase">
                        Deposit & Borrow
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
