from langgraph.graph import StateGraph, START, END
from state import AssetVerificationState
from nodes import analyze_geo, analyze_financial, analyze_legal, synthesize_consensus, run_debate_round
import asyncio
import json

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
    workflow.add_node("consensus", synthesize_consensus)
    workflow.add_node("debate_chamber", run_debate_round)

    # Add Edges
    # Parallel execution from START
    workflow.add_edge(START, "geo_agent")
    workflow.add_edge(START, "financial_agent")
    workflow.add_edge(START, "legal_agent")

    # All parallel nodes feed into consensus
    workflow.add_edge("geo_agent", "consensus")
    workflow.add_edge("financial_agent", "consensus")
    workflow.add_edge("legal_agent", "consensus")

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
            "property_type": "Commercial Real Estate",
            "last_valuation": "$410,000",
            "sq_ft": 4500,
            "mock_anomaly": "Slight discrepancy in parcel boundary on western edge."
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
                    await emit_func({"type": "finding", "agent": "Atlas", "message": state_update.get("geo_report")[:100] + "..."})
                elif node_name == "financial_agent":
                    await emit_func({"type": "finding", "agent": "Oracle", "message": state_update.get("financial_report")[:100] + "..."})
                elif node_name == "legal_agent":
                    await emit_func({"type": "finding", "agent": "Ledger", "message": state_update.get("legal_report")[:100] + "..."})
                elif node_name == "consensus":
                    if state_update.get("anomalies_detected"):
                        await emit_func({"type": "status", "message": "Anomalies detected. Routing to Aletheia Debate Chamber.", "confidence": 60})
                    else:
                        await emit_func({"type": "consensus", "message": "Consensus Achieved by Aletheia Engine.", "confidence": state_update.get("consensus_score")})
                elif node_name == "debate_chamber":
                    await emit_func({"type": "debate", "agent": "Aletheia", "message": "Cross-examining conflicting data points..."})
                
                final_state = state_update
            
            # Small delay to simulate processing so the UI looks cool
            await asyncio.sleep(1)

        # Return the final structure the UI expects
        # Because graph.astream yields incremental dicts, we need to merge or grab the final payload.
        # If the last node was consensus, it output status, etc.
        if final_state:
            return {
                "status": final_state.get("status", "VERIFIED"),
                "confidence": final_state.get("consensus_score", 95.0),
                "fraud_probability": final_state.get("fraud_probability", "LOW"),
                "market_value_estimate": final_state.get("market_value_estimate", "$0"),
                "yield_band": final_state.get("yield_band", "0%")
            }
        
    except Exception as e:
        await emit_func({"type": "error", "message": f"Graph execution failed: {str(e)}"})
        return {"status": "FAILED", "confidence": 0}
