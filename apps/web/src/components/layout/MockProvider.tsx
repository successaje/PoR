"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { AgentLog, VerificationState, AGENTS } from "@/lib/mockEngine";

interface MockContextProps {
  globalLogs: AgentLog[];
  activeVerification: {
    id: string | null;
    state: VerificationState;
    confidence: number;
    fraudRisk: number;
    valueEstimate: string;
    evidenceHash: string;
  };
  startVerification: (assetId: string, initialTxHash?: string) => void;
}

const MockContext = createContext<MockContextProps | undefined>(undefined);

export function MockProvider({ children }: { children: ReactNode }) {
  const [globalLogs, setGlobalLogs] = useState<AgentLog[]>([]);
  const [activeVerification, setActiveVerification] = useState<MockContextProps["activeVerification"]>({
    id: null,
    state: "PENDING",
    confidence: 0,
    fraudRisk: 0,
    valueEstimate: "",
    evidenceHash: "",
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

  const generateMockHash = () => "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

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

    const eventSource = new EventSource(`http://localhost:8000/stream/${assetId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "status") {
         setActiveVerification(p => ({ ...p, state: "DATA_COLLECTION", confidence: data.confidence || p.confidence }));
         addLog({ agent: "Aegis", actionType: "SCANNING", message: data.message, confidence: data.confidence || 50, txHash: generateMockHash() });
      } else if (data.type === "finding") {
         addLog({ agent: data.agent, actionType: "SCANNING", message: data.message, confidence: 60, txHash: generateMockHash() });
      } else if (data.type === "debate") {
         setActiveVerification(p => ({ ...p, state: "DEBATE_PHASE" }));
         addLog({ agent: data.agent as keyof typeof AGENTS, actionType: "DEBATING", message: data.message, confidence: 70, txHash: generateMockHash() });
      } else if (data.type === "consensus") {
         setActiveVerification(p => ({ ...p, state: "CONSENSUS_FORMING", confidence: data.confidence || 90 }));
         addLog({ agent: "Aegis", actionType: "CONSENSUS", message: data.message, confidence: data.confidence || 90, txHash: generateMockHash() });
      } else if (data.type === "final_result") {
         const result = data.data;
         setActiveVerification(p => ({
            ...p,
            state: "FINALIZED",
            confidence: result.confidence,
            valueEstimate: result.market_value_estimate,
            evidenceHash: result.evidence_hash,
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
    <MockContext.Provider value={{ globalLogs, activeVerification, startVerification }}>
      {children}
    </MockContext.Provider>
  );
}

export const useMock = () => {
  const context = useContext(MockContext);
  if (!context) throw new Error("useMock must be used within a MockProvider");
  return context;
};
