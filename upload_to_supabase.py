#!/usr/bin/env python3
"""
Script to upload CSV data to Supabase database.
This script:
1. Reads all country CSV files
2. Normalizes column names (iso3 -> Country for USA)
3. Creates countries and indicators tables
4. Uploads time series data for all countries
"""

import pandas as pd
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
# Try different paths for .env.local
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

# Country mapping
COUNTRY_MAPPING = {
    'USA': {'name': 'United States', 'iso_code': 'USA'},
    'IND': {'name': 'India', 'iso_code': 'IND'},
    'DEU': {'name': 'Germany', 'iso_code': 'DEU'},
    'CHN': {'name': 'China', 'iso_code': 'CHN'},
    'ARE': {'name': 'United Arab Emirates', 'iso_code': 'ARE'},
}

# Indicator mapping - maps CSV columns to indicator codes
INDICATOR_MAPPING = {
    'gdp_usd': {'code': 'gdp', 'label': 'GDP (current US$)', 'unit': 'USD'},
    'gdp_real_growth_pct': {'code': 'gdp_growth', 'label': 'GDP Growth Rate', 'unit': '%'},
    'population_total': {'code': 'population', 'label': 'Total Population', 'unit': 'people'},
    'energy_use': {'code': 'energy_use', 'label': 'Energy Use', 'unit': 'kg of oil equivalent per capita'},
    'Energy_Use_kgOE_per_Capita': {'code': 'energy_use', 'label': 'Energy Use', 'unit': 'kg of oil equivalent per capita'},
    'political_instability': {'code': 'political_stability', 'label': 'Political Stability', 'unit': 'index'},
    'Political_Instability': {'code': 'political_stability', 'label': 'Political Stability', 'unit': 'index'},
    'exports_pct_gdp': {'code': 'exports_pct_gdp', 'label': 'Exports (% of GDP)', 'unit': '%'},
    'imports_pct_gdp': {'code': 'imports_pct_gdp', 'label': 'Imports (% of GDP)', 'unit': '%'},
    'inflation_cpi_pct': {'code': 'inflation', 'label': 'Inflation (CPI)', 'unit': '%'},
    'unemployment_pct': {'code': 'unemployment', 'label': 'Unemployment Rate', 'unit': '%'},
    'Literacy_Rate': {'code': 'literacy_rate', 'label': 'Literacy Rate', 'unit': '%'},
    'FDI_Net_Inflows_USD': {'code': 'fdi', 'label': 'Foreign Direct Investment', 'unit': 'USD'},
    'Birth_Rate_per_1000': {'code': 'birth_rate', 'label': 'Birth Rate', 'unit': 'per 1000'},
    'arrivals': {'code': 'tourism_arrivals', 'label': 'Tourism Arrivals', 'unit': 'people'},
    'departures': {'code': 'tourism_departures', 'label': 'Tourism Departures', 'unit': 'people'},
}

def normalize_usa_data(df):
    """Normalize USA data to match other countries' format."""
    # Rename iso3 to Country and year to Year
    if 'iso3' in df.columns:
        df = df.rename(columns={'iso3': 'Country', 'year': 'Year'})
    return df

def load_csv_files():
    """Load all country CSV files."""
    data_dir = 'data'
    files = {
        'USA': os.path.join(data_dir, 'USA_all_features.csv'),
        'IND': os.path.join(data_dir, 'IND_data.csv'),
        'DEU': os.path.join(data_dir, 'DEU_data.csv'),
        'CHN': os.path.join(data_dir, 'CHN_data.csv'),
        'ARE': os.path.join(data_dir, 'ARE_data.csv'),
    }
    
    dataframes = {}
    for country_code, filepath in files.items():
        if os.path.exists(filepath):
            df = pd.read_csv(filepath)
            # Normalize USA data
            if country_code == 'USA':
                df = normalize_usa_data(df)
            dataframes[country_code] = df
            print(f"Loaded {country_code}: {len(df)} rows")
        else:
            print(f"Warning: {filepath} not found")
    
    return dataframes

def setup_countries():
    """Create or update countries in the database."""
    print("\n=== Setting up countries ===")
    
    for code, info in COUNTRY_MAPPING.items():
        try:
            # Check if country exists
            result = supabase.table('countries').select('*').eq('iso_code', code).execute()
            
            if result.data:
                print(f"Country {info['name']} already exists")
            else:
                # Insert country
                data = {
                    'name': info['name'],
                    'iso_code': code
                }
                supabase.table('countries').insert(data).execute()
                print(f"Created country: {info['name']}")
        except Exception as e:
            print(f"Error with country {code}: {e}")

def setup_indicators():
    """Create or update indicators in the database."""
    print("\n=== Setting up indicators ===")
    
    unique_indicators = {}
    for col, info in INDICATOR_MAPPING.items():
        code = info['code']
        if code not in unique_indicators:
            unique_indicators[code] = info
    
    for code, info in unique_indicators.items():
        try:
            # Check if indicator exists
            result = supabase.table('indicators').select('*').eq('code', code).execute()
            
            if result.data:
                print(f"Indicator {info['label']} already exists")
            else:
                # Insert indicator
                data = {
                    'code': code,
                    'label': info['label'],
                    'unit': info['unit']
                }
                supabase.table('indicators').insert(data).execute()
                print(f"Created indicator: {info['label']}")
        except Exception as e:
            print(f"Error with indicator {code}: {e}")

def upload_time_series(dataframes):
    """Upload time series data for all countries."""
    print("\n=== Uploading time series data ===")
    
    # Get country and indicator mappings from database
    countries = supabase.table('countries').select('*').execute()
    indicators = supabase.table('indicators').select('*').execute()
    
    country_id_map = {c['iso_code']: c['id'] for c in countries.data}
    indicator_id_map = {i['code']: i['id'] for i in indicators.data}
    
    total_rows = 0
    
    for country_code, df in dataframes.items():
        if country_code not in country_id_map:
            print(f"Warning: Country {country_code} not found in database")
            continue
        
        country_id = country_id_map[country_code]
        print(f"\nProcessing {country_code}...")
        
        # Get the country value from the dataframe (should be the ISO code)
        if 'Country' in df.columns:
            # Update Country column to use ISO code consistently
            df['Country'] = country_code
        
        rows_to_insert = []
        
        for _, row in df.iterrows():
            year = int(row['Year'])
            
            # Process each indicator column
            for col in df.columns:
                if col in ['Country', 'Year']:
                    continue
                
                # Check if this column is mapped to an indicator
                if col in INDICATOR_MAPPING:
                    indicator_code = INDICATOR_MAPPING[col]['code']
                    
                    if indicator_code in indicator_id_map:
                        value = row[col]
                        
                        # Skip null/empty values
                        if pd.isna(value) or value == '':
                            continue
                        
                        # Convert to float
                        try:
                            value = float(value)
                        except (ValueError, TypeError):
                            continue
                        
                        rows_to_insert.append({
                            'country_id': country_id,
                            'indicator_id': indicator_id_map[indicator_code],
                            'year': year,
                            'value': value
                        })
        
        # Insert in batches
        batch_size = 100
        for i in range(0, len(rows_to_insert), batch_size):
            batch = rows_to_insert[i:i+batch_size]
            try:
                supabase.table('time_series').insert(batch).execute()
                total_rows += len(batch)
                print(f"  Inserted {len(batch)} rows (total: {total_rows})")
            except Exception as e:
                print(f"  Error inserting batch: {e}")
    
    print(f"\n✓ Total rows inserted: {total_rows}")

def main():
    """Main execution function."""
    print("=" * 60)
    print("Supabase Data Upload Script")
    print("=" * 60)
    
    # Load CSV files
    dataframes = load_csv_files()
    
    if not dataframes:
        print("No data files found!")
        return
    
    # Setup countries and indicators
    setup_countries()
    setup_indicators()
    
    # Upload time series data
    upload_time_series(dataframes)
    
    print("\n" + "=" * 60)
    print("Upload complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()
