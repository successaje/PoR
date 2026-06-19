import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def setup_supabase():
    print("🔄 Initializing Supabase...")
    
    # Create Storage Bucket
    try:
        supabase.storage.create_bucket("por_evidence", {"public": True})
        print("✅ Storage bucket 'por_evidence' created successfully.")
    except Exception as e:
        if "Duplicate" in str(e) or "already exists" in str(e):
            print("✅ Storage bucket 'por_evidence' already exists.")
        else:
            print(f"⚠️ Error creating bucket: {e}")

    # Note: Supabase Python client doesn't currently support running raw DDL (CREATE TABLE)
    # natively via the REST API for security reasons unless using postgres functions.
    # Therefore, you MUST run the SQL schema provided in the implementation plan
    # directly in the Supabase Dashboard's SQL Editor.
    
    print("\n" + "="*50)
    print("IMPORTANT INSTRUCTIONS:")
    print("="*50)
    print("The storage bucket has been created via API.")
    print("However, tables must be created manually in the Supabase Dashboard.")
    print("1. Go to https://supabase.com/dashboard/project/_/sql/new")
    print("2. Paste and run the SQL schema provided in the Implementation Plan.")
    print("="*50)

if __name__ == "__main__":
    setup_supabase()
