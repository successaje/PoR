import json
import random
import time
from typing import Dict, Any

class MockAgent:
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role

    def analyze(self, asset_data: Dict[str, Any]) -> str:
        # Simulate processing delay
        time.sleep(random.uniform(0.5, 1.5))
        
        # Mock responses based on agent
        if self.name == "Atlas":
            return "Satellite imagery confirms structural consistency. Geo-coordinates match registry."
        elif self.name == "Prism":
            prob = random.randint(5, 25)
            return f"Image metadata analysis complete. Potential manipulation probability: {prob}%. No major anomalies."
        elif self.name == "Oracle":
            diff = random.randint(-5, 15)
            return f"Comparable properties suggest valuation is {'overvalued' if diff > 0 else 'undervalued'} by {abs(diff)}%."
        elif self.name == "Ledger":
            return "Ownership records verified successfully. Title is clear of liens."
        elif self.name == "Pulse":
            return "Social sentiment in the area is positive. No major economic red flags nearby."
        elif self.name == "Tempest":
            return "Climate exposure is MODERATE. Minor flood risk detected based on historical data."
        elif self.name == "Sentinel":
            return "AML/KYC checks passed. Jurisdictional compliance verified."
        return "Analysis complete."

agents_registry = {
    "Atlas": MockAgent("Atlas", "Geo-spatial Intelligence Agent"),
    "Ledger": MockAgent("Ledger", "Registry & Ownership Agent"),
    "Prism": MockAgent("Prism", "Fraud Detection Agent"),
    "Oracle": MockAgent("Oracle", "Market Valuation Agent"),
    "Pulse": MockAgent("Pulse", "Social & Activity Intelligence Agent"),
    "Tempest": MockAgent("Tempest", "Climate & Environmental Risk Agent"),
    "Sentinel": MockAgent("Sentinel", "Compliance & Risk Agent"),
}
