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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_predictions_country_indicator ON predictions(country_id, indicator_id);
CREATE INDEX IF NOT EXISTS idx_predictions_year ON predictions(year);

-- Enable Row Level Security
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON predictions
  FOR SELECT USING (true);

-- Create policy to allow anonymous insert/update (for data upload)
CREATE POLICY "Allow anon insert/update" ON predictions
  FOR ALL USING (true);
z