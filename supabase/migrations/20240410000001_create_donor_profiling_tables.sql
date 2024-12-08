-- Create donor_profiles table
CREATE TABLE donor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  engagement_score NUMERIC NOT NULL DEFAULT 0,
  engagement_level TEXT NOT NULL DEFAULT 'Low',
  donation_frequency INTEGER DEFAULT 0,
  total_donations NUMERIC DEFAULT 0,
  last_donation_date TIMESTAMPTZ,
  preferred_campaigns TEXT[] DEFAULT ARRAY[]::TEXT[],
  risk_of_churn NUMERIC DEFAULT 0,
  next_predicted_donation NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create donor_analytics table
CREATE TABLE donor_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_donors INTEGER DEFAULT 0,
  average_donation NUMERIC DEFAULT 0,
  donor_retention_rate NUMERIC DEFAULT 0,
  new_donors_this_month INTEGER DEFAULT 0,
  top_donors JSONB DEFAULT '[]'::JSONB,
  donation_by_category JSONB DEFAULT '{}'::JSONB,
  monthly_trends JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_analytics ENABLE ROW LEVEL SECURITY;

-- Only admins can view donor profiles
CREATE POLICY "Allow admins to view donor profiles"
  ON donor_profiles
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');

-- Only admins can view analytics
CREATE POLICY "Allow admins to view analytics"
  ON donor_analytics
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');

-- Function to update donor profiles
CREATE OR REPLACE FUNCTION update_donor_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate engagement score based on donation amount and frequency
  UPDATE donor_profiles
  SET 
    total_donations = (
      SELECT COALESCE(SUM(donation_amount), 0)
      FROM donors
      WHERE user_id = NEW.user_id
    ),
    donation_frequency = (
      SELECT COUNT(*)
      FROM donors
      WHERE user_id = NEW.user_id
    ),
    last_donation_date = NOW(),
    updated_at = NOW(),
    engagement_level = CASE 
      WHEN NEW.donation_amount >= 1000 THEN 'High'
      WHEN NEW.donation_amount >= 500 THEN 'Medium'
      ELSE 'Low'
    END
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update donor profiles on new donations
CREATE TRIGGER update_donor_profile_trigger
  AFTER INSERT ON donors
  FOR EACH ROW
  EXECUTE FUNCTION update_donor_profile();