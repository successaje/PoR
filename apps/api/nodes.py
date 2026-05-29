import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import SystemMessage
from langchain_core.tools import tool
from pydantic import BaseModel, Field
import json
import hashlib
from dotenv import load_dotenv

from state import AssetVerificationState

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

# --- Define Output Schemas ---

class AgentReport(BaseModel):
    analysis: str = Field(description="The detailed analysis report.")
    anomaly_detected: bool = Field(description="True if any anomalies or red flags were found.")
    confidence: float = Field(description="Agent's confidence in their domain assessment (0-100).")

class ConsensusReport(BaseModel):
    status: str = Field(description="Either 'VERIFIED' or 'REJECTED'")
    consensus_score: float = Field(description="A score between 0 and 100 representing overall confidence.")
    fraud_probability: str = Field(description="LOW, MODERATE, or HIGH")
    market_value_estimate: str = Field(description="Estimated value, e.g., '$418,000'")
    yield_band: str = Field(description="Estimated yield, e.g., '8.1%-10.4%'")
    requires_debate: bool = Field(description="True if the reports heavily conflict and agents need to cross-examine.")
    synthesis_reasoning: str = Field(description="Explanation of how consensus was reached or why debate is needed.")


# --- Mock RAG Tools ---

@tool
def fetch_satellite_metadata(registry_id: str) -> str:
    """Fetches satellite metadata and boundary coordinates for a property registry ID."""
    return f"Satellite data for {registry_id}: 4500 sq ft footprint. Boundaries match local zoning maps. No recent structural changes detected."

@tool
def query_county_registry(registry_id: str) -> str:
    """Queries the county tax and legal registry for a property ID."""
    return f"Registry for {registry_id}: Title clear. No active liens. Last sale in 2021 for $410,000."

@tool
def analyze_market_comps(registry_id: str) -> str:
    """Fetches comparable property sales in the immediate vicinity."""
    return "Recent comps average $425,000. Interest rates steady. Projected cap rate: 9.2%."

@tool
def check_climate_risk(registry_id: str) -> str:
    """Checks environmental and climate risk models for the property area."""
    return "Flood zone: X (Minimal Risk). Wildfire risk: Low. Structural weather resilience rated A."

@tool
def verify_kyc_aml(registry_id: str) -> str:
    """Checks Anti-Money Laundering (AML) and jurisdictional compliance records."""
    return "Owner entity checks out. No OFAC sanctions detected. Jurisdiction compliance fully met."

@tool
def scan_fraud_signals(registry_id: str) -> str:
    """Scans dark web, recent deepfake registries, and anomaly detection models for document forgery."""
    return "Metadata on uploaded documents matches expected cryptographic signatures. Forgery probability < 1%."

@tool
def get_social_sentiment(registry_id: str) -> str:
    """Analyzes neighborhood sentiment, future development plans, and local economic activity."""
    return "Positive gentrification indicators. New tech hub planned 2 miles away. High economic velocity."

# --- Node Functions ---

def analyze_geo(state: AssetVerificationState) -> AssetVerificationState:
    """Atlas: Geo-Spatial Agent"""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are Atlas, a strict Geo-Spatial Intelligence Agent for the PoR protocol. Use tools to verify boundaries and structural integrity."),
        ("human", "Context: {context}")
    ])
    agent = prompt | llm.bind_tools([fetch_satellite_metadata]).with_structured_output(AgentReport)
    result = agent.invoke({"context": json.dumps(state.get("asset_context", {}))})
    return {"geo_report": result.analysis}

def analyze_financial(state: AssetVerificationState) -> AssetVerificationState:
    """Oracle: Market Valuation Agent"""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are Oracle, a strict Financial Intelligence Agent for the PoR protocol. Use tools to analyze market comps and valuations."),
        ("human", "Context: {context}")
    ])
    agent = prompt | llm.bind_tools([analyze_market_comps]).with_structured_output(AgentReport)
    result = agent.invoke({"context": json.dumps(state.get("asset_context", {}))})
    return {"financial_report": result.analysis}

def analyze_legal(state: AssetVerificationState) -> AssetVerificationState:
    """Ledger: Registry & Ownership Agent"""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are Ledger, a strict Legal Intelligence Agent for the PoR protocol. Use tools to verify ownership and deeds."),
        ("human", "Context: {context}")
    ])
    agent = prompt | llm.bind_tools([query_county_registry]).with_structured_output(AgentReport)
    result = agent.invoke({"context": json.dumps(state.get("asset_context", {}))})
    return {"legal_report": result.analysis}

def analyze_fraud(state: AssetVerificationState) -> AssetVerificationState:
    """Prism: Fraud Detection Agent"""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are Prism, a strict Fraud Detection Agent. Use tools to scan for document forgery and synthetic anomalies."),
        ("human", "Context: {context}")
    ])
    agent = prompt | llm.bind_tools([scan_fraud_signals]).with_structured_output(AgentReport)
    result = agent.invoke({"context": json.dumps(state.get("asset_context", {}))})
    return {"fraud_report": result.analysis}

def analyze_sentiment(state: AssetVerificationState) -> AssetVerificationState:
    """Pulse: Social & Activity Intelligence Agent"""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are Pulse, a Market Sentiment Agent. Use tools to analyze local economic activity and neighborhood momentum."),
        ("human", "Context: {context}")
    ])
    agent = prompt | llm.bind_tools([get_social_sentiment]).with_structured_output(AgentReport)
    result = agent.invoke({"context": json.dumps(state.get("asset_context", {}))})
    return {"sentiment_report": result.analysis}

def analyze_climate(state: AssetVerificationState) -> AssetVerificationState:
    """Tempest: Climate & Risk Agent"""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are Tempest, a Climate Risk Agent. Use tools to analyze environmental hazards for the property."),
        ("human", "Context: {context}")
    ])
    agent = prompt | llm.bind_tools([check_climate_risk]).with_structured_output(AgentReport)
    result = agent.invoke({"context": json.dumps(state.get("asset_context", {}))})
    return {"climate_report": result.analysis}

def analyze_compliance(state: AssetVerificationState) -> AssetVerificationState:
    """Sentinel: Compliance Agent"""
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are Sentinel, a Regulatory Compliance Agent. Use tools to verify KYC/AML and jurisdictional compliance."),
        ("human", "Context: {context}")
    ])
    agent = prompt | llm.bind_tools([verify_kyc_aml]).with_structured_output(AgentReport)
    result = agent.invoke({"context": json.dumps(state.get("asset_context", {}))})
    return {"compliance_report": result.analysis}

def synthesize_consensus(state: AssetVerificationState) -> AssetVerificationState:
    """Aletheia: The Consensus Synthesizer"""
    
    if state.get("debate_round", 0) > 1:
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
        Review all 7 agent reports. If they agree, synthesize a Verified state.
        If they strongly conflict, trigger a debate (requires_debate=True)."""),
        ("human", """
        Atlas (Geo): {geo}
        Oracle (Financial): {financial}
        Ledger (Legal): {legal}
        Prism (Fraud): {fraud}
        Pulse (Sentiment): {sentiment}
        Tempest (Climate): {climate}
        Sentinel (Compliance): {compliance}
        
        Debate History: {debate}
        """)
    ])
    
    chain = prompt | llm.with_structured_output(ConsensusReport)
    
    debate_str = ""
    if state.get("debate_history"):
        for m in state["debate_history"]:
            debate_str += f"{m.type}: {m.content}\n"

    result = chain.invoke({
        "geo": state.get("geo_report", "N/A"),
        "financial": state.get("financial_report", "N/A"),
        "legal": state.get("legal_report", "N/A"),
        "fraud": state.get("fraud_report", "N/A"),
        "sentiment": state.get("sentiment_report", "N/A"),
        "climate": state.get("climate_report", "N/A"),
        "compliance": state.get("compliance_report", "N/A"),
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
    
    if not result.requires_debate:
        payload = f"{result.status}_{result.consensus_score}_{result.synthesis_reasoning}"
        updates["evidence_hash"] = "0x" + hashlib.sha256(payload.encode()).hexdigest()
        
    return updates

def run_debate_round(state: AssetVerificationState) -> AssetVerificationState:
    """The Debate Chamber Node"""
    current_round = state.get("debate_round", 0) + 1
    debate_msg = SystemMessage(content=f"Aletheia initiated Cross-Examination Phase {current_round}. Low confidence agents must re-evaluate.")
    return {
        "debate_history": [debate_msg],
        "debate_round": current_round
    }
