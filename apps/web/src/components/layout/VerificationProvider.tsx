"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { AgentLog, VerificationState, AGENTS } from "@/lib/verificationEngine";

interface VerificationContextProps {
  globalLogs: AgentLog[];
  activeVerification: {
    id: string | null;
    state: VerificationState;
    confidence: number;
    fraudRisk: number;
    valueEstimate: string;
    evidenceHash: string;
    signature?: string;
  };
  startVerification: (assetId: string, initialTxHash?: string) => void;
}

const VerificationContext = createContext<VerificationContextProps | undefined>(undefined);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [globalLogs, setGlobalLogs] = useState<AgentLog[]>([]);
  const [activeVerification, setActiveVerification] = useState<VerificationContextProps["activeVerification"]>({
    id: null,
    state: "PENDING",
    confidence: 0,
    fraudRisk: 0,
    valueEstimate: "",
    evidenceHash: "",
    signature: "",
  });

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  const addLog = (log: Omit<AgentLog, "id" | "timestamp">) => {
    setGlobalLogs(prev => {
      const newLog: AgentLog = { ...log, id: Math.random().toString(), timestamp: Date.now() };
      const updated = [...prev, newLog];
      if (updated.length > 50) updated.shift();
      return updated;
    });
  };

  const generateLogHash = (message: string, agent: string) => {
    const payload = `${agent}:${message}`;
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      const char = payload.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hex1 = Math.abs(hash).toString(16).padStart(8, '0');
    const hex2 = Math.abs(~hash).toString(16).padStart(8, '0');
    const hex3 = Math.abs(hash ^ 0x5a5a5a5a).toString(16).padStart(8, '0');
    const hex4 = Math.abs(~hash ^ 0xa5a5a5a5).toString(16).padStart(8, '0');
    return "0x" + hex1 + hex2 + hex3 + hex4 + hex1 + hex2 + hex3 + hex4;
  };

  const startVerification = (assetId: string, initialTxHash?: string) => {
    clearAllTimeouts();
    setGlobalLogs([]);
    
    // Initial State: Activation
    setActiveVerification({
      id: assetId,
      state: "AGENTS_ACTIVATING",
      confidence: 15,
      fraudRisk: 0,
      valueEstimate: "",
      evidenceHash: "",
    });

    if (initialTxHash) {
      addLog({
        agent: "Aegis",
        actionType: "SCANNING",
        message: "Verification request intercepted from VerificationManager contract.",
        confidence: 15,
        txHash: initialTxHash
      });
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const eventSource = new EventSource(`${BACKEND_URL}/stream/${assetId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "status") {
         setActiveVerification(p => ({ ...p, state: "DATA_COLLECTION", confidence: data.confidence || p.confidence }));
         addLog({ agent: "Aegis", actionType: "SCANNING", message: data.message, confidence: data.confidence || 50, txHash: generateLogHash(data.message, "Aegis") });
      } else if (data.type === "finding") {
         addLog({ agent: data.agent, actionType: "SCANNING", message: data.message, confidence: 60, txHash: generateLogHash(data.message, data.agent) });
      } else if (data.type === "debate") {
         setActiveVerification(p => ({ ...p, state: "DEBATE_PHASE" }));
         addLog({ agent: data.agent as keyof typeof AGENTS, actionType: "DEBATING", message: data.message, confidence: 70, txHash: generateLogHash(data.message, data.agent) });
      } else if (data.type === "consensus") {
         setActiveVerification(p => ({ ...p, state: "CONSENSUS_FORMING", confidence: data.confidence || 90 }));
         addLog({ agent: "Aegis", actionType: "CONSENSUS", message: data.message, confidence: data.confidence || 90, txHash: generateLogHash(data.message, "Aegis") });
      } else if (data.type === "final_result") {
         const result = data.data;
         setActiveVerification(p => ({
            ...p,
            state: "FINALIZED",
            confidence: result.confidence,
            valueEstimate: result.market_value_estimate,
            evidenceHash: result.evidence_hash,
            signature: result.signature,
            fraudRisk: result.fraud_probability === "LOW" ? 1.2 : 85.0
         }));
      } else if (data.type === "done") {
         eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
      setActiveVerification(p => ({ ...p, state: "FINALIZED" })); // In case of disconnect gracefully fail or just exit
    };
  };

  return (
    <VerificationContext.Provider value={{ globalLogs, activeVerification, startVerification }}>
      {children}
    </VerificationContext.Provider>
  );
}

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) throw new Error("useVerification must be used within a VerificationProvider");
  return context;
};
