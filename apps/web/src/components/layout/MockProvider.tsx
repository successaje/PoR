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
      const scanMessages = [
        "Acquiring satellite imagery and extracting geolocation metadata...",
        "Querying local municipal databases for ownership records...",
        "Scanning global sanctions list and OFAC registries...",
        "Ingesting recent market comparables from area APIs...",
        "Evaluating historical transaction graph for anomalies..."
      ];
      const scanAgents = ["Atlas", "Oracle", "Sentinel", "Prism", "Ledger"];
      
      for (let i = 0; i < 5; i++) {
        // Vary confirmation times randomly between 500ms and 9500ms
        const delay = 500 + Math.random() * 9000;
        timers.push(setTimeout(() => {
          addLog({
            agent: scanAgents[i],
            actionType: "SCANNING",
            message: scanMessages[i],
            confidence: 35 + (i * 5),
            txHash: null
          });
          setActiveVerification(p => ({ ...p, confidence: p.confidence + Math.random() * 5 }));
        }, delay));
      }
    }, 2000));

    // 2. Debate Phase (5-8s, we'll use 7s)
    timers.push(setTimeout(() => {
      setActiveVerification(p => ({ ...p, state: "DEBATE_PHASE", confidence: 65 }));
      
      timers.push(setTimeout(() => {
        addLog({ agent: "Prism", actionType: "DEBATING", message: "CRITICAL: Document metadata anomaly detected in EXIF timestamps. Dates do not align with municipal claims.", confidence: 60, txHash: null });
      }, 1000));
      
      timers.push(setTimeout(() => {
        addLog({ agent: "Aegis", actionType: "ARBITRATING", message: "Aegis requests re-evaluation. Oracle, verify KYC metadata against Ledger's historical index.", confidence: 62, txHash: null });
      }, 2500));

      timers.push(setTimeout(() => {
        addLog({ agent: "Oracle", actionType: "SCANNING", message: "Re-evaluating... KYC provider confirms secondary shell company associated with title deed. Prism is correct.", confidence: 68, txHash: null });
      }, 4000));
      
      timers.push(setTimeout(() => {
        addLog({ agent: "Ledger", actionType: "DEBATING", message: "On-chain transaction graph verifies shell company linkage. Anomalous behavior confirmed.", confidence: 72, txHash: null });
      }, 5500));

      timers.push(setTimeout(() => {
        addLog({ agent: "Aegis", actionType: "RESOLUTION", message: "Conflict resolved. Fraud risk elevated but within acceptable threshold. Adjusting final truth score.", confidence: 75, txHash: null });
        setActiveVerification(p => ({ ...p, confidence: 75 }));
      }, 7000));

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
