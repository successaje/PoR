import os
import json
import uuid
import time
import requests
import hashlib
from dotenv import load_dotenv
from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware

import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../apps/api'))
from database import get_supabase

# Load env variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../contracts/.env'))
load_dotenv(os.path.join(os.path.dirname(__file__), '../apps/api/.env'), override=True)

PRIVATE_KEY = os.getenv("PRIVATE_KEY")
VERIFICATION_MANAGER_ADDRESS = "0x34d156d6c062804771652b48f2d65d58d3794113"
RPC_URL = "https://rpc.sepolia.mantle.xyz"

def download_image(url, filename):
    print(f"Downloading image from {url}...")
    try:
        response = requests.get(url, allow_redirects=True, timeout=10)
        response.raise_for_status()
        with open(filename, 'wb') as f:
            f.write(response.content)
        return filename
    except Exception as e:
        print(f"Failed to download image. Creating dummy image. Error: {e}")
        with open(filename, 'wb') as f:
            f.write(b"\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01Mock Image Data\xFF\xD9")
        return filename

def create_dummy_pdf(filename, description):
    with open(filename, 'wb') as f:
        f.write(f"%PDF-1.4\n%Mock Document for {description}\n".encode('utf-8'))
    return filename

def seed():
    print("🌱 Starting Supabase & On-Chain Database Seeder...")
    
    supabase = get_supabase()
    if not supabase:
        print("❌ Supabase is not connected. Did you set SUPABASE_URL and SUPABASE_KEY in apps/api/.env?")
        return

    print("🔌 Connecting to Mantle Sepolia...")
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
    
    if not w3.is_connected():
        print("❌ Failed to connect to Mantle Sepolia")
        return
        
    account = w3.eth.account.from_key(PRIVATE_KEY)
    print(f"✅ Connected. Wallet address: {account.address}")
    
    # Load ABI
    abi_path = os.path.join(os.path.dirname(__file__), '../apps/api/VerificationManager_abi.json')
    with open(abi_path, 'r') as f:
        abi = json.load(f)
        
    contract = w3.eth.contract(address=w3.to_checksum_address(VERIFICATION_MANAGER_ADDRESS), abi=abi)

    # 3 Realistic Cases
    cases = [
        {
            "id": "case_1",
            "type": "Commercial Building",
            "desc": "Prime Commercial Office Building in Central London with EV charging stations and solar roof.",
            "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
            "jurisdiction": "UK",
            "value": 15000000,
            "status": "verified",
            "score": 94,
            "coords": {"lat": 51.5072, "lng": -0.1276}
        },
        {
            "id": "case_2",
            "type": "Luxury Villa",
            "desc": "High-end coastal residential villa in Miami Beach, FL. Zoned for short-term rental.",
            "image_url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
            "jurisdiction": "US",
            "value": 4500000,
            "status": "flagged",
            "score": 45,
            "flag_reason": "High climate hazard risk (flood zone) detected by Tempest Agent.",
            "coords": {"lat": 25.7906, "lng": -80.1300}
        },
        {
            "id": "case_3",
            "type": "Industrial Warehouse",
            "desc": "Logistics hub and industrial warehouse in Yokohama, Japan. Connected to deep water port.",
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8ed7c80a71?q=80&w=800&auto=format&fit=crop",
            "jurisdiction": "JP",
            "value": 8200000,
            "status": "processing",
            "score": None,
            "coords": {"lat": 35.4437, "lng": 139.6380}
        },
        {
            "id": "case_4",
            "type": "Commercial Plaza",
            "desc": "High-density commercial plaza in Victoria Island, Lagos. Multi-tenant retail space with private grid connection.",
            "image_url": "https://images.unsplash.com/photo-1546412414-8035e4cb51ce?q=80&w=800&auto=format&fit=crop",
            "jurisdiction": "NG",
            "value": 12500000,
            "status": "verified",
            "score": 96,
            "coords": {"lat": 6.4281, "lng": 3.4219}
        },
        {
            "id": "case_5",
            "type": "Tech Hub Office",
            "desc": "Modern tech hub office space in Upper Hill, Nairobi. Features high-speed fiber backbone and green certification.",
            "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
            "jurisdiction": "KE",
            "value": 3800000,
            "status": "processing",
            "score": None,
            "coords": {"lat": -1.2921, "lng": 36.8219}
        },
        {
            "id": "case_6",
            "type": "Luxury Beachfront",
            "desc": "Exclusive luxury beachfront property in Camps Bay, Cape Town. Suspicious title deed history detected.",
            "image_url": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800&auto=format&fit=crop",
            "jurisdiction": "ZA",
            "value": 8500000,
            "status": "flagged",
            "score": 32,
            "flag_reason": "Chain of title discontinuity detected between 2018-2021 by Aegis Agent.",
            "coords": {"lat": -33.9506, "lng": 18.3772}
        }
    ]

    os.makedirs("/tmp/por_seed", exist_ok=True)

    for case in cases:
        print(f"\n=============================================")
        print(f"🏗 Processing Case: {case['type']} ({case['jurisdiction']})")
        
        # 1. On-Chain Transaction
        print("🔗 Initiating Mantle Transaction (createCase)...")
        tx = contract.functions.createCase(case["desc"]).build_transaction({
            'from': account.address,
            'nonce': w3.eth.get_transaction_count(account.address),
            'gas': 500000,
            'gasPrice': w3.eth.gas_price
        })
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        print(f"⏳ Waiting for confirmation... Tx Hash: {tx_hash.hex()}")
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"✅ Transaction Confirmed in Block {receipt.blockNumber}")
        
        # We need a UUID for the asset_id
        asset_id = str(uuid.uuid4())
        
        # 2. Fetch Assets and Upload
        img_path = f"/tmp/por_seed/{case['id']}.jpg"
        pdf_path = f"/tmp/por_seed/{case['id']}.pdf"
        
        download_image(case["image_url"], img_path)
        create_dummy_pdf(pdf_path, case["desc"])
        
        for file_path in [img_path, pdf_path]:
            filename = os.path.basename(file_path)
            content = open(file_path, 'rb').read()
            file_hash = hashlib.sha256(content).hexdigest()
            content_type = "image/jpeg" if filename.endswith(".jpg") else "application/pdf"
            
            storage_path = f"{asset_id}/{filename}"
            print(f"☁️ Uploading {filename} to Supabase Storage...")
            try:
                supabase.storage.from_("por_evidence").upload(
                    file=content,
                    path=storage_path,
                    file_options={"content-type": content_type}
                )
                storage_url = supabase.storage.from_("por_evidence").get_public_url(storage_path)
                
                # Insert DB Record
                print(f"💾 Inserting metadata into Supabase Database...")
                record = {
                    "asset_id": asset_id,
                    "owner_wallet": account.address,
                    "filename": filename,
                    "file_type": "image" if filename.endswith(".jpg") else "document",
                    "file_size_bytes": len(content),
                    "mime_type": content_type,
                    "storage_url": storage_url,
                    "sha256_hash": file_hash,
                    "asset_type": case["type"],
                    "coordinates": case["coords"],
                    "declared_value_usd": case["value"],
                    "jurisdiction": case["jurisdiction"],
                    "status": case["status"],
                    "mantle_tx_hash": tx_hash.hex(),
                    "evidence_hash": hashlib.sha256(tx_hash).hexdigest(), # mock evidence hash tied to tx
                }
                
                if case["score"]:
                    record["truth_score"] = case["score"]
                if case.get("flag_reason"):
                    record["sentinel_flagged"] = True
                    record["flag_reason"] = case["flag_reason"]
                    
                supabase.table("uploads").insert(record).execute()
                print(f"✅ Supabase record created for {filename}")
                
            except Exception as e:
                print(f"❌ Supabase Error for {filename}: {e}")
                
        # Insert debate logs
        print("💾 Inserting mock debate logs...")
        import datetime
        now = datetime.datetime.now()
        is_rejected = case["status"] == "flagged"
        mock_logs = [
            {"agent_name": "Atlas", "action_type": "SCANNING", "message": "Cross-referencing global geospatial registry. Coordinates validated.", "confidence": 98, "offset": 2},
            {"agent_name": "Oracle", "action_type": "SCANNING", "message": "Querying local municipal databases for ownership records.", "confidence": 85, "offset": 4},
            {"agent_name": "Prism", "action_type": "FLAGGED" if is_rejected else "DEBATING", "message": "CRITICAL: Synthetic manipulation detected in structural survey metadata." if is_rejected else "Discrepancy found in valuation metric derived from local property registries. Flagging for cross-examination.", "confidence": 42 if is_rejected else 65, "offset": 8},
            {"agent_name": "Sentinel", "action_type": "DEBATING", "message": "Sanctions list cleared, but KYC provider flagged secondary shell company associated with title deed." if is_rejected else "Sanctions list cleared. Parties involved pass KYC/AML protocols.", "confidence": 55 if is_rejected else 99, "offset": 11},
            {"agent_name": "Aegis", "action_type": "RESOLUTION", "message": "Conflict resolution failed. Prism's metadata discrepancy cannot be resolved. Risk threshold exceeded." if is_rejected else "Conflict resolution initiated. Weighting Ledger's historical index higher. Discrepancy resolved.", "confidence": 30 if is_rejected else 88, "offset": 15},
            {"agent_name": "Aletheia", "action_type": "REJECTED" if is_rejected else "CONSENSUS", "message": "Consensus aborted. Verification failed. Fraud risk too high to mint truth certificate." if is_rejected else "Synthesizing final cryptographic evidence layer. Consensus achieved.", "confidence": 20 if is_rejected else 96, "offset": 18}
        ]
        for log in mock_logs:
            timestamp = (now + datetime.timedelta(seconds=log["offset"])).isoformat()
            try:
                supabase.table("debate_logs").insert({
                    "asset_id": asset_id,
                    "agent_name": log["agent_name"],
                    "action_type": log["action_type"],
                    "message": log["message"],
                    "confidence": log["confidence"],
                    "timestamp": timestamp
                }).execute()
            except Exception as e:
                print(f"❌ Error inserting log: {e}")
                
        time.sleep(2) # Prevent RPC rate limits

    print("\n🎉 ALL DONE! Your protocol is now beautifully seeded.")

if __name__ == "__main__":
    seed()
