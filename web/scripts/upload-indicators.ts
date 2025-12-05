import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { indicators } from '../data/indicators';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadIndicators() {
  console.log('Uploading indicators to Supabase...\n');

  // First check what columns exist
  const { data: existingData, error: checkError } = await supabase
    .from('indicators')
    .select('*')
    .limit(1);

  if (checkError) {
    console.error('Error checking indicators table:', checkError);
  } else {
    console.log('Existing table structure:', existingData);
  }

  const indicatorRecords = indicators.map(ind => ({
    id: ind.id,
    code: ind.code,
    label: ind.label,
    unit: ind.unit
  }));

  const { error } = await supabase
    .from('indicators')
    .upsert(indicatorRecords, {
      onConflict: 'id',
      ignoreDuplicates: false
    });

  if (error) {
    console.error('Error uploading indicators:', error);
    process.exit(1);
  }

  console.log(`✓ Successfully uploaded ${indicatorRecords.length} indicators!`);
  console.log('\nIndicators uploaded:');
  indicatorRecords.forEach(ind => {
    console.log(`  - ${ind.id}: ${ind.label} (${ind.code})`);
  });
}

uploadIndicators().catch(console.error);
