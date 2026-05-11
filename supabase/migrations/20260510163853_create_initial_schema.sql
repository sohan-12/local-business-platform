/*
  # Create Yelp-like database schema

  1. New Tables
    - `users` - User profiles
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    
    - `businesses` - Business listings
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `phone` (text)
      - `website` (text)
      - `image_url` (text)
      - `rating` (numeric, computed average)
      - `review_count` (integer)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `reviews` - User reviews
      - `id` (uuid, primary key)
      - `business_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `rating` (integer, 1-5)
      - `title` (text)
      - `content` (text)
      - `helpful_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for businesses and reviews
    - Users can create/update their own reviews
    - Users can update their own profile
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text,
  phone text,
  website text,
  image_url text,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  latitude numeric,
  longitude numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  content text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, user_id)
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Public can read businesses"
  ON businesses FOR SELECT
  USING (true);

CREATE POLICY "Public can read reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_reviews_business ON reviews(business_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
