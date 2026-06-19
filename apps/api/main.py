from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
import hashlib
import uuid
from fastapi import File, UploadFile, Form
from database import get_supabase

from debate import run_debate

app = FastAPI(title="Proof-of-Reality (PoR) AI Layer")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AssetSubmission(BaseModel):
    asset_id: str
    metadata: dict

# In-memory store for asset metadata to bridge /submit and /stream
asset_metadata_store = {}

async def debate_event_generator(asset_data: dict, asset_id: str):
    # Queue for events
    queue = asyncio.Queue()
    supabase = get_supabase()

    async def emit(data: dict):
        # Save debate logs to Supabase if connected
        if supabase and data.get("type") == "status":
            try:
                supabase.table("debate_logs").insert({
                    "asset_id": asset_id,
                    "agent_name": data.get("agent", "SYSTEM"),
                    "action_type": data.get("actionType", "INFO"),
                    "message": data.get("message", ""),
                    "confidence": data.get("confidence", 0)
                }).execute()
            except Exception as e:
                print(f"Error logging to Supabase: {e}")

        await queue.put(data)

    # Run the debate in a background task so we can stream results
    async def debate_runner():
        final_result = await run_debate(asset_data, emit)
        await emit({"type": "final_result", "data": final_result})
        
        # Update final score in Supabase
        if supabase and final_result.get("status") == "COMPLETED":
            try:
                supabase.table("uploads").update({
                    "truth_score": final_result.get("confidence", 0),
                    "status": "verified"
                }).eq("asset_id", asset_id).execute()
            except Exception as e:
                print(f"Error updating final score in Supabase: {e}")

        # Let the UI linger on the beautiful radial convergence consensus animation
        await asyncio.sleep(4)
        await emit({"type": "done"})

    task = asyncio.create_task(debate_runner())

    while True:
        event = await queue.get()
        yield f"data: {json.dumps(event)}\n\n"
        if event.get("type") == "done":
            break

@app.post("/submit")
async def submit_asset(
    asset_id: str = Form(...),
    metadata: str = Form(...),
    files: list[UploadFile] = File(None)
):
    supabase = get_supabase()
    
    # Save metadata to in-memory store to pass to LangGraph
    try:
        metadata_dict = json.loads(metadata)
        asset_metadata_store[asset_id] = metadata_dict
    except:
        asset_metadata_store[asset_id] = {}
        
    # Process files if Supabase is configured
    if supabase and files:
        for file in files:
            content = await file.read()
            file_hash = hashlib.sha256(content).hexdigest()
            
            # Upload to storage
            filename = f"{asset_id}/{file.filename}"
            try:
                supabase.storage.from_("por_evidence").upload(
                    file=content,
                    path=filename,
                    file_options={"content-type": file.content_type}
                )
                storage_url = supabase.storage.from_("por_evidence").get_public_url(filename)
                
                # Insert into DB
                supabase.table("uploads").insert({
                    "asset_id": asset_id,
                    "owner_wallet": "0xSYSTEM", # This should come from the frontend
                    "filename": file.filename,
                    "file_type": "document" if "pdf" in file.content_type else "image",
                    "file_size_bytes": len(content),
                    "mime_type": file.content_type,
                    "storage_url": storage_url,
                    "sha256_hash": file_hash,
                    "asset_type": "real_estate",
                    "status": "processing"
                }).execute()
            except Exception as e:
                print(f"File upload error: {e}")
                
    return {"status": "accepted", "asset_id": asset_id, "stream_url": f"/stream/{asset_id}"}

@app.get("/stream/{asset_id}")
async def stream_debate(asset_id: str):
    # In a real app, you'd fetch the submission from DB.
    # Here we bridge the gap using our in-memory store.
    meta = asset_metadata_store.get(asset_id, {})
    asset_data = {
        "asset_id": asset_id, 
        "type": meta.get("assetCategories", ["Commercial Real Estate"])[0] if meta.get("assetCategories") else "Commercial Real Estate",
        "jurisdiction": meta.get("jurisdiction", "Unknown"),
        "description": meta.get("description", "No description provided"),
        "infrastructure": meta.get("infrastructureTags", []),
        "owner_wallet": meta.get("owner_wallet", "0xSYSTEM")
    }
    return StreamingResponse(debate_event_generator(asset_data, asset_id), media_type="text/event-stream")

@app.get("/cases")
async def get_cases(owner_wallet: str = None):
    supabase = get_supabase()
    if not supabase:
        return {"cases": []}
    try:
        query = supabase.table("uploads").select("*").eq("file_type", "image").order("uploaded_at", desc=True)
        if owner_wallet:
            query = query.eq("owner_wallet", owner_wallet)
        response = query.execute()
        return {"cases": response.data}
    except Exception as e:
        print(f"Error fetching cases: {e}")
        return {"cases": [], "error": str(e)}

@app.get("/cases/{asset_id}")
async def get_case(asset_id: str):
    supabase = get_supabase()
    if not supabase:
        return {"case": None}
    try:
        response = supabase.table("uploads").select("*").eq("asset_id", asset_id).eq("file_type", "image").execute()
        if response.data:
            return {"case": response.data[0]}
        return {"case": None}
    except Exception as e:
        print(f"Error fetching case: {e}")
        return {"case": None, "error": str(e)}

@app.get("/cases/{asset_id}/logs")
async def get_case_logs(asset_id: str):
    supabase = get_supabase()
    if not supabase:
        return {"logs": []}
    try:
        response = supabase.table("debate_logs").select("*").eq("asset_id", asset_id).order("timestamp", desc=False).execute()
        return {"logs": response.data}
    except Exception as e:
        print(f"Error fetching logs: {e}")
        return {"logs": [], "error": str(e)}

@app.get("/")
def read_root():
    return {"status": "ok", "message": "PoR API is running."}
