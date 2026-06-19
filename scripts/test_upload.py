import requests
import json
import uuid
import os
import time

API_URL = "http://localhost:8000"

def create_mock_files():
    os.makedirs("/tmp/por_test_files", exist_ok=True)
    
    # Create mock PDF
    pdf_path = "/tmp/por_test_files/test_deed.pdf"
    with open(pdf_path, "wb") as f:
        f.write(b"%PDF-1.4\n%Mock Real Estate Deed for Testing Proof-of-Reality\n")
        
    # Create mock image
    img_path = "/tmp/por_test_files/test_property.jpg"
    with open(img_path, "wb") as f:
        # Just write some dummy binary data
        f.write(b"\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01Mock Image Data\xFF\xD9")
        
    return pdf_path, img_path

def test_submission():
    print("🚀 Initializing Proof-of-Reality Mock Submission Test...")
    pdf_path, img_path = create_mock_files()
    
    asset_id = f"test-asset-{uuid.uuid4().hex[:8]}"
    
    metadata = {
        "description": "Commercial building in downtown Lagos with 3-phase power.",
        "jurisdiction": "NG",
        "assetCategories": ["Real Estate", "Commercial"],
        "infrastructureTags": ["Underground electrical systems", "Central sewage and water treatment system"],
        "coords": {"lat": 6.5244, "lng": 3.3792},
        "owner_wallet": "0x1234567890abcdef1234567890abcdef12345678"
    }
    
    files = [
        ('files', ('test_deed.pdf', open(pdf_path, 'rb'), 'application/pdf')),
        ('files', ('test_property.jpg', open(img_path, 'rb'), 'image/jpeg'))
    ]
    
    data = {
        'asset_id': asset_id,
        'metadata': json.dumps(metadata)
    }
    
    print(f"📦 Uploading Mock Files & Metadata for asset {asset_id}...")
    try:
        response = requests.post(f"{API_URL}/submit", data=data, files=files)
        response.raise_for_status()
        result = response.json()
        print("✅ Upload successful! Supabase records should be created.")
        print(f"📄 Response: {result}")
        
        stream_url = result.get('stream_url')
        if stream_url:
            print("\n📡 Connecting to Debate Stream...")
            stream_response = requests.get(f"{API_URL}{stream_url}", stream=True)
            for line in stream_response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8')
                    if decoded_line.startswith("data: "):
                        event_data = json.loads(decoded_line[6:])
                        print(f"[{event_data.get('type')}] {event_data.get('agent', 'System')}: {event_data.get('message', '')[:100]}...")
                        if event_data.get('type') == 'done':
                            break
            print("✅ Stream complete! Debate logs should be saved to Supabase.")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error during request: {e}")
        
if __name__ == "__main__":
    test_submission()
