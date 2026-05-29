export type AgentName = "Atlas" | "Ledger" | "Prism" | "Oracle" | "Pulse" | "Tempest" | "Sentinel";

export type AgentLog = {
  id: string;
  agent: AgentName;
  actionType: "INVESTIGATING" | "DEBATING" | "COMPLETED" | "ANOMALY" | "SCANNING" | "CONSENSUS";
  message: string;
  confidence: number;
  timestamp: number;
};

export type VerificationState = "PENDING" | "AGENTS_ACTIVATING" | "DATA_COLLECTION" | "INDEPENDENT_ANALYSIS" | "DEBATE_PHASE" | "CONSENSUS_FORMING" | "FINALIZED" | "MINTED_ON_CHAIN" | "ARCHIVED";

export const AGENTS: Record<AgentName, { role: string; color: string }> = {
  Atlas: { role: "Geo-spatial Intelligence", color: "text-blue-400" },
  Ledger: { role: "Registry & Ownership", color: "text-emerald-400" },
  Prism: { role: "Fraud Detection", color: "text-purple-400" },
  Oracle: { role: "Market Valuation", color: "text-amber-400" },
  Pulse: { role: "Social Signals", color: "text-cyan-400" },
  Tempest: { role: "Climate Risk", color: "text-teal-400" },
  Sentinel: { role: "Compliance", color: "text-indigo-400" }
};

export const MOCK_ASSETS = [
  { id: "REG-8492-TX", address: "1440 Broadway, New York, NY", type: "Commercial", value: "$42M" },
  { id: "LGS-9921-VI", address: "Ikoyi Peninsula Plot 4A, Lagos", type: "Residential", value: "₦850M" },
  { id: "LDN-3341-EC", address: "Canary Wharf Block 2, London", type: "Commercial", value: "£18M" },
];

export const generateMockLog = (agent: AgentName, phase: VerificationState): AgentLog => {
  const confidence = 0.5 + Math.random() * 0.49; // 0.5 to 0.99
  let actionType: AgentLog["actionType"] = "INVESTIGATING";
  let message = "Initiating scan...";

  if (phase === "SCANNING") {
    const messages = [
      "Cross-referencing satellite timestamp data...",
      "Validating structural integrity from public records...",
      "Checking title deed against municipal database...",
      "Analyzing market comparables within 5km radius...",
      "Evaluating climate risk exposure index..."
    ];
    message = messages[Math.floor(Math.random() * messages.length)];
  } else if (phase === "DEBATING") {
    actionType = Math.random() > 0.7 ? "ANOMALY" : "DEBATING";
    const messages = [
      "Discrepancy found in valuation delta. Requesting re-check.",
      "Ownership records verified. No liens detected.",
      "Image metadata suggests minor manipulation on facade photos.",
      "Climate models show acceptable flood risk threshold.",
      "KYC cleared for all involved parties."
    ];
    message = messages[Math.floor(Math.random() * messages.length)];
  } else if (phase === "CONSENSUS") {
    actionType = "COMPLETED";
    message = "Agent consensus reached. Data locked.";
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    agent,
    actionType,
    message,
    confidence: Math.round(confidence * 100) / 100,
    timestamp: Date.now()
  };
};
