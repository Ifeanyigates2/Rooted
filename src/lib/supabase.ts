import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  user_type: 'customer' | 'provider';
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;
  bio: string;
  location: string;
  phone?: string;
  profile_picture?: string;
  services: string[];
  specialties: string[];
  experience: number;
  rating: number;
  total_reviews: number;
  total_earnings: number;
  is_verified: boolean;
  is_active: boolean;
  portfolio: string[];
  certifications: string[];
  languages: string[];
  price_range_min: number;
  price_range_max: number;
  created_at: string;
  updated_at: string;
}