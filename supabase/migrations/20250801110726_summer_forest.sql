/*
  # Create users and service providers tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `password_hash` (text)
      - `user_type` (text, enum: customer/provider)
      - `is_email_verified` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `service_providers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `business_name` (text)
      - `bio` (text)
      - `location` (text)
      - `phone` (text)
      - `profile_picture` (text)
      - `services` (text array)
      - `specialties` (text array)
      - `experience` (integer, default 0)
      - `rating` (decimal, default 0)
      - `total_reviews` (integer, default 0)
      - `total_earnings` (decimal, default 0)
      - `is_verified` (boolean, default false)
      - `is_active` (boolean, default true)
      - `portfolio` (text array)
      - `certifications` (text array)
      - `languages` (text array, default ['English'])
      - `price_range_min` (decimal, default 0)
      - `price_range_max` (decimal, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to service providers
*/

-- Create custom types
CREATE TYPE user_type_enum AS ENUM ('customer', 'provider');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  user_type user_type_enum NOT NULL,
  is_email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  bio text DEFAULT '',
  location text DEFAULT '',
  phone text,
  profile_picture text,
  services text[] DEFAULT '{}',
  specialties text[] DEFAULT '{}',
  experience integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  total_earnings decimal(10,2) DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  portfolio text[] DEFAULT '{}',
  certifications text[] DEFAULT '{}',
  languages text[] DEFAULT ARRAY['English'],
  price_range_min decimal(10,2) DEFAULT 0,
  price_range_max decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policies for service_providers table
CREATE POLICY "Anyone can read active service providers"
  ON service_providers
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Providers can read own data"
  ON service_providers
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Providers can update own data"
  ON service_providers
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Providers can insert own data"
  ON service_providers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_location ON service_providers(location);
CREATE INDEX IF NOT EXISTS idx_service_providers_rating ON service_providers(rating);
CREATE INDEX IF NOT EXISTS idx_service_providers_is_active ON service_providers(is_active);

-- Insert sample data
INSERT INTO users (id, first_name, last_name, email, password_hash, user_type, is_email_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Johnson', 'sarah@crownedbeauty.com', '$2a$10$example_hash_1', 'provider', true),
('550e8400-e29b-41d4-a716-446655440002', 'Maya', 'Patel', 'maya@itsmbeauty.com', '$2a$10$example_hash_2', 'provider', true),
('550e8400-e29b-41d4-a716-446655440003', 'Kemi', 'Davies', 'kemi@kdhair.com', '$2a$10$example_hash_3', 'provider', true),
('550e8400-e29b-41d4-a716-446655440004', 'Zara', 'Ahmed', 'zara@thetailbandit.com', '$2a$10$example_hash_4', 'provider', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO service_providers (user_id, business_name, bio, location, phone, services, specialties, experience, rating, total_reviews, total_earnings, is_verified, is_active, portfolio, certifications, languages, price_range_min, price_range_max) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Crowned Beauty', 'Professional hairstylist specializing in natural hair care and protective styling with over 8 years of experience.', 'Westminster, London', '+44 20 7123 4567', ARRAY['Hair', 'Styling'], ARRAY['Natural Hair', 'Protective Styling', 'Silk Press', 'Hair Treatments'], 8, 4.9, 127, 15420.00, true, true, ARRAY['https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg', 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg'], ARRAY['City & Guilds Hair Professional', 'Trichology Certificate'], ARRAY['English', 'French'], 45, 150),
('550e8400-e29b-41d4-a716-446655440002', 'ITSMBEAUTY', 'Certified makeup artist and beauty specialist. Expert in bridal makeup, special events, and beauty consultations.', 'Chelmsford, UK', '+44 20 7234 5678', ARRAY['Makeup', 'Beauty'], ARRAY['Bridal Makeup', 'Special Events', 'Beauty Consultations', 'Skincare'], 6, 4.8, 89, 12350.00, true, true, ARRAY['https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg', 'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg'], ARRAY['VTCT Makeup Artistry', 'Beauty Therapy Diploma'], ARRAY['English', 'Hindi', 'Gujarati'], 35, 200),
('550e8400-e29b-41d4-a716-446655440003', 'KDHAIR', 'Specialist in Afro-Caribbean hair care, extensions, and creative styling. Passionate about healthy hair growth.', 'Manchester, UK', '+44 161 234 5678', ARRAY['Hair', 'Extensions'], ARRAY['Afro Hair', 'Extensions', 'Braiding', 'Hair Growth Treatments'], 10, 4.9, 203, 18750.00, true, true, ARRAY['https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg'], ARRAY['NVQ Level 3 Hairdressing', 'Extension Specialist Certificate'], ARRAY['English'], 40, 180),
('550e8400-e29b-41d4-a716-446655440004', 'The Tail Bandit', 'Creative hairstylist specializing in ponytails, sew-ins, and quick weaves. Making hair dreams come true!', 'Leeds, UK', '+44 113 234 5678', ARRAY['Hair', 'Styling'], ARRAY['Ponytails', 'Sew-ins', 'Quick Weaves', 'Hair Styling'], 5, 4.7, 156, 9850.00, true, true, ARRAY['https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg'], ARRAY['Hair Styling Certificate'], ARRAY['English', 'Urdu'], 25, 120)
ON CONFLICT DO NOTHING;