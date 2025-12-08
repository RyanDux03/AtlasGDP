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
  'ARE': 'United Arab Emirates',
  'USA': 'USA'
};

// Model mapping to table names
const modelMapping: { [key: string]: string } = {
  'lr_predictions.csv': 'predictions_lr',
  'rf_predictions.csv': 'predictions_rf',
  'hybrid_predictions.csv': 'predictions_hybrid'
};

interface PredictionRow {
  country: string;
  year: string;
  actual_gdp: string;
  predicted_gdp: string;
  is_test: string;
  is_forecast: string;
}

function parseCSV(content: string): PredictionRow[] {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    return row as unknown as PredictionRow;
  });
}

function parseValue(value: string): number | null {
  if (!value || value === '' || value === 'NA' || value === 'NaN') {
    return null;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

async function uploadPredictions() {
  console.log('Starting predictions upload...\n');

  // First check what columns exist in predictions table
  const { data: existingData, error: checkError } = await supabase
    .from('predictions')
    .select('*')
    .limit(1);

  if (checkError) {
    console.error('Error checking predictions table:', checkError);
  } else {
    console.log('Existing predictions table structure:', existingData);
  }

  const dataDir = path.join(__dirname, '../../data/prediction data');
  const files = ['lr_predictions.csv', 'rf_predictions.csv', 'hybrid_predictions.csv'];

  // Get country IDs
  const { data: countries, error: countriesError } = await supabase
    .from('countries')
    .select('id, name');

  if (countriesError) {
    console.error('Error fetching countries:', countriesError);
    return;
  }

  console.log('Found countries:', countries);

  // First, create indicator entries for the prediction models
  const predictionIndicators = [
    { id: 101, code: 'gdp_pred_lr', label: 'GDP Prediction (Linear Regression)', unit: 'USD (billions)' },
    { id: 102, code: 'gdp_pred_rf', label: 'GDP Prediction (Random Forest)', unit: 'USD (billions)' },
    { id: 103, code: 'gdp_pred_hybrid', label: 'GDP Prediction (Hybrid)', unit: 'USD (billions)' }
  ];

  console.log('\nCreating prediction indicator entries...');
  const { error: indicatorError } = await supabase
    .from('indicators')
    .upsert(predictionIndicators, {
      onConflict: 'id',
      ignoreDuplicates: false
    });

  if (indicatorError) {
    console.error('Error creating prediction indicators:', indicatorError);
    return;
  }
  console.log('✓ Prediction indicators created');

  // GDP indicator ID is 1
  // We'll use indicator IDs 101, 102, 103 for predictions from different models
  const indicatorMapping: { [key: string]: number } = {
    'predictions_lr': 101,
    'predictions_rf': 102,
    'predictions_hybrid': 103
  };

  for (const file of files) {
    const tableName = modelMapping[file];
    const indicatorId = indicatorMapping[tableName];
    
    console.log(`\nProcessing ${file} -> indicator ${indicatorId}...`);

    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const rows = parseCSV(content);

    console.log(`Found ${rows.length} rows`);

    // Prepare prediction records
    const predictionRecords: Array<{
      country_id: number;
      indicator_id: number;
      year: number;
      predicted_value: number;
    }> = [];

    for (const row of rows) {
      const countryCode = row.country;
      const countryName = countryMapping[countryCode];
      
      if (!countryName) {
        console.warn(`Unknown country code: ${countryCode}`);
        continue;
      }

      const country = countries?.find(c => c.name === countryName);
      if (!country) {
        console.warn(`Country not found for ${countryCode}`);
        continue;
      }

      const year = parseInt(row.year);
      const predictedValue = parseValue(row.predicted_gdp);

      if (isNaN(year) || predictedValue === null) {
        continue;
      }

      predictionRecords.push({
        country_id: country.id,
        indicator_id: indicatorId,
        year: year,
        predicted_value: predictedValue
      });
    }

    console.log(`Uploading ${predictionRecords.length} prediction records...`);

    // Upload in batches
    const batchSize = 1000;
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

    console.log(`✓ Completed ${tableName}`);
  }

  console.log('\n✓ All predictions uploaded successfully!');
}

uploadPredictions().catch(console.error);
