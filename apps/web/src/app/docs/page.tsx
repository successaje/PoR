import { motion } from "framer-motion";
import Link from "next/link";
import TextScramble from "@/components/ui/TextScramble";

export default function DocsPage() {
  return (
    <div className="min-h-full font-sans text-white bg-[#000000] p-8 md:p-16">
      
      <div className="max-w-5xl mx-auto mb-16 border-b border-white/[0.04] pb-8">
        <h1 className="text-4xl font-light tracking-tight text-white/90 mb-4">Developer API</h1>
        <p className="font-mono text-[12px] text-white/40 tracking-[0.2em] uppercase max-w-2xl leading-relaxed">
          Integrate the Proof-of-Reality (PoR) Protocol directly into your platform. Programmatically submit assets for verification and subscribe to real-time decentralized consensus streams.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Endpoint 1: Submit Asset */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] tracking-widest uppercase border border-emerald-500/20">POST</span>
                <span className="font-mono text-lg text-white/90">/submit</span>
              </div>
              <p className="text-sm text-white/50 font-light">Ingest physical assets and begin the autonomous verification pipeline.</p>
            </div>
          </div>
          
          <div className="bg-[#050505] border border-white/10 p-6 font-mono text-sm">
            <div className="text-white/30 text-[10px] tracking-widest uppercase mb-4 border-b border-white/[0.04] pb-2">Request Format (multipart/form-data)</div>
            <pre className="text-white/70 overflow-x-auto">
{`curl -X POST https://api.proofofreality.network/submit \\
  -F "files=@/path/to/property_deed.pdf" \\
  -F "files=@/path/to/facade_photo.jpg" \\
  -F "asset_id=req_9a8b7c6d5e" \\
  -F 'metadata={
    "jurisdiction": "UK",
    "assetCategories": ["Real Estate", "Commercial"],
    "declared_value_usd": 15000000,
    "coords": {"lat": 51.5072, "lng": -0.1276},
    "owner_wallet": "0xYourWalletAddress"
  }'`}
            </pre>
          </div>
          
          <div className="bg-black border border-white/5 p-6 font-mono text-sm">
            <div className="text-white/30 text-[10px] tracking-widest uppercase mb-4 border-b border-white/[0.04] pb-2">Response (200 OK)</div>
            <pre className="text-emerald-400/80 overflow-x-auto">
{`{
  "status": "accepted",
  "asset_id": "req_9a8b7c6d5e",
  "stream_url": "/stream/req_9a8b7c6d5e",
  "message": "Files securely uploaded. Consensus engine initiated."
}`}
            </pre>
          </div>
        </div>

        {/* Endpoint 2: Stream Consensus */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 font-mono text-[10px] tracking-widest uppercase border border-cyan-500/20">GET</span>
                <span className="font-mono text-lg text-white/90">/stream/{"{asset_id}"}</span>
              </div>
              <p className="text-sm text-white/50 font-light">Subscribe to Server-Sent Events (SSE) to receive real-time node debate telemetry.</p>
            </div>
          </div>
          
          <div className="bg-[#050505] border border-white/10 p-6 font-mono text-sm">
            <div className="text-white/30 text-[10px] tracking-widest uppercase mb-4 border-b border-white/[0.04] pb-2">Event Stream Output</div>
            <pre className="text-cyan-400/80 overflow-x-auto">
{`data: {"type": "status", "agent": "System", "message": "LangGraph orchestrated. Agents spinning up..."}

data: {"type": "finding", "agent": "Ledger", "message": "Cross-referencing title deed with Mantle historical transactions."}

data: {"type": "finding", "agent": "Tempest", "message": "Analyzing flood zone exposure at provided coordinates."}

data: {"type": "resolution", "agent": "Aegis", "message": "Meta-consensus achieved. Truth Score: 96.4%. Proceeding to mint."}

data: {"type": "done", "agent": "System", "message": "Process terminated."}`}
            </pre>
          </div>
        </div>

        {/* Smart Contract Interaction */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-amber-500/10 text-amber-400 font-mono text-[10px] tracking-widest uppercase border border-amber-500/20">ON-CHAIN</span>
                <span className="font-mono text-lg text-white/90">VerificationManager.sol</span>
              </div>
              <p className="text-sm text-white/50 font-light">Smart contract deployed on Mantle Sepolia for immutable truth anchoring.</p>
            </div>
          </div>
          
          <div className="bg-[#050505] border border-white/10 p-6 font-mono text-sm">
            <div className="text-white/30 text-[10px] tracking-widest uppercase mb-4 border-b border-white/[0.04] pb-2">Solidity Interface</div>
            <pre className="text-amber-400/80 overflow-x-auto">
{`interface IVerificationManager {
    enum CaseStatus { Open, InProgress, Resolved, Closed }

    struct Case {
        uint256 id;
        string description;
        CaseStatus status;
        string result;
        uint256[] assignedAgentIds;
    }

    function createCase(string memory _description) external returns (uint256);
    function assignAgent(uint256 _caseId, uint256 _agentId) external;
    function resolveCase(uint256 _caseId, string memory _result) external;
}`}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
