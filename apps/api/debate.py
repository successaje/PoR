from agents import agents_registry
import random
import time
import asyncio

async def run_debate(asset_data: dict, emit_func):
    """
    Simulates the AI Debate Chamber using LangGraph-like state transitions.
    In this mock version for the hackathon, we yield updates.
    """
    await emit_func({"type": "status", "message": "Debate initialized.", "confidence": 50})
    await asyncio.sleep(1)

    # 1. Agents Investigate
    findings = {}
    for name, agent in agents_registry.items():
        await emit_func({"type": "action", "agent": name, "message": f"{name} is investigating..."})
        await asyncio.sleep(0.5)
        
        result = agent.analyze(asset_data)
        findings[name] = result
        await emit_func({"type": "finding", "agent": name, "message": result})
        await asyncio.sleep(1)

    # 2. Cross-Examination / Debate
    await emit_func({"type": "status", "message": "Cross-examination phase...", "confidence": 60})
    await asyncio.sleep(2)
    
    # Mocking a disagreement
    await emit_func({"type": "debate", "agent": "Prism", "message": "Atlas, the geo-coordinates match, but the timestamp on the imagery is 3 months old. Can we verify recent structural changes?"})
    await asyncio.sleep(2)
    await emit_func({"type": "debate", "agent": "Atlas", "message": "Cross-referencing with secondary drone data... Structural integrity remains consistent as of 2 days ago."})
    await asyncio.sleep(2)

    # 3. Consensus (Aletheia Engine)
    confidence = random.randint(82, 98)
    await emit_func({"type": "consensus", "message": "Aletheia has reached consensus.", "confidence": confidence})
    
    return {
        "status": "VERIFIED",
        "confidence": confidence,
        "fraud_probability": "LOW",
        "market_value_estimate": "$418,000",
        "yield_band": "8.1%-10.4%"
    }
