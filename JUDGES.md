# 🏆 Judge's Quick-Start Guide (Mantle Turing Test Hackathon)

Welcome! We know you have dozens of projects to review. This guide gives you the 5-minute TL;DR and the exact steps to test the **Proof-of-Reality (PoR)** protocol.

## ⚡ The 15-Second TL;DR

**Proof-of-Reality (PoR)** is an AI-powered Reality Oracle built exclusively on Mantle. 

It solves the massive "Garbage In, Garbage Out" problem for Real-World Assets (RWAs). Instead of trusting a single oracle feed or a single LLM (which hallucinates), PoR spins up **7 specialized AI agents**. These agents ingest independent data (OpenStreetMap, OFAC Sanctions, etc.), debate contradictions in a live cross-examination chamber, and calculate a strict mathematical consensus.

The final Reality Score is hashed and minted as a `TruthCertificateNFT` on Mantle Sepolia, enabling DeFi protocols to automatically approve/liquidate RWA loans based on the AI's on-chain verdict.

---

## 🔗 Quick Links
- **Live Application:** [https://porprotocol.vercel.app/](https://porprotocol.vercel.app/)
- **Video Walkthrough:** [https://youtu.be/OhFwDF2jgYA](https://youtu.be/OhFwDF2jgYA)
- **GitHub Repository:** [https://github.com/successaje/PoR](https://github.com/successaje/PoR)
- **X (Twitter):** [https://x.com/porprotocol?s=11](https://x.com/porprotocol?s=11)

---

## 🚀 Run the Live Demo in 3 Minutes

1. **Open the Live App:** Go to [https://porprotocol.vercel.app/](https://porprotocol.vercel.app/)
2. **Navigate to the Verify Page:** Click "Launch App" or navigate to `/verify`.
3. **Submit an Asset:** Fill out the mock property details and click **"Initialize Aletheia Engine"**.
4. **Watch the Debate:** You will see a live Server-Sent Events (SSE) stream of our Python LangGraph agents investigating and debating the asset in real-time.
5. **View the Truth Certificate:** Once consensus is reached, the UI will display the minted Truth Certificate parameters.

### Want to see "Dynamic Truth Decay" in action?
Real-world assets change (buildings burn down, floods happen). Our smart contracts enforce continuous re-verification using a `decayTimer`. 
*Note: Watch our demo video to see a live demonstration of a Truth Certificate decaying and triggering a re-verification!*

---

## ⛓️ Deployed Contracts (Mantle Sepolia)

All core protocol architecture is live on Mantle Sepolia and secured via OpenZeppelin Role-Based Access Control (RBAC).

| Contract | Address | Purpose |
|----------|---------|---------|
| **AgentRegistry** | [`0xfF026fC25E1c2E7A70F3A6a0Bc14993Df3DA1d8B`](https://sepolia.mantlescan.xyz/address/0xfF026fC25E1c2E7A70F3A6a0Bc14993Df3DA1d8B) | Tracks active Node Operators and AI Agent reputation. |
| **VerificationManager** | [`0x5467EB13A408C48EB02811E92968F6e2A2556040`](https://sepolia.mantlescan.xyz/address/0x5467EB13A408C48EB02811E92968F6e2A2556040) | Entry point. Creates on-chain cases triggering the AI agents. |
| **TruthCertificateNFT** | [`0x47f4917805C577a168d411b4531F2A49fBeF311e`](https://sepolia.mantlescan.xyz/address/0x47f4917805C577a168d411b4531F2A49fBeF311e) | Stores the `evidenceHash`, `consensusScore`, and `decayTimer`. |

---

## 🛡️ Epistemic Independence (We don't just prompt an LLM)

To ensure the AI Debate Chamber isn't just one model talking to itself, our agents are equipped with real Python tools that pull from diverse Web2 data sources before generating a verdict:

- **Atlas (Geo Agent):** Queries the live OpenStreetMap Nominatim API for bounding boxes.
- **Sentinel (Compliance):** Directly streams the US Treasury's live OFAC SDN Sanctions list.

### 🔍 Auditable Reasoning
We use **LangSmith** to trace the entire reasoning chain of the AI consensus engine. It's not just a black box—every deduction is recorded, auditable, and hashed on-chain.

---

Thank you for reviewing Proof-of-Reality!
