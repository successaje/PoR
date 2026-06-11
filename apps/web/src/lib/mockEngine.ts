import { NodeId, PROTOCOL_NODES } from "../config/nodes";

export type AgentLog = {
  id: string;
  agent: NodeId;
  actionType: "INVESTIGATING" | "DEBATING" | "COMPLETED" | "ANOMALY" | "SCANNING" | "CONSENSUS" | "ARBITRATING" | "RESOLUTION";
  message: string;
  confidence: number;
  timestamp: number;
  txHash?: string | null;
};

export type VerificationState = "PENDING" | "AGENTS_ACTIVATING" | "DATA_COLLECTION" | "INDEPENDENT_ANALYSIS" | "DEBATE_PHASE" | "CONSENSUS_FORMING" | "FINALIZED" | "MINTED_ON_CHAIN" | "ARCHIVED";

// Export AGENTS for backwards compatibility in other components,
// though we encourage migrating to PROTOCOL_NODES directly.
export const AGENTS = PROTOCOL_NODES;

export const MOCK_ASSETS = [
  { id: "REG-8492-TX", address: "1440 Broadway, New York, NY", type: "Commercial", value: "$42M" },
  { id: "LGS-9921-VI", address: "Ikoyi Peninsula Plot 4A, Lagos", type: "Residential", value: "₦850M" },
  { id: "DBI-1029-WH", address: "Jafza Warehouse Zone C, Dubai", type: "Industrial", value: "AED 120M" },
  { id: "LDN-3341-EC", address: "Canary Wharf Block 2, London", type: "Commercial", value: "£18M" },
  { id: "TKY-5501-DC", address: "Shinjuku Data Center, Tokyo", type: "Infrastructure", value: "¥8.5B" },
  { id: "PAR-8820-HM", address: "Le Marais Boutique Hotel, Paris", type: "Hospitality", value: "€32M" },
  { id: "BER-2091-LH", address: "Brandenburg Logistics Hub, Berlin", type: "Industrial", value: "€45M" },
  { id: "SYD-4102-SF", address: "Outback Solar Farm, Sydney", type: "Energy", value: "$110M AUD" },
  { id: "MIA-7734-BC", address: "South Beach Condo, Miami", type: "Residential", value: "$12.5M" },
  { id: "SGP-9912-MR", address: "Marina Bay Retail Plaza, Singapore", type: "Commercial", value: "$280M SGD" },
  { id: "TOR-6621-HR", address: "King Street High-Rise, Toronto", type: "Residential", value: "$85M CAD" },
  { id: "ATX-3310-TC", address: "Domain Tech Campus, Austin", type: "Commercial", value: "$155M" },
];

export const generateMockLog = (agent: NodeId, phase: VerificationState): AgentLog => {
  const confidence = 0.5 + Math.random() * 0.49; // 0.5 to 0.99
  let actionType: AgentLog["actionType"] = "INVESTIGATING";
  let message = "Initiating scan...";

  if (agent === "Aegis") {
    // Special logic for the meta-consensus node
    if (phase === "CONSENSUS_FORMING") {
      actionType = "ARBITRATING";
      const messages = [
        "Analyzing contradictions between Oracle and Prism...",
        "Resolving valuation anomaly based on Ledger data...",
        "Synthesizing final meta-consensus...",
        "Calculating final probability distribution..."
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (phase === "FINALIZED") {
      actionType = "CONSENSUS";
      message = "Ultimate truth synthesis locked and ready for on-chain anchoring.";
    } else {
      actionType = "INVESTIGATING";
      message = "Monitoring sub-node telemetry...";
    }
  } else {
    // Logic for the 7 investigation nodes
    if (phase === "DATA_COLLECTION") {
      actionType = "SCANNING";
      const messages = [
        "Cross-referencing external data points...",
        "Validating structural integrity...",
        "Checking databases...",
        "Analyzing comparables...",
        "Evaluating risk exposure..."
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (phase === "DEBATE_PHASE" || phase === "INDEPENDENT_ANALYSIS") {
      actionType = Math.random() > 0.7 ? "ANOMALY" : "DEBATING";
      const messages = [
        "Discrepancy found. Requesting re-check.",
        "Records verified. No immediate issues detected.",
        "Data suggests minor deviation from baseline.",
        "Models show acceptable threshold.",
        "Cleared for standard processing."
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (phase === "CONSENSUS_FORMING") {
      actionType = "COMPLETED";
      message = "Node analysis submitted to Aegis for arbitration.";
    }
  }

  return {
    id: Math.random().toString(36).substring(2, 11),
    agent,
    actionType,
    message,
    confidence: Math.round(confidence * 100) / 100,
    timestamp: Date.now()
  };
};
