"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AgentLog, VerificationState, generateMockLog, AgentName, AGENTS } from "@/lib/mockEngine";

interface MockContextProps {
  globalLogs: AgentLog[];
  activeVerification: {
    id: string | null;
    state: VerificationState;
    confidence: number;
    fraudRisk: number;
    valueEstimate: string;
  };
  startVerification: (assetId: string) => void;
}

const MockContext = createContext<MockContextProps | undefined>(undefined);

export function MockProvider({ children }: { children: ReactNode }) {
  const [globalLogs, setGlobalLogs] = useState<AgentLog[]>([]);
  const [activeVerification, setActiveVerification] = useState<MockContextProps["activeVerification"]>({
    id: null,
    state: "IDLE",
    confidence: 0,
    fraudRisk: 0,
    valueEstimate: "",
  });

  // No more mock interval! State is driven purely by the API stream.
  const startVerification = (assetId: string) => {
    setActiveVerification({
      id: assetId,
      state: "SCANNING",
      confidence: 10,
      fraudRisk: 0,
      valueEstimate: "",
    });
    setGlobalLogs([]);

    const eventSource = new EventSource(`http://localhost:8000/stream/${assetId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "done") {
        eventSource.close();
        setActiveVerification(p => ({ ...p, state: "FINALIZED" }));
        return;
      }

      if (data.type === "finding" || data.type === "debate" || data.type === "status") {
        const newLog: AgentLog = {
          id: Math.random().toString(),
          timestamp: new Date().toISOString(),
          agent: (data.agent || "Aletheia") as AgentName,
          actionType: data.type === "finding" ? "SCANNING" : data.type === "debate" ? "DEBATING" : "CONSENSUS",
          message: data.message,
          confidence: data.confidence || 50,
          txHash: null
        };
        
        setGlobalLogs(prev => {
          const updated = [...prev, newLog];
          if (updated.length > 50) updated.shift();
          return updated;
        });

        if (data.type === "status") {
           setActiveVerification(p => ({ 
             ...p, 
             state: data.message.includes("Debate") ? "DEBATING" : "SCANNING",
             confidence: data.confidence || p.confidence
           }));
        }
      }

      if (data.type === "consensus") {
        setActiveVerification(p => ({ ...p, state: "CONSENSUS", confidence: data.confidence || p.confidence }));
      }

      if (data.type === "final_result") {
        setActiveVerification(p => ({
          ...p,
          confidence: data.data.confidence,
          valueEstimate: data.data.market_value_estimate
        }));
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
      setActiveVerification(p => ({ ...p, state: "FINALIZED" }));
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
