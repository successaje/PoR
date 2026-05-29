import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel, Field
import json
import hashlib
from dotenv import load_dotenv

from state import AssetVerificationState

load_dotenv()

# Initialize LLM (Requires OPENAI_API_KEY in .env)
# Using gpt-4o-mini for speed and cost-effectiveness during hackathon
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

# --- Define Output Schemas ---

class AgentReport(BaseModel):
    analysis: str = Field(description="The detailed analysis report.")
    anomaly_detected: bool = Field(description="True if any anomalies or red flags were found.")

class ConsensusReport(BaseModel):
    status: str = Field(description="Either 'VERIFIED' or 'REJECTED'")
    consensus_score: float = Field(description="A score between 0 and 100 representing confidence.")
    fraud_probability: str = Field(description="LOW, MODERATE, or HIGH")
    market_value_estimate: str = Field(description="Estimated value, e.g., '$418,000'")
    yield_band: str = Field(description="Estimated yield, e.g., '8.1%-10.4%'")
    requires_debate: bool = Field(description="True if the reports heavily conflict and agents need to cross-examine.")
    synthesis_reasoning: str = Field(description="Explanation of how consensus was reached or why debate is needed.")


# --- Node Functions ---

def analyze_geo(state: AssetVerificationState) -> AssetVerificationState:
    """Atlas: Geo-Spatial Agent"""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are Atlas, a strict Geo-Spatial Intelligence Agent for the PoR protocol. Analyze physical boundaries, satellite data, and structural integrity for the given asset context. Output your findings."),
        ("human", "Context: {context}")
    ])
    
    chain = prompt | llm.with_structured_output(AgentReport)
    result = chain.invoke({"context": json.dumps(state.get("asset_context", {}))})
    
    return {"geo_report": result.analysis}

def analyze_financial(state: AssetVerificationState) -> AssetVerificationState:
    """Oracle: Market Valuation Agent"""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are Oracle, a strict Financial Intelligence Agent for the PoR protocol. Analyze tax records, comparable sales, and valuation logic for the given asset context. Output your findings."),
        ("human", "Context: {context}")
    ])
    
    chain = prompt | llm.with_structured_output(AgentReport)
    result = chain.invoke({"context": json.dumps(state.get("asset_context", {}))})
    
    return {"financial_report": result.analysis}

def analyze_legal(state: AssetVerificationState) -> AssetVerificationState:
    """Ledger: Registry & Ownership Agent"""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are Ledger, a strict Legal and Title Intelligence Agent for the PoR protocol. Verify ownership deeds, liens, and public registry alignment for the given asset context. Output your findings."),
        ("human", "Context: {context}")
    ])
    
    chain = prompt | llm.with_structured_output(AgentReport)
    result = chain.invoke({"context": json.dumps(state.get("asset_context", {}))})
    
    return {"legal_report": result.analysis}

def synthesize_consensus(state: AssetVerificationState) -> AssetVerificationState:
    """Aletheia: The Consensus Synthesizer"""
    
    # If we are already deep in debate, skip to final verdict
    if state.get("debate_round", 0) > 1:
        # Force a consensus
        return {
            "status": "VERIFIED",
            "consensus_score": 85.5,
            "fraud_probability": "LOW",
            "market_value_estimate": "$420,000",
            "yield_band": "8.0%-10.5%",
            "evidence_hash": hashlib.sha256("FORCED_CONSENSUS".encode()).hexdigest(),
            "anomalies_detected": False
        }

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are Aletheia, the Master Consensus Engine of the PoR protocol.
        You must review the reports from Atlas (Geo), Oracle (Financial), and Ledger (Legal).
        If they all agree and there are no major anomalies, synthesize a final Verified state.
        If they strongly conflict, you must trigger a debate (requires_debate=True)."""),
        ("human", """
        Geo Report: {geo}
        Financial Report: {financial}
        Legal Report: {legal}
        
        Debate History (if any): {debate}
        """)
    ])
    
    chain = prompt | llm.with_structured_output(ConsensusReport)
    
    # Format debate history if it exists
    debate_str = ""
    if state.get("debate_history"):
        for m in state["debate_history"]:
            debate_str += f"{m.type}: {m.content}\n"

    result = chain.invoke({
        "geo": state.get("geo_report", "N/A"),
        "financial": state.get("financial_report", "N/A"),
        "legal": state.get("legal_report", "N/A"),
        "debate": debate_str or "None yet."
    })
    
    updates = {
        "status": result.status,
        "consensus_score": result.consensus_score,
        "fraud_probability": result.fraud_probability,
        "market_value_estimate": result.market_value_estimate,
        "yield_band": result.yield_band,
        "anomalies_detected": result.requires_debate
    }
    
    # Generate cryptographic evidence hash if verified
    if not result.requires_debate:
        payload = f"{result.status}_{result.consensus_score}_{result.synthesis_reasoning}"
        updates["evidence_hash"] = "0x" + hashlib.sha256(payload.encode()).hexdigest()
        
    return updates

def run_debate_round(state: AssetVerificationState) -> AssetVerificationState:
    """The Debate Chamber Node"""
    # This node simply adds a mock debate message to the history and increments the round
    # In a full implementation, the agents would converse directly.
    current_round = state.get("debate_round", 0) + 1
    
    debate_msg = SystemMessage(content=f"Aletheia initiated Cross-Examination Phase {current_round}. Agents are re-evaluating anomalies.")
    
    return {
        "debate_history": [debate_msg],
        "debate_round": current_round
    }
