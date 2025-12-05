import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');
let supabaseUrl = '';
let supabaseAnonKey = '';

for (const line of envLines) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].replace(/"/g, '');
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseAnonKey = line.split('=')[1].replace(/"/g, '');
  }
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PredictionRow {
  country: string;
  year: number;
  actual_gdp: number | null;
  predicted_gdp: number | null;
  is_test: number;
  is_forecast: number;
}

async function parseCsv(filePath: string): Promise<PredictionRow[]> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      country: values[0],
      year: parseInt(values[1]),
      actual_gdp: values[2] ? parseFloat(values[2]) : null,
      predicted_gdp: values[3] ? parseFloat(values[3]) : null,
      is_test: parseInt(values[4]),
      is_forecast: parseInt(values[5])
    };
  });
}

async function uploadPredictions() {
  try {
    console.log('Starting prediction data upload...');

    // Parse both CSV files
    const predictions1 = await parseCsv(path.join(__dirname, '../../data/predictions_for_frontend.csv'));
    const predictions2 = await parseCsv(path.join(__dirname, '../../data/USA_predictions_for_frontend.csv'));
    
    const allPredictions = [...predictions1, ...predictions2];
    
    console.log(`Total predictions to upload: ${allPredictions.length}`);

    // Get country mappings
    const { data: countries, error: countryError } = await supabase
      .from('countries')
      .select('id, iso_code');
    
    if (countryError) {
      console.error('Error fetching countries:', countryError);
      return;
    }

    const countryMap = new Map(countries.map(c => [c.iso_code, c.id]));
    
    // Map country codes from CSV to database iso_codes
    const countryCodeMap: Record<string, string> = {
      'IND': 'IND',
      'DEU': 'DEU', 
      'ARE': 'UAE',
      'CHN': 'CHN',
      'USA': 'USA'
    };

    // Get GDP indicator ID
    const { data: indicators, error: indicatorError } = await supabase
      .from('indicators')
      .select('id, code')
      .eq('code', 'gdp');
    
    if (indicatorError || !indicators || indicators.length === 0) {
      console.error('Error fetching GDP indicator:', indicatorError);
      console.log('Indicators found:', indicators);
      return;
    }

    const gdpIndicatorId = indicators[0].id;
    console.log(`GDP Indicator ID: ${gdpIndicatorId}`);

    // Prepare prediction records
    const predictionRecords = allPredictions.map(pred => {
      const countryCode = countryCodeMap[pred.country] || pred.country;
      const countryId = countryMap.get(countryCode);
      
      if (!countryId) {
        console.warn(`Country not found: ${pred.country} (${countryCode})`);
        return null;
      }

      return {
        country_id: countryId,
        indicator_id: gdpIndicatorId,
        year: pred.year,
        actual_value: pred.actual_gdp,
        predicted_value: pred.predicted_gdp,
        is_test: pred.is_test === 1,
        is_forecast: pred.is_forecast === 1
      };
    }).filter(Boolean);

    console.log(`Prepared ${predictionRecords.length} prediction records`);

    // Insert in batches
    const batchSize = 100;
    for (let i = 0; i < predictionRecords.length; i += batchSize) {
      const batch = predictionRecords.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('predictions')
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

    console.log('Upload complete!');
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

uploadPredictions();
