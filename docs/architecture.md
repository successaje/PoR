# System Architecture

## The Core System Architecture

1. **Reality Submission Layer**: Accepts user submissions (Real estate property title, coordinates, ownership docs, images).
2. **Multi-Agent Verification Layer**: LangGraph-based AI agents acting as independent nodes analyzing the submission.
3. **Debate Chamber**: Cyclic graph where agents challenge each other and refine truth.
4. **Consensus Engine (Aletheia)**: Determines final truth score based on agent confidence and reputation.
5. **Smart Contracts (Mantle)**: Mints a Truth Certificate NFT with dynamic decay (ERC-8004 inspired).
