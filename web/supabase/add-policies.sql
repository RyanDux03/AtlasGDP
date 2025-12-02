-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON predictions;
DROP POLICY IF EXISTS "Allow anon insert/update" ON predictions;
DROP POLICY IF EXISTS "Allow authenticated insert/update" ON predictions;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON predictions
  FOR SELECT USING (true);

-- Create policy to allow anonymous insert/update (for data upload)
CREATE POLICY "Allow anon insert/update" ON predictions
  FOR ALL USING (true);
