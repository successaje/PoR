"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PROTOCOL_NODES } from "@/config/nodes";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function NodeApplicationPage() {
  const [formData, setFormData] = useState({
    emailAddress: "",
    walletAddress: "",
    nodeType: "Atlas",
    systemSpecs: "",
    bandwidth: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prompt the Wagmi staking transaction (1 mETH)
      await sendTransactionAsync({
        to: "0x34d156d6c062804771652b48f2d65d58d3794113", // VerificationManager / AgentRegistry proxy
        value: parseEther("1"), // 1 mETH Stake
      });
      
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Staking transaction failed:", error);
      setIsSubmitting(false);
      
      // Fallback for hackathon demo purposes if user rejects or has no funds
      if (window.confirm("Transaction failed or rejected. Proceed with simulated success for the demo?")) {
        setIsSubmitted(true);
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white p-10 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full border border-emerald-500/30 bg-emerald-500/5 p-10 text-center"
        >
          <div className="w-16 h-16 border border-emerald-500/50 rounded-full mx-auto flex items-center justify-center mb-6">
            <span className="text-emerald-400 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-light text-white mb-2 tracking-widest uppercase">Application Received</h2>
          <p className="text-white/50 text-[11px] font-mono tracking-widest uppercase mb-8">Your node application has been added to the registry queue. Pending governance vote.</p>
          <a href="/nodes/network" className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">
            View Node Network →
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col md:flex-row relative">
      <div className="w-full max-w-lg mx-auto flex flex-col">
        <div className="mb-12">
          <h1 className="text-3xl font-light text-white/90 tracking-tight mb-2">Become a Node Operator</h1>
          <p className="text-white/40 text-[11px] font-mono tracking-widest uppercase mb-6">
            Join the decentralized Aletheia consensus engine. Provide compute and models to verify real-world assets.
          </p>
          {!isConnected && (
            <div className="p-6 border border-emerald-500/20 bg-emerald-500/5 mb-8 flex flex-col items-start gap-4">
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                Action Required
              </div>
              <div className="text-sm text-white/80 font-light">
                Node operators are required to stake 1 mETH to participate in the consensus engine. You will continue to earn Ethereum PoS yield on your collateral while earning PoR verification fees (Double Yield). Please connect your wallet to apply.
              </div>
              <ConnectButton />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className={`space-y-8 flex-1 ${!isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Email Address</label>
            <input
              type="email"
              required
              placeholder="operator@example.com"
              className="w-full bg-white/[0.02] border border-white/10 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white transition-colors"
              value={formData.emailAddress}
              onChange={e => setFormData({ ...formData, emailAddress: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Wallet Address</label>
            <input
              type="text"
              required
              placeholder="0x..."
              className="w-full bg-white/[0.02] border border-white/10 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white transition-colors"
              value={formData.walletAddress}
              onChange={e => setFormData({ ...formData, walletAddress: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Target Node Authority</label>
            <select
              className="w-full bg-[#050505] border border-white/10 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white transition-colors appearance-none"
              value={formData.nodeType}
              onChange={e => setFormData({ ...formData, nodeType: e.target.value })}
            >
              {Object.values(PROTOCOL_NODES).map(node => (
                <option key={node.id} value={node.id}>
                  {node.id} - {node.role}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Hardware / System Specs</label>
            <textarea
              required
              rows={4}
              placeholder="e.g. 4x NVIDIA A100, 256GB RAM..."
              className="w-full bg-white/[0.02] border border-white/10 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white transition-colors resize-none"
              value={formData.systemSpecs}
              onChange={e => setFormData({ ...formData, systemSpecs: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Uplink Bandwidth (Gbps)</label>
            <input
              type="text"
              required
              placeholder="e.g. 10 Gbps"
              className="w-full bg-white/[0.02] border border-white/10 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white transition-colors"
              value={formData.bandwidth}
              onChange={e => setFormData({ ...formData, bandwidth: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isConnected}
            className="w-full bg-white hover:bg-white/90 text-black font-sans text-[11px] tracking-[0.2em] uppercase py-4 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting ? "Awaiting Wallet Signature..." : "Stake 1 mETH & Apply"}
          </button>
        </form>
      </div>
    </div>
  );
}
