# GDP Predictions Data Upload

## Step 1: Create the Predictions Table in Supabase

1. Go to your Supabase dashboard: https://fpkcdjdearsgmjbrtkkv.supabase.co
2. Navigate to the SQL Editor
3. Run the following SQL query:

```sql
-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id BIGSERIAL PRIMARY KEY,
  country_id BIGINT NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  indicator_id BIGINT NOT NULL REFERENCES indicators(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  actual_value DOUBLE PRECISION,
  predicted_value DOUBLE PRECISION,
  is_test BOOLEAN DEFAULT FALSE,
  is_forecast BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(country_id, indicator_id, year)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_predictions_country_indicator ON predictions(country_id, indicator_id);
CREATE INDEX IF NOT EXISTS idx_predictions_year ON predictions(year);

-- Enable Row Level Security
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON predictions
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update
CREATE POLICY "Allow authenticated insert/update" ON predictions
  FOR ALL USING (auth.role() = 'authenticated');
```

## Step 2: Upload the Prediction Data

After creating the table, run:

```bash
cd web
npm run upload-predictions
```

This will upload:
- 200 prediction records for 5 countries (India, Germany, UAE, China, USA)
- Historical data (1990-2017)
- Test data (2018-2024) - includes both actual and predicted values  
- Forecast data (2025-2029) - predicted values only

## Step 3: View the Predictions

The predictor page will now display:
- **Blue solid line**: Actual GDP values
- **Red dashed line**: Predicted GDP values

The prediction line will show:
- Historical predictions (test period 2018-2024) overlaid with actual values
- Future forecasts (2025-2029) extending beyond actual data
