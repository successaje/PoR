from langgraph.graph import StateGraph, START, END
from state import AssetVerificationState
from nodes import (
    analyze_geo, analyze_financial, analyze_legal, 
    analyze_fraud, analyze_sentiment, analyze_climate, analyze_compliance,
    synthesize_consensus, run_debate_round
)
import asyncio
import json
import hashlib

def route_debate(state: AssetVerificationState):
    """Conditional Edge router"""
    if state.get("anomalies_detected") and state.get("debate_round", 0) < 2:
        return "debate_chamber"
    return END

def build_graph():
    """Builds the LangGraph PoR Protocol Pipeline"""
    workflow = StateGraph(AssetVerificationState)

    # Add Nodes
    workflow.add_node("geo_agent", analyze_geo)
    workflow.add_node("financial_agent", analyze_financial)
    workflow.add_node("legal_agent", analyze_legal)
    workflow.add_node("fraud_agent", analyze_fraud)
    workflow.add_node("sentiment_agent", analyze_sentiment)
    workflow.add_node("climate_agent", analyze_climate)
    workflow.add_node("compliance_agent", analyze_compliance)
    workflow.add_node("consensus", synthesize_consensus)
    workflow.add_node("debate_chamber", run_debate_round)

    # Add Edges
    # Parallel execution from START
    workflow.add_edge(START, "geo_agent")
    workflow.add_edge(START, "financial_agent")
    workflow.add_edge(START, "legal_agent")
    workflow.add_edge(START, "fraud_agent")
    workflow.add_edge(START, "sentiment_agent")
    workflow.add_edge(START, "climate_agent")
    workflow.add_edge(START, "compliance_agent")

    # All parallel nodes feed into consensus
    workflow.add_edge("geo_agent", "consensus")
    workflow.add_edge("financial_agent", "consensus")
    workflow.add_edge("legal_agent", "consensus")
    workflow.add_edge("fraud_agent", "consensus")
    workflow.add_edge("sentiment_agent", "consensus")
    workflow.add_edge("climate_agent", "consensus")
    workflow.add_edge("compliance_agent", "consensus")

    # Consensus conditionally routes to Debate or END
    workflow.add_conditional_edges(
        "consensus",
        route_debate,
        {
            "debate_chamber": "debate_chamber",
            END: END
        }
    )
    
    # Debate chamber feeds back to consensus
    workflow.add_edge("debate_chamber", "consensus")

    return workflow.compile()

graph = build_graph()

# We keep this helper function compatible with main.py's generator signature
async def run_debate(asset_data: dict, emit_func):
    """
    Executes the LangGraph pipeline and maps astream_events to SSE payloads.
    """
    initial_state = {
        "asset_id": asset_data.get("asset_id", "UNKNOWN"),
        "asset_context": {
            "registry_id": asset_data.get("asset_id"),
            "property_type": asset_data.get("type", "Commercial Real Estate"),
            "jurisdiction": asset_data.get("jurisdiction", "Unknown"),
            "description": asset_data.get("description", "No description provided."),
            "infrastructure": asset_data.get("infrastructure", []),
            "owner_wallet": asset_data.get("owner_wallet", "0xSYSTEM"),
            "last_valuation": "$410,000",
            "sq_ft": 4500,
            "mock_anomaly": "Potential discrepancy in metadata reported by Prism agent."
        },
        "debate_round": 0,
        "debate_history": []
    }

    # Emit Initialization
    await emit_func({"type": "status", "message": "LangGraph orchestrated. Agents spinning up...", "confidence": 50})
    
    # We will use .astream to get node-by-node updates
    # (Since LLMs are fast, astream is fine. astream_events is highly granular)
    try:
        final_state = None
        async for output in graph.astream(initial_state):
            for node_name, state_update in output.items():
                if node_name == "geo_agent":
                    await emit_func({"type": "finding", "agent": "Atlas", "message": state_update.get("geo_report")})
                elif node_name == "financial_agent":
                    await emit_func({"type": "finding", "agent": "Oracle", "message": state_update.get("financial_report")})
                elif node_name == "legal_agent":
                    await emit_func({"type": "finding", "agent": "Ledger", "message": state_update.get("legal_report")})
                elif node_name == "fraud_agent":
                    await emit_func({"type": "finding", "agent": "Prism", "message": state_update.get("fraud_report")})
                elif node_name == "sentiment_agent":
                    await emit_func({"type": "finding", "agent": "Pulse", "message": state_update.get("sentiment_report")})
                elif node_name == "climate_agent":
                    await emit_func({"type": "finding", "agent": "Tempest", "message": state_update.get("climate_report")})
                elif node_name == "compliance_agent":
                    await emit_func({"type": "finding", "agent": "Sentinel", "message": state_update.get("compliance_report")})
                elif node_name == "consensus":
                    if state_update.get("anomalies_detected"):
                        await emit_func({"type": "status", "message": "Anomalies detected. Routing to Aegis for Meta-Consensus.", "confidence": 60})
                    else:
                        await emit_func({"type": "consensus", "message": "Consensus Achieved by Aegis. " + state_update.get("synthesis_reasoning", ""), "confidence": state_update.get("consensus_score")})
                elif node_name == "debate_chamber":
                    for msg in state_update.get("debate_history", []):
                        content = msg.content
                        if content.startswith("**"):
                            parts = content.split("**: ", 1)
                            if len(parts) == 2:
                                agent_name = parts[0].replace("**", "")
                                await emit_func({"type": "debate", "agent": agent_name, "message": parts[1]})
                                await asyncio.sleep(2.5)
                                continue
                        await emit_func({"type": "debate", "agent": "Aegis", "message": content})
                        await asyncio.sleep(2)
                
                final_state = state_update
            
            # Increased delay to simulate deep analysis and let the UI breathe
            await asyncio.sleep(3)

        # Return the final structure the UI expects
        # Because graph.astream yields incremental dicts, we need to merge or grab the final payload.
        # If the last node was consensus, it output status, etc.
        if final_state:
            # Generate cryptographic evidence hash
            state_str = json.dumps(final_state, sort_keys=True, default=str)
            evidence_hash = "0x" + hashlib.sha256(state_str.encode('utf-8')).hexdigest()

            return {
                "status": final_state.get("status", "VERIFIED"),
                "confidence": final_state.get("consensus_score", 95.0),
                "fraud_probability": final_state.get("fraud_probability", "LOW"),
                "market_value_estimate": final_state.get("market_value_estimate", "$0"),
                "yield_band": final_state.get("yield_band", "0%"),
                "evidence_hash": evidence_hash
            }
        
    except Exception as e:
        await emit_func({"type": "error", "message": f"Graph execution failed: {str(e)}"})
        return {"status": "FAILED", "confidence": 0}
