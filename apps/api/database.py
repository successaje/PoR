import os
from supabase import create_client, Client

def get_supabase() -> Client | None:
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if supabase_url and supabase_key:
        return create_client(supabase_url.strip(), supabase_key.strip())
    return None
