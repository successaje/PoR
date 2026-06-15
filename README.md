# The Trust Layer for Real-World Assets

Proof-of-Reality (PoR) transforms real-world facts into on-chain truth.

By combining decentralized AI consensus, cryptographic evidence anchoring, and Mantle's low-cost execution layer, PoR creates verifiable Truth Certificates for tokenized assets.

Built for the Mantle Turing Test Hackathon 2026.

---

## 🎥 Demo

Judges shouldn't have to hunt for links. Everything you need is right here:

- **Live Application:** [https://porprotocol.vercel.app/](https://porprotocol.vercel.app/)
- **Video Walkthrough:** [https://youtu.be/OhFwDF2jgYA](https://youtu.be/OhFwDF2jgYA)
- **Pitch Deck:** [Deck Link Pending]
- **GitHub Repository:** [https://github.com/successaje/PoR](https://github.com/successaje/PoR)

### Deployed Contracts (Mantle Sepolia)
*Fully secured via Role-Based Access Control (RBAC).*

- **VerificationManager:** [`0x34d156d6c062804771652b48f2d65d58d3794113`](https://sepolia.mantlescan.xyz/address/0x34d156d6c062804771652b48f2d65d58d3794113)
- **TruthCertificateNFT:** [`0x86C41594e9aDeCcf8c85ba9EEe0138C7c9E70dBc`](https://sepolia.mantlescan.xyz/address/0x86C41594e9aDeCcf8c85ba9EEe0138C7c9E70dBc)
- **AgentRegistry:** *(Available upon governance vote)*

---

## 🚨 The RWA Verification Crisis

The tokenization of Real-World Assets is scaling rapidly, but the foundation of this ecosystem is fundamentally broken:

1. **RWAs rely on blind trust, not math:** When a token claims to represent a $10M commercial building, the blockchain has no way to verify if that building actually exists, has a clean title, or isn't underwater.
2. **Centralized Oracles are fragile:** Traditional oracles pull from single Web2 APIs. They verify *data*, but they do not verify *reality*.
3. **AI lacks consensus:** A single LLM hallucinates and carries bias. You cannot trust a single AI model with millions of dollars in DeFi liquidity.

---

## 📈 Market Opportunity

The tokenized RWA market is projected to exceed **$16 trillion by 2030**.

Every tokenized asset requires:
- Verification
- Compliance
- Monitoring
- Reverification

Proof-of-Reality is positioned as the trust infrastructure powering this entire ecosystem.

---

## ⚡ The Solution: Forced Structured Disagreement

Proof-of-Reality (PoR) introduces a paradigm shift in decentralized verification. Instead of relying on a single data feed or a single LLM, PoR routes raw asset data (satellite imagery, deeds, market sentiment) through the **Aletheia Consensus Engine**.

1. **Parallel Verification:** 7 specialized AI agents analyze the asset concurrently.
2. **The Debate Chamber:** If the Legal agent confirms a deed, but the Fraud agent detects metadata tampering, the protocol does not average the score. It forces the agents into a **dynamic, multi-turn cross-examination** to resolve the contradiction.
3. **Cryptographic Finality:** Once consensus is mathematically reached, the outcome is compressed into an immutable `evidenceHash` and minted as a Truth Certificate on Mantle.

---

## 🤖 AI × RWA Integration

PoR uses AI as a core infrastructure layer. AI is not a chatbot here; **AI is the verification engine.**

AI drives:
- Asset valuation
- Fraud detection
- Legal verification
- Compliance checks
- Climate risk assessment
- Market intelligence

---

## 🛡️ Compliance Framework

The **Sentinel Agent** is dedicated entirely to regulatory and legal safety. It performs:
- KYC verification
- AML screening
- Sanctions monitoring
- Jurisdiction analysis
- Regulatory risk scoring

Compliance findings directly impact consensus outcomes. If Sentinel flags a sanctions violation, the asset cannot be tokenized.

---

## 🔄 Verification Flow

1. **Asset Submitted:** User uploads deeds, coordinates, and metadata.
2. **Verification Case Created:** The `VerificationManager` smart contract opens a case.
3. **AI Agents Investigate:** LangGraph spins up 7 specialized agents.
4. **Debate Chamber Activated:** Conflicting data triggers cross-examination.
5. **Consensus Generated:** A mathematical Truth Score is calculated.
6. **Evidence Hashed:** The debate log is compressed into a SHA-256 hash.
7. **Truth Certificate Minted:** The `TruthCertificateNFT` is minted on Mantle.
8. **Asset Becomes DeFi Ready:** Lending protocols can now confidently accept the asset.

---

## 🏛️ System Architecture

### 1. The Intelligence Layer (LangGraph)
The Python backend is powered by LangChain and LangGraph. It orchestrates a recursive state machine of specialized intelligence.

| Agent | Domain | Function |
|-------|--------|----------|
| **Atlas** | Geo-Spatial | Analyzes physical boundaries and structural integrity. |
| **Ledger** | Legal/Title | Verifies deeds, ownership history, and active liens. |
| **Oracle** | Financial | Pulls comparable sales and projects market valuation. |
| **Prism** | Fraud | Scans document metadata for cryptographic forgery. |
| **Pulse** | Social | Analyzes neighborhood momentum and economic velocity. |
| **Tempest**| Climate | Models environmental hazards (flood, wildfire) for the asset. |
| **Sentinel**| Compliance | Checks OFAC sanctions and jurisdictional compliance. |

### 2. The Cryptoeconomic Layer (Mantle Network)
Storing raw satellite images or sensitive legal documents directly on a blockchain is an architectural anti-pattern—it incurs astronomical gas costs and violates data privacy laws (GDPR). 

Instead, PoR uses a hybrid **Hash-and-Anchor** architecture:
- The heavy AI debate transcripts and sensitive RWA metadata are kept off-chain.
- The protocol hashes the final state into a `SHA-256 evidenceHash` and anchors it to the Mantle Network.

---

## ⛓️ Why Mantle?

PoR is not chain-agnostic. The protocol was designed specifically around Mantle's strengths:

- **Low-cost on-chain verification updates:** Allowing frequent reverification.
- **RWA ecosystem alignment:** Mantle has a strong focus on institutional RWAs.
- **Institutional liquidity focus:** DeFi protocols on Mantle need reliable collateral.
- **Future MNT staking for node operators:** Aligning network security with the native token.
- **High-frequency truth score refreshes:** Required for dynamic reality tracking.

Mantle enables a verification layer that would be economically impractical on higher-cost networks.

---

## 💰 Business Model

Proof-of-Reality operates as **Verification-as-a-Service**.

**Customers:**
- RWA Tokenization Platforms
- DeFi Lending Protocols
- Insurance Providers
- Asset Managers
- Institutional Investors

**Revenue Streams:**
- Verification Fees
- Subscription APIs
- Compliance Verification
- Risk Monitoring Services
- Truth Certificate Issuance

As RWA adoption grows, verification becomes mandatory infrastructure.

---

## ⏳ Dynamic Truth Decay

Reality changes. A building can burn down; markets can crash. 
PoR implements a `decayTimer` mechanism in the smart contracts:
- The on-chain consensus score **decays over time**.
- When the score drops below a DeFi protocol's threshold, it triggers an automated **re-verification**.
- This enforces continuous trust, ensuring the Truth Certificate always reflects current reality.

---

## 🌎 Long-Term Vision

Proof-of-Reality aims to become the decentralized trust layer for tokenized assets.

Future milestones:
- Permissionless Node Network
- MNT Staking
- Slashing Mechanisms
- Cross-Chain Verification
- Institutional APIs
- AI Validator Marketplace

Our goal is simple: **Make truth a verifiable on-chain primitive.**

---

## 📸 Product Screenshots

### Landing Page
![Landing Page](https://github.com/successaje/PoR/apps/web/public/landing_page.png)

### Verification Dashboard
![Verification Dashboard](https://github.com/successaje/PoR/apps/web/public/verification_dashboard.png)

### Debate Chamber
![Debate Chamber](https://github.com/successaje/PoR/apps/web/public/debate_chamber.png)

### Truth Certificate
![Truth Certificate](https://github.com/successaje/PoR/apps/web/public/truth_certificate.png)

### Node Operator Portal
![Node Operator Portal](https://github.com/successaje/PoR/apps/web/public/node_portal.png)

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 16, React 19, TailwindCSS v4, Framer Motion, Wagmi, Viem.
- **Backend (AI Engine):** Python, FastAPI, LangGraph, LangChain, OpenAI (`gpt-4o-mini`).
- **Smart Contracts:** Solidity `^0.8.24`, Foundry, OpenZeppelin AccessControl, Mantle Sepolia.

---

## 🚀 Running Locally

### 1. The AI Backend
```bash
cd apps/api
# Add your OPENAI_API_KEY to .env
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. The Mission Control UI
```bash
cd apps/web
pnpm install
pnpm run dev
```
Navigate to `http://localhost:3000/verify` to initialize the consensus engine.
