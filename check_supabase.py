#!/usr/bin/env python3
"""
Debug script to check Supabase database contents
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
env_paths = [
    'web/.env.local',
    '../web/.env.local',
    '.env.local'
]

for env_path in env_paths:
    if os.path.exists(env_path):
        load_dotenv(env_path)
        break

# Initialize Supabase client
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials. Check your .env.local file.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("=" * 60)
print("SUPABASE DATABASE CHECK")
print("=" * 60)

# Check countries
print("\n=== COUNTRIES ===")
countries = supabase.table('countries').select('*').execute()
for c in countries.data:
    print(f"ID: {c['id']}, Name: {c['name']}, ISO: {c['iso_code']}")

# Check indicators
print("\n=== INDICATORS ===")
indicators = supabase.table('indicators').select('*').execute()
for i in indicators.data:
    print(f"ID: {i['id']}, Code: {i['code']}, Label: {i['label']}")

# Check time series count by country
print("\n=== TIME SERIES DATA COUNT BY COUNTRY ===")
for c in countries.data:
    result = supabase.table('time_series').select('*', count='exact').eq('country_id', c['id']).execute()
    print(f"{c['name']} ({c['iso_code']}): {result.count} rows")

print("\n" + "=" * 60)
