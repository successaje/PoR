# Changelog & Security Iteration Log

## Smart Contract Development History

All legacy contracts are kept on the Mantle Sepolia testnet for transparency and auditing purposes.

| Version | Contract | Address | Status |
| :--- | :--- | :--- | :--- |
| **v1** | `TruthCertificateNFT` | `0x6444f16e29bf33a8c9da2b89e472b58bafe41b9c` | ⚠️ **Deprecated** — Initial test, `onlyOwner` mint restriction. |
| **v2** | `TruthCertificateNFT` | `0xf673f508104876c72c8724728f81d50e01649b40` | ⚠️ **Deprecated** — Mint was permissionless, no consensus gate. |
| **v3** | `TruthCertificateNFT` | `0xfc527b71ebd1854a32967f44d314faf99b2ac333` | ✅ **Current** — Mint gated by `VerificationManager.resolvedAssets`. |
| **v1** | `VerificationManager` | `0x7cc324d15e5ff17c43188fb63b462b9a79da68f6` | ⚠️ **Deprecated** — Lacked signature threshold and agent weights. |
| **v2** | `VerificationManager` | `0x38509275f1da637c17790d50f6ad8b6f729759ff` | ✅ **Current** — Production Aletheia Engine consensus routing. |
| **v1** | `AgentRegistry` | `0x7dc16d44789283279b28c940359011f2649897da` | ⚠️ **Deprecated** — Basic mapping, no slashing logic. |
| **v2** | `AgentRegistry` | `0x49312b44f8a13b1ca33f76d08a7c8230b3e0d5e4` | ✅ **Current** — Stake-weighted registration. |
| **v1** | `PoRLendingVault` | `0x64d1ae5fa2eceb908a028bbdb4a4e2223bdefa47` | ✅ **Current** — Disburses USDY against `mETH` + NFT collateral. |
