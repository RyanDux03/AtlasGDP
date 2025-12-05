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

async function checkDatabase() {
  console.log('Checking countries...');
  const { data: countries, error: countryError } = await supabase
    .from('countries')
    .select('*')
    .limit(10);
  
  if (countryError) {
    console.error('Country error:', countryError);
  } else {
    console.log('Countries:', countries);
  }

  console.log('\nChecking indicators...');
  const { data: indicators, error: indicatorError } = await supabase
    .from('indicators')
    .select('*')
    .limit(10);
  
  if (indicatorError) {
    console.error('Indicator error:', indicatorError);
  } else {
    console.log('Indicators:', indicators);
  }
}

checkDatabase();
