"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { AgentLog, VerificationState, AgentName, AGENTS } from "@/lib/mockEngine";

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
  startVerification: (assetId: string) => void;
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
      const newLog: AgentLog = { ...log, id: Math.random().toString(), timestamp: new Date().toISOString() };
      const updated = [...prev, newLog];
      if (updated.length > 50) updated.shift();
      return updated;
    });
  };

  const startVerification = (assetId: string) => {
    clearAllTimeouts();
    setGlobalLogs([]);
    
    // Initial State: Activation (approx 2s)
    setActiveVerification({
      id: assetId,
      state: "AGENTS_ACTIVATING",
      confidence: 15,
      fraudRisk: 0,
      valueEstimate: "",
      evidenceHash: "",
    });

    const timers: NodeJS.Timeout[] = [];

    // 1. Investigation Phase (8-12s, we'll use 10s)
    timers.push(setTimeout(() => {
      setActiveVerification(p => ({ ...p, state: "DATA_COLLECTION", confidence: 35 }));
      
      // Simulate investigation logs over the next 10 seconds
      for (let i = 0; i < 5; i++) {
        timers.push(setTimeout(() => {
          const agents = Object.keys(AGENTS) as AgentName[];
          const randomAgent = agents[Math.floor(Math.random() * agents.length)];
          addLog({
            agent: randomAgent,
            actionType: "SCANNING",
            message: `Acquiring satellite imagery and extracting geolocation metadata for registry ${assetId}...`,
            confidence: 35 + (i * 5),
            txHash: null
          });
          setActiveVerification(p => ({ ...p, confidence: p.confidence + Math.random() * 5 }));
        }, i * 2000)); // Every 2 seconds
      }
    }, 2000));

    // 2. Debate Phase (5-8s, we'll use 7s)
    timers.push(setTimeout(() => {
      setActiveVerification(p => ({ ...p, state: "DEBATE_PHASE", confidence: 65 }));
      
      timers.push(setTimeout(() => {
        addLog({ agent: "Prism", actionType: "DEBATING", message: "Discrepancy found in valuation metric derived from local property registries. Flagging for cross-examination.", confidence: 60, txHash: null });
      }, 1000));
      
      timers.push(setTimeout(() => {
        addLog({ agent: "Ledger", actionType: "DEBATING", message: "Cross-referencing Prism's claim. Historical transaction data does not support the discrepancy. Suggesting re-evaluation.", confidence: 68, txHash: null });
      }, 3500));

      timers.push(setTimeout(() => {
        addLog({ agent: "Aegis", actionType: "DEBATING", message: "Conflict resolution initiated. Weighting Ledger's historical index higher. Discrepancy resolved.", confidence: 75, txHash: null });
        setActiveVerification(p => ({ ...p, confidence: 75 }));
      }, 6000));

    }, 12000)); // 2s + 10s

    // 3. Consensus Phase (3-4s)
    timers.push(setTimeout(() => {
      setActiveVerification(p => ({ ...p, state: "CONSENSUS_FORMING", confidence: 85 }));
      
      timers.push(setTimeout(() => {
        addLog({ agent: "Aletheia", actionType: "CONSENSUS", message: "Synthesizing final cryptographic evidence layer. Preparing payload for on-chain anchoring.", confidence: 92, txHash: null });
        setActiveVerification(p => ({ ...p, confidence: 92 }));
      }, 1500));

    }, 19000)); // 12s + 7s

    // 4. Finalized (Ready to Mint)
    timers.push(setTimeout(() => {
      setActiveVerification(p => ({
        ...p,
        state: "FINALIZED",
        confidence: 96.8,
        valueEstimate: "$1,450,000",
        evidenceHash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
        fraudRisk: 1.2
      }));
    }, 23000)); // 19s + 4s

    timeoutsRef.current = timers;
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
