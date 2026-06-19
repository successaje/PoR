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
