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

  // Global background activity simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeVerification.state !== "IDLE" && activeVerification.state !== "FINALIZED") {
        const agentNames = Object.keys(AGENTS) as AgentName[];
        const randomAgent = agentNames[Math.floor(Math.random() * agentNames.length)];
        const newLog = generateMockLog(randomAgent, activeVerification.state);
        
        setGlobalLogs(prev => {
          const updated = [...prev, newLog];
          if (updated.length > 50) updated.shift();
          return updated;
        });

        // Simulate confidence oscillating upwards
        if (activeVerification.state === "SCANNING" || activeVerification.state === "DEBATING") {
          setActiveVerification(prev => ({
            ...prev,
            confidence: Math.min(99, prev.confidence + (Math.random() * 4 - 1)),
          }));
        }
      }
    }, 1500); // New log every 1.5s

    return () => clearInterval(interval);
  }, [activeVerification.state]);

  const startVerification = (assetId: string) => {
    setActiveVerification({
      id: assetId,
      state: "SCANNING",
      confidence: 10,
      fraudRisk: 0,
      valueEstimate: "",
    });
    setGlobalLogs([]);

    // Simulate State Machine
    setTimeout(() => setActiveVerification(p => ({ ...p, state: "DEBATING" })), 5000);
    setTimeout(() => setActiveVerification(p => ({ ...p, state: "CONSENSUS", confidence: 92, fraudRisk: 3, valueEstimate: "$1.2M" })), 12000);
    setTimeout(() => setActiveVerification(p => ({ ...p, state: "FINALIZED" })), 15000);
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
