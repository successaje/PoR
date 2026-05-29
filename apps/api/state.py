from typing import TypedDict, Annotated, List, Dict, Any
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage

class AssetVerificationState(TypedDict):
    """
    Represents the state of our LangGraph execution.
    """
    asset_id: str
    asset_context: Dict[str, Any]  # The deterministic mock data
    
    # Reports from individual agents
    geo_report: str
    financial_report: str
    legal_report: str
    
    # Debate variables
    debate_history: Annotated[List[BaseMessage], add_messages]
    anomalies_detected: bool
    debate_round: int
    
    # Final Consensus
    status: str
    consensus_score: float
    fraud_probability: str
    market_value_estimate: str
    yield_band: str
    evidence_hash: str
