#!/bin/bash
# scripts/trigger_decay.sh
# Demonstrates "Dynamic Truth Decay" for the Mantle Turing Test Hackathon Demo

# Replace with the actual deployed NFT address
CONTRACT_ADDRESS="0x86C41594e9aDeCcf8c85ba9EEe0138C7c9E70dBc"

# The Token ID you just minted in the demo (e.g. 0, 1, 2)
TOKEN_ID=${1:-0} 

echo "🔥 Initiating Dynamic Truth Decay for Token ID $TOKEN_ID..."
echo "Simulating real-world event (e.g., Flood / Fire / Market Crash) that invalidates the current Reality Score."
echo ""

# Make sure you have your private key exported in your terminal for the demo
if [ -z "$PRIVATE_KEY" ]; then
    echo "⚠️ Warning: PRIVATE_KEY environment variable not set."
    echo "Export your private key to run the transaction: export PRIVATE_KEY=0x..."
    exit 1
fi

echo "Calling applyTruthDecay($TOKEN_ID) on Mantle Sepolia..."

cast send $CONTRACT_ADDRESS "applyTruthDecay(uint256)" $TOKEN_ID \
  --rpc-url https://rpc.sepolia.mantle.xyz \
  --private-key $PRIVATE_KEY

echo "✅ Truth Decay applied successfully!"
echo "The Reality Score on-chain has been reduced. DeFi lending protocols will now automatically reject this collateral until re-verification is completed."
