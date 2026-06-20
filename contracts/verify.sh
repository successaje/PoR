#!/bin/bash

# Proof-of-Reality Contract Verification Script for Mantle Sepolia
# Note: Mantle Sepolia's Blockscout API may sometimes return 503 errors during high traffic.
# If verification fails, wait a few minutes and try again.

echo "Verifying AgentRegistry..."
forge verify-contract 0x49312b44f8a13b1ca33f76d08a7c8230b3e0d5e4 AgentRegistry \
  --chain 5003 \
  --verifier blockscout \
  --verifier-url https://explorer.sepolia.mantle.xyz/api

echo "Verifying VerificationManager..."
forge verify-contract 0x38509275f1da637c17790d50f6ad8b6f729759ff VerificationManager \
  --chain 5003 \
  --verifier blockscout \
  --verifier-url https://explorer.sepolia.mantle.xyz/api

echo "Verifying TruthCertificateNFT..."
forge verify-contract 0xfc527b71ebd1854a32967f44d314faf99b2ac333 TruthCertificateNFT \
  --chain 5003 \
  --verifier blockscout \
  --verifier-url https://explorer.sepolia.mantle.xyz/api

echo "Verifying PoRLendingVault..."
forge verify-contract 0x64d1ae5fa2eceb908a028bbdb4a4e2223bdefa47 PoRLendingVault \
  --chain 5003 \
  --verifier blockscout \
  --verifier-url https://explorer.sepolia.mantle.xyz/api

echo "Verification complete."
