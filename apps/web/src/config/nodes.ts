export type NodeId = "Atlas" | "Ledger" | "Prism" | "Oracle" | "Pulse" | "Tempest" | "Sentinel" | "Aegis";

export interface ProtocolNode {
  id: NodeId;
  role: string;
  description: string;
  tools: string[];
  reputationScore: number;
  activationState: "ACTIVE" | "STANDBY" | "OFFLINE";
  outputSchema: string;
  color: string;
  isMetaConsensus?: boolean;
}

export const PROTOCOL_NODES: Record<NodeId, ProtocolNode> = {
  Atlas: {
    id: "Atlas",
    role: "Geo-Spatial Intelligence",
    description: "Analyzes satellite imagery, topography, and physical coordinates.",
    tools: ["Satellite API", "Topography Map", "Address Geocoder"],
    reputationScore: 98.5,
    activationState: "ACTIVE",
    outputSchema: "{ lat: number, lng: number, physicalIntegrity: number }",
    color: "text-blue-400"
  },
  Ledger: {
    id: "Ledger",
    role: "Ownership & Legal",
    description: "Verifies chain of custody, title deeds, and legal liens.",
    tools: ["Title Registry", "On-chain History", "Notary DB"],
    reputationScore: 99.1,
    activationState: "ACTIVE",
    outputSchema: "{ ownerHash: string, clearTitle: boolean, liens: number }",
    color: "text-emerald-400"
  },
  Oracle: {
    id: "Oracle",
    role: "Market Valuation",
    description: "Synthesizes real-time market data to appraise asset value.",
    tools: ["Market Comparables", "Liquidity Index", "Appraisal Feed"],
    reputationScore: 94.2,
    activationState: "ACTIVE",
    outputSchema: "{ estimatedValue: number, confidence: number, volatility: string }",
    color: "text-amber-400"
  },
  Prism: {
    id: "Prism",
    role: "Fraud Detection",
    description: "Detects inconsistencies, metadata manipulation, and synthetic documentation.",
    tools: ["EXIF Analyzer", "Deepfake Detector", "Anomaly Scanner"],
    reputationScore: 97.8,
    activationState: "ACTIVE",
    outputSchema: "{ fraudProbability: number, anomaliesDetected: string[] }",
    color: "text-purple-400"
  },
  Pulse: {
    id: "Pulse",
    role: "Social & Activity Signals",
    description: "Monitors human activity, business operations, and public sentiment surrounding the asset.",
    tools: ["Social Graph", "Foot Traffic Analyzer", "Utility Usage"],
    reputationScore: 92.5,
    activationState: "ACTIVE",
    outputSchema: "{ activityIndex: number, sentimentScore: number }",
    color: "text-cyan-400"
  },
  Tempest: {
    id: "Tempest",
    role: "Climate Risk",
    description: "Evaluates environmental vulnerabilities like flood zones and extreme weather exposure.",
    tools: ["Weather Models", "Flood Plain Map", "Seismic DB"],
    reputationScore: 96.4,
    activationState: "ACTIVE",
    outputSchema: "{ riskLevel: string, recommendedInsurance: number }",
    color: "text-teal-400"
  },
  Sentinel: {
    id: "Sentinel",
    role: "Compliance & AML",
    description: "Ensures parties involved pass KYC/AML protocols and sanctions checks.",
    tools: ["KYC Provider", "Sanctions List", "AML Graph"],
    reputationScore: 99.8,
    activationState: "ACTIVE",
    outputSchema: "{ kycStatus: boolean, riskFlag: string }",
    color: "text-indigo-400"
  },
  Aegis: {
    id: "Aegis",
    role: "Meta-Consensus & Arbitration",
    description: "Final reasoning layer. Resolves contradictions between other agents and forms the ultimate truth synthesis.",
    tools: ["Logic Arbiter", "Contradiction Resolver", "Consensus Engine"],
    reputationScore: 100.0,
    activationState: "STANDBY", // Usually starts standby, activates last
    outputSchema: "{ finalConsensusScore: number, resolutionLog: string, evidenceHash: string }",
    color: "text-rose-400",
    isMetaConsensus: true
  }
};
