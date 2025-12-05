import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Country mapping
const countryMapping: { [key: string]: string } = {
  'CHN': 'China',
  'DEU': 'Germany',
  'IND': 'India',
  'UAE': 'United Arab Emirates',
  'USA': 'USA'
};

interface HistoricalDataRow {
  Country: string;
  Year: string;
  Birth_Rate_per_1000: string;
  Energy_Use_kgOE_per_Capita: string;
  population_total: string;
  Literacy_Rate: string;
  FDI_Net_Inflows_USD: string;
  Political_Instability: string;
  gdp_usd: string;
  gdp_real_growth_pct: string;
  exports_pct_gdp: string;
  imports_pct_gdp: string;
  gross_capital_form_pct_gdp: string;
  household_consump_pct_gdp: string;
  govt_consump_pct_gdp: string;
  inflation_cpi_pct: string;
  unemployment_pct: string;
  net_exports_pct_gdp: string;
  gdp_usd_log: string;
  population_growth_pct: string;
  exports_pct_gdp_lag1: string;
  imports_pct_gdp_lag1: string;
  gross_capital_form_pct_gdp_lag1: string;
  household_consump_pct_gdp_lag1: string;
  govt_consump_pct_gdp_lag1: string;
  inflation_cpi_pct_lag1: string;
  unemployment_pct_lag1: string;
  gdp_real_growth_pct_lag1: string;
}

function parseCSV(content: string): HistoricalDataRow[] {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    return row as unknown as HistoricalDataRow;
  });
}

function parseValue(value: string): number | null {
  if (!value || value === '' || value === 'NA' || value === 'NaN') {
    return null;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

async function uploadHistoricalData() {
  console.log('Starting historical data upload...\n');

  const dataDir = path.join(__dirname, '../../data/historical data');
  const files = ['CHN_data.csv', 'DEU_data.csv', 'IND_data.csv', 'UAE_data.csv', 'USA_data.csv'];

  // First, get country IDs
  const { data: countries, error: countriesError } = await supabase
    .from('countries')
    .select('id, name');

  if (countriesError) {
    console.error('Error fetching countries:', countriesError);
    return;
  }

  console.log('Found countries:', countries);

  // Create a map of indicator codes to IDs from the local indicators data
  const indicatorMap = new Map<string, number>([
    ['NY.GDP.MKTP.CD', 1], // gdp
    ['NY.GDP.MKTP.KD.ZG', 2], // gdp_growth
    ['SP.POP.TOTL', 3], // population
    ['EG.USE.PCAP.KG.OE', 4], // energy_use
    ['PV.PER.RNK.1TO7', 5], // political_stability
    ['NE.EXP.GNFS.ZS', 6], // exports_pct_gdp
    ['NE.IMP.GNFS.ZS', 7], // imports_pct_gdp
    ['FP.CPI.TOTL.ZG', 8], // inflation
    ['SL.UEM.TOTL.ZS', 9], // unemployment
    ['SP.DYN.CBRT.IN', 10], // birth_rate
    ['BX.KLT.DINV.CD.WD', 11], // fdi
    ['SE.ADT.LITR.ZS', 12], // literacy_rate
    ['NE.CON.PRVT.ZS', 15], // household_consumption
    ['NE.CON.GOVT.ZS', 16], // govt_consumption
    ['NE.GDI.TOTL.ZS', 17], // investment
  ]);

  for (const file of files) {
    const countryCode = file.split('_')[0];
    const countryName = countryMapping[countryCode];
    
    console.log(`\nProcessing ${file} (${countryName})...`);

    const country = countries?.find(c => c.name === countryName);
    if (!country) {
      console.error(`Country not found for ${countryCode}`);
      continue;
    }

    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const rows = parseCSV(content);

    console.log(`Found ${rows.length} rows`);

    // Prepare historical data records
    const historicalRecords: Array<{
      country_id: number;
      indicator_id: number;
      year: number;
      value: number;
    }> = [];

    for (const row of rows) {
      const year = parseInt(row.Year);
      if (isNaN(year)) continue;

      // Map each column to its indicator
      const dataPoints = [
        { code: 'NY.GDP.MKTP.CD', value: parseValue(row.gdp_usd) },
        { code: 'NY.GDP.MKTP.KD.ZG', value: parseValue(row.gdp_real_growth_pct) },
        { code: 'NE.EXP.GNFS.ZS', value: parseValue(row.exports_pct_gdp) },
        { code: 'NE.IMP.GNFS.ZS', value: parseValue(row.imports_pct_gdp) },
        { code: 'NE.GDI.TOTL.ZS', value: parseValue(row.gross_capital_form_pct_gdp) },
        { code: 'NE.CON.PRVT.ZS', value: parseValue(row.household_consump_pct_gdp) },
        { code: 'NE.CON.GOVT.ZS', value: parseValue(row.govt_consump_pct_gdp) },
        { code: 'FP.CPI.TOTL.ZG', value: parseValue(row.inflation_cpi_pct) },
        { code: 'SL.UEM.TOTL.ZS', value: parseValue(row.unemployment_pct) },
        { code: 'SP.POP.TOTL', value: parseValue(row.population_total) },
        { code: 'SP.POP.GROW', value: parseValue(row.population_growth_pct) },
        { code: 'SP.DYN.CBRT.IN', value: parseValue(row.Birth_Rate_per_1000) },
        { code: 'EG.USE.PCAP.KG.OE', value: parseValue(row.Energy_Use_kgOE_per_Capita) },
        { code: 'SE.ADT.LITR.ZS', value: parseValue(row.Literacy_Rate) },
        { code: 'BX.KLT.DINV.CD.WD', value: parseValue(row.FDI_Net_Inflows_USD) },
        { code: 'PV.PER.RNK.1TO7', value: parseValue(row.Political_Instability) },
      ];

      for (const { code, value } of dataPoints) {
        const indicatorId = indicatorMap.get(code);
        if (indicatorId && value !== null) {
          historicalRecords.push({
            country_id: country.id,
            indicator_id: indicatorId,
            year: year,
            value: value
          });
        }
      }
    }

    console.log(`Uploading ${historicalRecords.length} historical data points...`);

    // Upload in batches
    const batchSize = 1000;
    for (let i = 0; i < historicalRecords.length; i += batchSize) {
      const batch = historicalRecords.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('time_series')
        .upsert(batch, {
          onConflict: 'country_id,indicator_id,year',
          ignoreDuplicates: false
        });

      if (error) {
        console.error(`Error uploading batch ${i / batchSize + 1}:`, error);
      } else {
        console.log(`Uploaded batch ${i / batchSize + 1} (${batch.length} records)`);
      }
    }

    console.log(`✓ Completed ${countryName}`);
  }

  console.log('\n✓ All historical data uploaded successfully!');
}

uploadHistoricalData().catch(console.error);
