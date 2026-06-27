"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useVerification } from "@/components/layout/VerificationProvider";
import { AGENTS } from "@/lib/verificationEngine";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { truthCertificateABI, verificationManagerABI } from '@/lib/abi';
import { DebateModal } from "@/components/layout/DebateModal";

const VERIFICATION_MANAGER_ADDRESS = "0x38509275F1da637C17790D50f6AD8B6F729759ff";

export default function VerifyPage() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  
  const { writeContract: writeResolve, data: resolveHash, isPending: isResolvePending } = useWriteContract();
  const { isLoading: isResolveConfirming, isSuccess: isResolveConfirmed } = useWaitForTransactionReceipt({ hash: resolveHash });

  const [isInitializing, setIsInitializing] = useState(false);
  
  const [isDebateModalOpen, setIsDebateModalOpen] = useState(false);
  
  const { activeVerification, startVerification, globalLogs } = useVerification();
  const [assetId, setAssetId] = useState("");
  const [coords, setCoords] = useState("");
  const [description, setDescription] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [claimedValue, setClaimedValue] = useState("");
  const [entityName, setEntityName] = useState("");
  const [assetCategories, setAssetCategories] = useState<string[]>(["Residential District", "High-value Real Estate Zone", "RWA (Real World Asset)"]);
  const [infrastructureText, setInfrastructureText] = useState("");
  const [infrastructureTags, setInfrastructureTags] = useState<string[]>([]);

  const handleInfrastructureChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInfrastructureText(val);
    
    const lowerVal = val.toLowerCase();
    const newTags = new Set(infrastructureTags);
    
    if (lowerVal.includes("electrical") || lowerVal.includes("underground")) {
      newTags.add("Underground electrical systems");
    }
    if (lowerVal.includes("fiber") || lowerVal.includes("internet")) {
      newTags.add("Fiber optic internet infrastructure");
    }
    if (lowerVal.includes("sewage") || lowerVal.includes("water")) {
      newTags.add("Central sewage and water treatment system");
    }
    
    setInfrastructureTags(Array.from(newTags));
  };
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [docNames, setDocNames] = useState<string[]>([]);
  
  // Local upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isSubmitting = isUploading || (activeVerification.state !== "PENDING" && activeVerification.state !== "FINALIZED" && activeVerification.state !== "MINTED_ON_CHAIN");

  const hasStarted = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId || !address) return;
    
    // Reset the hasStarted ref so the useEffect can fire again on resubmission
    hasStarted.current = false;
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      setIsInitializing(true);
      const formData = new FormData();
      formData.append('asset_id', assetId);
      formData.append('metadata', JSON.stringify({
        description: description,
        infrastructure: infrastructureText,
        jurisdiction: jurisdiction,
        assetCategories,
        infrastructureTags,
        coords,
        owner_wallet: address,
        claimedValue: claimedValue,
        entityName: entityName
      }));

      // Append physical files if they exist
      if (imageInputRef.current?.files) {
        Array.from(imageInputRef.current.files).forEach(file => formData.append('files', file));
      }
      if (docInputRef.current?.files) {
        Array.from(docInputRef.current.files).forEach(file => formData.append('files', file));
      }

      const res = await fetch(`${apiUrl}/submit`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      // Simulate fast upload progress before starting the verification
      setIsUploading(true);
      setUploadProgress(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsInitializing(false);
          hasStarted.current = true;
          // In PoR, case initialization is off-chain. We just generate a deterministic hash for the UI.
          startVerification(assetId, `0x${assetId.replace(/[^a-f0-9]/gi, '').padEnd(40, '0')}`);
        }
      }, 200);

    } catch (err) {
      console.error("Backend submission failed:", err);
      setIsInitializing(false);
    }
  };

  // Determine current UI State for the right panel
  const renderRightPanel = () => {
    if (activeVerification.state === "PENDING") {
      if (isInitializing || isUploading) {
        return (
          <div className="m-auto flex flex-col items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-32 h-32 border border-dashed border-emerald-500/30 rounded-full flex items-center justify-center mb-8 relative"
            >
              <div className="absolute inset-0 bg-emerald-500/5 rounded-full animate-pulse" />
              <div className="w-16 h-16 border border-emerald-500/50 rounded-full flex items-center justify-center">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
              </div>
            </motion.div>
            <div className="font-mono tracking-[0.2em] uppercase text-[10px] text-emerald-400/80 mb-3 animate-pulse">
              {isUploading ? `UPLOADING METADATA: ${uploadProgress}%` : 'INITIALIZING ALETHEIA ENGINE...'}
            </div>
            <div className="w-48 h-[2px] bg-white/10 overflow-hidden relative">
               <div className="absolute h-full bg-emerald-500/80 transition-all duration-200" style={{ width: `${isUploading ? uploadProgress : 25}%` }}></div>
            </div>
          </div>
        );
      }

      return (
        <div className="m-auto flex flex-col items-center justify-center text-white/20">
           <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-6">
             <div className="w-2 h-2 bg-white/10"></div>
           </div>
          <div className="font-mono tracking-[0.2em] uppercase text-[10px]">Awaiting Target Input</div>
        </div>
      );
    }

    if (activeVerification.state === "AGENTS_ACTIVATING") {
      return (
        <div className="m-auto flex flex-col items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="w-32 h-32 border border-dashed border-white/20 rounded-full flex items-center justify-center mb-8"
          >
            <div className="w-16 h-16 border border-white/40 rounded-full flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </motion.div>
          <div className="font-mono tracking-[0.2em] uppercase text-[10px] text-white/60 animate-pulse">
            Booting Aletheia Consensus Engine...
          </div>
        </div>
      );
    }

    if (activeVerification.state === "CONSENSUS_FORMING") {
      return (
        <div className="m-auto flex flex-col items-center justify-center w-full h-full relative">
          <h4 className="absolute top-10 left-10 font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">Radial Convergence</h4>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Center Core: Aegis */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 bg-rose-500/10 border border-rose-500/50 rounded-full z-10 flex flex-col items-center justify-center backdrop-blur-md relative"
            >
              <span className="font-mono text-[8px] text-rose-400 uppercase tracking-widest absolute -top-4">Aegis</span>
              <span className="font-mono text-[12px] text-white/90">{activeVerification.confidence.toFixed(0)}%</span>
            </motion.div>
            
            {/* Orbiting Agents (7 nodes) */}
            {Object.keys(AGENTS).filter(a => a !== 'Aegis').map((agent, i) => {
              const angle = (i / 7) * Math.PI * 2;
              const radius = 100;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <motion.div
                  key={agent}
                  initial={{ x: x * 2, y: y * 2, opacity: 0 }}
                  animate={{ x, y, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 50, damping: 10, delay: i * 0.1 }}
                  className="absolute w-8 h-8 border border-white/20 rounded-full flex items-center justify-center"
                >
                  <span className="font-mono text-[6px] text-white/40 uppercase">{agent.substring(0,3)}</span>
                  {/* Laser line to center */}
                  <svg className="absolute w-full h-full overflow-visible -z-10" style={{ left: '50%', top: '50%' }}>
                    <motion.line 
                       x1="0" y1="0" 
                       x2={-x} y2={-y} 
                       stroke="rgba(255,255,255,0.1)" 
                       strokeWidth="1"
                       initial={{ pathLength: 0 }}
                       animate={{ pathLength: 1 }}
                       transition={{ duration: 1, delay: 1 }}
                    />
                  </svg>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-12 font-mono tracking-[0.2em] uppercase text-[10px] text-white/60">
            Synthesizing Cryptographic Evidence...
          </div>
        </div>
      );
    }

    if (activeVerification.state === "FINALIZED" || isConfirmed) {
      return (
        <div className="m-auto w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="p-8 bg-white/[0.02] border border-white/10"
          >
            <div className="flex items-center gap-4 text-white/90 mb-8 font-sans font-medium tracking-[0.2em] uppercase text-[11px] border-b border-white/[0.04] pb-4">
              <div className="w-2 h-2 bg-emerald-500/80"></div>
              {isConfirmed ? "Truth Certificate Minted" : "Consensus Achieved"}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-[10px] tracking-widest uppercase mb-12">
              <div>
                <div className="text-white/30 mb-2">Final Score</div>
                <div className="text-xl text-white/90">{activeVerification.confidence.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-white/30 mb-2">Fraud Prob</div>
                <div className="text-lg text-white/60">LOW</div>
              </div>
              <div>
                <div className="text-white/30 mb-2">Est Value</div>
                <div className="text-lg text-white/60">{activeVerification.valueEstimate || "$418,000"}</div>
              </div>
              <div>
                <div className="text-white/30 mb-2">Status</div>
                <div className="text-lg text-emerald-400">VERIFIED</div>
              </div>
            </div>

            <div className="p-6 border border-white/10 bg-black/50 mb-8">
              <h5 className="font-mono text-[9px] text-white/40 uppercase tracking-widest mb-4">Audit Trail & Evidence</h5>
              <div className="space-y-3 font-mono text-[10px] text-white/70 break-all">
                {createCaseHash && (
                  <div className="flex flex-col">
                    <span className="text-white/30">Case Initiation TX:</span> 
                    <a href={`https://explorer.sepolia.mantle.xyz/tx/${createCaseHash}`} target="_blank" rel="noreferrer" className="text-cyan-500 hover:text-cyan-400 transition-colors">
                      {createCaseHash} ↗
                    </a>
                  </div>
                )}
                {isConfirmed && hash && (
                  <div className="flex flex-col">
                    <span className="text-white/30">Certificate Mint TX:</span> 
                    <a href={`https://explorer.sepolia.mantle.xyz/tx/${hash}`} target="_blank" rel="noreferrer" className="text-cyan-500 hover:text-cyan-400 transition-colors">
                      {hash} ↗
                    </a>
                  </div>
                )}
                <div className="flex flex-col"><span className="text-white/30">Evidence Hash:</span> 0x8a92f8e1...4b9c (SHA-256)</div>
                <div className="flex flex-col"><span className="text-white/30">Verified By:</span> Aletheia Engine (8 Nodes)</div>
              </div>
              {isConfirmed && hash && (
                <div className="mt-6">
                  <Link href={`/case/${assetId || "REG-8492-TX"}`} className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 text-white font-sans text-[11px] tracking-[0.2em] uppercase transition-colors">
                    Enter Verification Room
                  </Link>
                </div>
              )}
            </div>
            
            {!isConfirmed && (
              <div className="space-y-4">
                <button 
                  onClick={() => setIsDebateModalOpen(true)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-sans text-[11px] tracking-[0.2em] uppercase transition-colors border border-white/10 mb-2"
                >
                  View Debate Chamber
                </button>
                <a 
                  href="https://smith.langchain.com/"
                  target="_blank" rel="noreferrer"
                  className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors border border-emerald-500/20 block text-center mb-4 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  View Auditable Reasoning Trace ↗
                </a>
                {!isResolveConfirmed ? (
                  <button 
                    onClick={() => {
                      if (!address || !activeVerification.signature) return;
                      writeResolve({
                        address: VERIFICATION_MANAGER_ADDRESS,
                        abi: verificationManagerABI,
                        functionName: 'resolveCase',
                        args: [
                          assetId || "REG-8492-TX",
                          Math.floor(activeVerification.confidence),
                          (activeVerification.evidenceHash || "0x0000000000000000000000000000000000000000000000000000000000000000") as `0x${string}`,
                          (activeVerification.signature || "0x") as `0x${string}`
                        ]
                      });
                    }}
                    disabled={isResolvePending || isResolveConfirming || !address || !activeVerification.signature}
                    className="w-full py-4 bg-white/20 hover:bg-white/30 text-white font-sans text-[11px] tracking-[0.2em] uppercase transition-colors disabled:opacity-50"
                  >
                    {!address ? 'CONNECT IDENTITY' : isResolvePending ? 'AWAITING WALLET...' : isResolveConfirming ? 'FINALIZING ON MANTLE...' : 'Finalize AI Verification On-Chain'}
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      if (!address) return;
                      writeContract({
                        address: '0x47f4917805C577a168d411b4531F2A49fBeF311e', // TruthCertificateNFT
                        abi: truthCertificateABI,
                        functionName: 'mintCertificate',
                        args: [
                          address,
                          assetId || "REG-8492-TX",
                          Math.floor(activeVerification.confidence),
                          BigInt(60 * 60 * 24 * 30), // 30 days
                          (activeVerification.evidenceHash || "0x0000000000000000000000000000000000000000000000000000000000000000") as `0x${string}`
                        ]
                      });
                    }}
                    disabled={isWritePending || isConfirming || !address}
                    className="w-full py-4 bg-white hover:bg-white/90 text-black font-sans text-[11px] tracking-[0.2em] uppercase transition-colors disabled:opacity-50"
                  >
                    {isWritePending ? 'AWAITING SIGNATURE...' : isConfirming ? 'MINTING ON MANTLE...' : 'Issue Truth Certificate'}
                  </button>
                )}
              </div>
            )}
          </motion.div>
          
          <DebateModal 
            isOpen={isDebateModalOpen} 
            onClose={() => setIsDebateModalOpen(false)} 
            logs={globalLogs} 
          />
        </div>
      );
    }

    // Default to DATA_COLLECTION and DEBATE_PHASE view
    return (
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Agent Activation Sequence */}
        <div className="mb-12">
          <h4 className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase border-b border-white/[0.04] pb-3 mb-6">Node Activation Matrix</h4>
          <div className="flex flex-wrap gap-4">
            {Object.keys(AGENTS).map((agent, i) => {
              const isActive = true; // Always active in this view
              return (
                <motion.div
                  key={agent}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col gap-3"
                >
                  <div className={`w-8 h-8 border flex items-center justify-center transition-colors duration-500 border-white/30 ${agent === 'Aegis' ? 'bg-rose-500/10 border-rose-500/50' : 'bg-white/5'}`}>
                    <div className={`w-1.5 h-1.5 animate-pulse ${agent === 'Aegis' ? 'bg-rose-400' : 'bg-white/80'}`}></div>
                  </div>
                  <span className={`font-mono text-[8px] uppercase tracking-widest ${agent === 'Aegis' ? 'text-rose-400/80' : 'text-white/40'}`}>{agent.substring(0,3)}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Debate Chamber */}
        <div className="flex-1 flex flex-col min-h-0 mb-8">
           <h4 className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase border-b border-white/[0.04] pb-3 mb-6 flex justify-between">
             <span>Debate Timeline</span>
             <span className="text-white/60 animate-[pulse_3s_ease-in-out_infinite]">{activeVerification.state.replace("_", " ")}</span>
           </h4>
           
           <div className="flex-1 relative min-h-0">
             <div className="absolute inset-0 overflow-y-auto space-y-6 pr-4 custom-scrollbar pb-8">
               <AnimatePresence>
                 {globalLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`pl-4 border-l ${
                        log.actionType === "DEBATING" ? 'border-amber-500/50' : 
                        log.actionType === "ARBITRATING" ? 'border-purple-500/50' :
                        log.actionType === "RESOLUTION" || log.actionType === "CONSENSUS" ? 'border-emerald-500/50' :
                        log.actionType === "SCANNING" ? 'border-cyan-500/50' :
                        'border-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-2 font-mono text-[9px] tracking-[0.2em] uppercase">
                         <span className={
                           log.actionType === "DEBATING" ? "text-amber-400" : 
                           log.actionType === "ARBITRATING" ? "text-purple-400" :
                           log.actionType === "RESOLUTION" || log.actionType === "CONSENSUS" ? "text-emerald-400" :
                           log.actionType === "SCANNING" ? "text-cyan-400" :
                           "text-white/60"
                         }>{log.agent}</span>
                         {log.actionType === "DEBATING" && <span className="text-amber-500/60 ml-auto">CROSS-EXAMINATION</span>}
                         {log.actionType === "ARBITRATING" && <span className="text-purple-500/60 ml-auto">META-CONSENSUS</span>}
                         {log.actionType === "RESOLUTION" && <span className="text-emerald-500/60 ml-auto">CONFLICT RESOLVED</span>}
                      </div>
                      <div className="text-[12px] text-white/80 font-sans font-light leading-relaxed">
                        "{log.message}"
                      </div>
                    </motion.div>
                 ))}
               </AnimatePresence>
             </div>
           </div>
           <DebateModal 
             isOpen={isDebateModalOpen} 
             onClose={() => setIsDebateModalOpen(false)} 
             logs={globalLogs} 
           />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#000000] text-white">
      
      {/* Left Panel: Submission Form */}
      <div className="w-full md:w-[450px] p-10 border-r border-white/[0.04] bg-[#000000] flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
        <div className="flex-grow">
          <div className="mb-12">
            <h2 className="text-2xl font-light mb-2 text-white/90 tracking-tight">Verify Asset</h2>
            <p className="text-white/40 text-[11px] font-sans font-light tracking-wide">Input parameters and documentary evidence to initialize the Aletheia consensus protocol.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Input 1: Registry ID */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Registry Identifier</label>
              <input
                type="text"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="REG-8492-TX"
                className="w-full bg-white/[0.02] border border-white/10 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white placeholder:text-white/20 transition-colors"
                disabled={isSubmitting}
              />
            </div>

            {/* Input: Asset Description */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Asset Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of the real-world asset..."
                className="w-full h-20 bg-white/[0.02] border border-white/10 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white placeholder:text-white/20 transition-colors resize-none custom-scrollbar"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Input: Jurisdiction */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Jurisdiction</label>
                <input
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  placeholder="e.g. Austin, Texas"
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white placeholder:text-white/20 transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              {/* Input: Coordinates */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] flex justify-between">
                  <span>Geo-Coordinates</span>
                  <span className="text-white/20">OPTIONAL</span>
                </label>
                <input
                  type="text"
                  value={coords}
                  onChange={(e) => setCoords(e.target.value)}
                  placeholder="30.2672° N, 97.7431° W"
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white placeholder:text-white/20 transition-colors"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Input: Legal Entity Name */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Legal Entity Name</label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="e.g. Acme Holdings LLC"
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white placeholder:text-white/20 transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              {/* Input: Claimed Value */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Claimed Value (USD)</label>
                <input
                  type="text"
                  value={claimedValue}
                  onChange={(e) => setClaimedValue(e.target.value)}
                  placeholder="e.g. $4,500,000"
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white placeholder:text-white/20 transition-colors"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Input: Asset Category */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Asset Category</label>
              <div className="grid grid-cols-2 gap-3">
                {["Residential District", "High-value Real Estate Zone", "RWA (Real World Asset)", "Commercial Property", "Industrial Asset"].map((category) => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 border ${assetCategories.includes(category) ? 'border-emerald-500 bg-emerald-500/20' : 'border-white/20 group-hover:border-white/40'} flex items-center justify-center transition-colors`}>
                      {assetCategories.includes(category) && <div className="w-2 h-2 bg-emerald-500" />}
                    </div>
                    <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest group-hover:text-white transition-colors">{category}</span>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={assetCategories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssetCategories([...assetCategories, category]);
                        } else {
                          setAssetCategories(assetCategories.filter(c => c !== category));
                        }
                      }}
                      disabled={isSubmitting}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Input: Infrastructure Metadata */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Infrastructure Metadata</label>
              <textarea
                value={infrastructureText}
                onChange={handleInfrastructureChange}
                placeholder="Paste survey data to auto-extract infrastructure tags..."
                className="w-full h-16 bg-white/[0.02] border border-white/10 focus:border-white/40 rounded-none px-4 py-3 focus:outline-none font-mono text-[11px] text-white placeholder:text-white/20 transition-colors resize-none custom-scrollbar"
                disabled={isSubmitting}
              />
              {infrastructureTags.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  {["Underground electrical systems", "Fiber optic internet infrastructure", "Central sewage and water treatment system"].map((tag) => (
                    infrastructureTags.includes(tag) && (
                      <div key={tag} className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest">
                        <span className="text-cyan-500">✓</span> {tag}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>



            {/* Input 3: File Upload - Images */}
            <div className="space-y-3">
               <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Asset Imagery</label>
               <input 
                 type="file" 
                 ref={imageInputRef} 
                 className="hidden" 
                 accept="image/jpeg, image/png"
                 multiple
                 onChange={(e) => {
                   if (e.target.files && e.target.files.length > 0) {
                     setImageNames(Array.from(e.target.files).map(f => f.name));
                   }
                 }}
               />
               <div 
                 onClick={() => !isSubmitting && imageInputRef.current?.click()}
                 className={`border border-dashed ${isSubmitting ? 'border-white/10 cursor-not-allowed' : 'border-white/20 hover:border-white/40 cursor-pointer'} p-6 flex flex-col items-center justify-center text-center transition-colors`}
               >
                 <div className={`w-6 h-6 border ${imageNames.length > 0 ? 'border-emerald-500/50 text-emerald-500/80 bg-emerald-500/10' : 'border-white/20 text-white/40'} mb-3 flex items-center justify-center`}>
                   {imageNames.length > 0 ? '✓' : '+'}
                 </div>
                 <div className={`text-[10px] font-mono ${imageNames.length > 0 ? 'text-emerald-400' : 'text-white/40'} uppercase tracking-widest`}>
                   {imageNames.length > 0 
                     ? imageNames.length === 1 ? imageNames[0] : `${imageNames.length} files selected` 
                     : 'Select files or drag & drop'}
                 </div>
                 {imageNames.length === 0 && <div className="text-[9px] font-sans text-white/20 mt-1">JPG, PNG up to 10MB</div>}
               </div>
            </div>

            {/* Input 4: File Upload - Docs */}
            <div className="space-y-3">
               <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Ownership Deed / Legal Docs</label>
               <input 
                 type="file" 
                 ref={docInputRef} 
                 className="hidden" 
                 accept=".pdf,.doc,.docx"
                 multiple
                 onChange={(e) => {
                   if (e.target.files && e.target.files.length > 0) {
                     setDocNames(Array.from(e.target.files).map(f => f.name));
                   }
                 }}
               />
               <div 
                 onClick={() => !isSubmitting && docInputRef.current?.click()}
                 className={`border border-dashed ${isSubmitting ? 'border-white/10 cursor-not-allowed' : 'border-white/20 hover:border-white/40 cursor-pointer'} p-6 flex flex-col items-center justify-center text-center transition-colors`}
               >
                 <div className={`w-6 h-6 border ${docNames.length > 0 ? 'border-emerald-500/50 text-emerald-500/80 bg-emerald-500/10' : 'border-white/20 text-white/40'} mb-3 flex items-center justify-center`}>
                   {docNames.length > 0 ? '✓' : '+'}
                 </div>
                 <div className={`text-[10px] font-mono ${docNames.length > 0 ? 'text-emerald-400' : 'text-white/40'} uppercase tracking-widest`}>
                   {docNames.length > 0 
                     ? docNames.length === 1 ? docNames[0] : `${docNames.length} files selected` 
                     : 'Select files or drag & drop'}
                 </div>
                 {docNames.length === 0 && <div className="text-[9px] font-sans text-white/20 mt-1">PDF, DOCX up to 20MB</div>}
               </div>
            </div>
            
              <button
                type="submit"
                disabled={isInitializing || isSubmitting || !assetId || !address}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-sans text-[11px] tracking-[0.2em] uppercase py-4 transition-colors disabled:opacity-30 flex items-center justify-center gap-3 relative overflow-hidden"
              >
                {/* Upload Progress Bar Layer */}
                {isUploading && (
                  <motion.div 
                    className="absolute left-0 top-0 h-full bg-white/10" 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ ease: "linear", duration: 0.4 }}
                  />
                )}
                
                <span className="relative z-10 flex items-center gap-3">
                  {!address ? (
                    "CONNECT WALLET TO INITIATE"
                  ) : isInitializing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      INITIALIZING ALETHEIA ENGINE...
                    </>
                  ) : isUploading ? (
                    <>
                      <div className="w-2 h-2 bg-white/50 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                      UPLOADING METADATA... {uploadProgress}%
                    </>
                  ) : activeVerification.state !== "PENDING" && activeVerification.state !== "FINALIZED" ? (
                    <>
                      <div className="w-2 h-2 bg-white/50 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                      CONSENSUS IN PROGRESS
                    </>
                  ) : (
                    "INITIATE PROOF-OF-REALITY"
                  )}
                </span>
              </button>
          </form>
        </div>

        {/* Dynamic Confidence Meter */}
        <div className="mt-12 pt-10 border-t border-white/[0.04]">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
              Confidence Delta
            </span>
            <span className="text-4xl font-light text-white/90 font-mono tracking-tighter">
              {activeVerification.confidence.toFixed(1)}<span className="text-white/30 text-xl ml-1">%</span>
            </span>
          </div>
          <div className="h-[2px] w-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-white/80"
              initial={{ width: 0 }}
              animate={{ width: `${activeVerification.confidence}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Right Panel: Live System Details */}
      <div className="flex-1 p-10 relative flex flex-col bg-[#020202] overflow-hidden">
        {renderRightPanel()}
      </div>
    </div>
  );
}
