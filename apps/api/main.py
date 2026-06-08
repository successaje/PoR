from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json

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

async def debate_event_generator(asset_data: dict):
    # Queue for events
    queue = asyncio.Queue()

    async def emit(data: dict):
        await queue.put(data)

    # Run the debate in a background task so we can stream results
    async def debate_runner():
        final_result = await run_debate(asset_data, emit)
        await emit({"type": "final_result", "data": final_result})
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
async def submit_asset(submission: AssetSubmission):
    return {"status": "accepted", "asset_id": submission.asset_id, "stream_url": f"/stream/{submission.asset_id}"}

@app.get("/stream/{asset_id}")
async def stream_debate(asset_id: str):
    # In a real app, you'd fetch the submission from DB.
    # Here we just start the debate stream.
    asset_data = {"asset_id": asset_id, "type": "real_estate"}
    return StreamingResponse(debate_event_generator(asset_data), media_type="text/event-stream")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "PoR API is running."}
