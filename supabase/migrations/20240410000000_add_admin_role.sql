-- Add role column to auth.users if it doesn't exist
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view admin_users table
CREATE POLICY "Allow admins to view admin_users"
  ON admin_users
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');

-- Function to set user as admin
CREATE OR REPLACE FUNCTION make_user_admin(user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Update auth.users role
  UPDATE auth.users SET role = 'admin' WHERE id = user_id;
  
  -- Add to admin_users table
  INSERT INTO admin_users (id) VALUES (user_id)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;