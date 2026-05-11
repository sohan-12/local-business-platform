/*
  # Add admin and authentication features

  1. Modified Tables
    - `users` - Add admin flag and auth fields
      - `auth_id` (uuid, from Supabase auth)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamp)

  2. New Tables
    - `admin_users` - Admin-specific settings
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `dashboard_access` (boolean)
      - `can_manage_businesses` (boolean)
      - `can_manage_users` (boolean)
      - `can_view_analytics` (boolean)

  3. Security
    - RLS policies for admin access
    - Only admins can manage businesses
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'auth_id'
  ) THEN
    ALTER TABLE users ADD COLUMN auth_id uuid;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE users ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  dashboard_access boolean DEFAULT true,
  can_manage_businesses boolean DEFAULT true,
  can_manage_users boolean DEFAULT true,
  can_view_analytics boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their own admin settings"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can update admin settings"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can insert new admins"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can delete admin access"
  ON admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own profile" ON users;

CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_id);

CREATE POLICY "Admins can read all user profiles"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users AS u WHERE u.id = auth.uid() AND u.is_admin = true
    )
  );

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_is_admin ON users(is_admin);
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
