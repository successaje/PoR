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
    
    if (initialTxHash) {
      timers.push(setTimeout(() => {
        addLog({
          agent: "Aegis",
          actionType: "SCANNING",
          message: "Verification request intercepted from VerificationManager contract.",
          confidence: 15,
          txHash: initialTxHash
        });
      }, 500));
    }

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
            agent: scanAgents[i] as keyof typeof AGENTS,
            actionType: "SCANNING",
            message: scanMessages[i],
            confidence: 35 + (i * 5),
            txHash: generateMockHash()
          });
          setActiveVerification(p => ({ ...p, confidence: p.confidence + Math.random() * 5 }));
        }, delay));
      }
    }, 2000));

    // 2. Debate Phase (expanded for cinematic effect)
    timers.push(setTimeout(() => {
      setActiveVerification(p => ({ ...p, state: "DEBATE_PHASE", confidence: 55 }));
      
      timers.push(setTimeout(() => {
        addLog({ agent: "Prism", actionType: "DEBATING", message: "FLAG: Potential inconsistency detected in submitted document metadata. EXIF timestamps conflict with stated acquisition date.", confidence: 52, txHash: generateMockHash() });
      }, 1000));
      
      timers.push(setTimeout(() => {
        addLog({ agent: "Ledger", actionType: "DEBATING", message: "COUNTER: On-chain financial history and fiat ownership transfer records are 100% valid and verified. Ownership holds.", confidence: 58, txHash: generateMockHash() });
      }, 3000));

      timers.push(setTimeout(() => {
        addLog({ agent: "Oracle", actionType: "SCANNING", message: "Cross-referencing legal precedent for title mismatch...", confidence: 55, txHash: generateMockHash() });
      }, 5000));
      
      timers.push(setTimeout(() => {
        addLog({ agent: "Pulse", actionType: "DEBATING", message: "Market comparables align with Ledger's valuation. The Prism anomaly may merely be clerical.", confidence: 60, txHash: generateMockHash() });
      }, 7000));

      timers.push(setTimeout(() => {
        addLog({ agent: "Tempest", actionType: "DEBATING", message: "Risk factor elevated. Structural integrity of claim requires arbitration before moving to consensus.", confidence: 58, txHash: generateMockHash() });
      }, 9000));

      timers.push(setTimeout(() => {
        addLog({ agent: "Aegis", actionType: "ARBITRATING", message: "CONFLICT DETECTED. These contradictions will not be ignored. Forcing structured disagreement protocol.", confidence: 62, txHash: generateMockHash() });
      }, 11000));

      timers.push(setTimeout(() => {
        addLog({ agent: "Sentinel", actionType: "SCANNING", message: "Retrieving historical deed records from 2018 for comparison...", confidence: 65, txHash: generateMockHash() });
      }, 13000));

      timers.push(setTimeout(() => {
        addLog({ agent: "Prism", actionType: "DEBATING", message: "Updating finding based on Sentinel data: The 2018 deed contains the same metadata pattern. It is indeed a clerical error spanning multiple years.", confidence: 68, txHash: generateMockHash() });
      }, 15500));

      timers.push(setTimeout(() => {
        addLog({ agent: "Aegis", actionType: "RESOLUTION", message: "Re-evaluating all findings. Document anomaly isolated as clerical error. Ownership validity confirmed by Ledger.", confidence: 75, txHash: generateMockHash() });
        setActiveVerification(p => ({ ...p, confidence: 75 }));
      }, 18000));

    }, 12000)); // 2s + 10s

    // 3. Consensus Phase
    timers.push(setTimeout(() => {
      setActiveVerification(p => ({ ...p, state: "CONSENSUS_FORMING", confidence: 85 }));
      
      timers.push(setTimeout(() => {
        addLog({ agent: "Aegis", actionType: "CONSENSUS", message: "Synthesizing final cryptographic evidence layer. Preparing payload for on-chain anchoring.", confidence: 92, txHash: generateMockHash() });
        setActiveVerification(p => ({ ...p, confidence: 92 }));
      }, 1500));

    }, 31000)); // 12s + 19s (18s debate + 1s buffer)

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
    }, 35000)); // 31s + 4s

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
