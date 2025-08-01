import { supabase } from './supabase';
import type { User, ServiceProvider } from './supabase';

// Simple password hashing for demo (use proper hashing in production)
function simpleHash(password: string): string {
  return btoa(password + 'salt'); // Base64 encoding for demo
}

function verifyPassword(password: string, hash: string): boolean {
  return simpleHash(password) === hash;
}

export class AuthService {
  async registerUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: 'customer' | 'provider';
  }) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = simpleHash(userData.password);

      // Insert user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          password_hash: hashedPassword,
          user_type: userData.userType,
          is_email_verified: false
        })
        .select()
        .single();

      if (userError) throw userError;

      // If provider, create provider profile
      if (userData.userType === 'provider') {
        const { error: providerError } = await supabase
          .from('service_providers')
          .insert({
            user_id: user.id,
            business_name: `${userData.firstName} ${userData.lastName}`,
            bio: '',
            location: '',
            services: [],
            specialties: [],
            experience: 0,
            rating: 0,
            total_reviews: 0,
            total_earnings: 0,
            is_verified: false,
            is_active: true,
            portfolio: [],
            certifications: [],
            languages: ['English'],
            price_range_min: 0,
            price_range_max: 0
          });

        if (providerError) throw providerError;
      }

      return { success: true, userId: user.id };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        throw new Error('User not found');
      }

      const isPasswordValid = verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Return user without password
      const { password_hash, ...userWithoutPassword } = user;
      return { 
        success: true, 
        user: {
          _id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          userType: user.user_type,
          isEmailVerified: user.is_email_verified,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at)
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async verifyEmail(email: string) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_email_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  async updateProviderProfile(userId: string, profileData: Partial<ServiceProvider>) {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async getProviderById(providerId: string) {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          users!inner(first_name, last_name, email)
        `)
        .eq('id', providerId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get provider error:', error);
      throw error;
    }
  }

  async getProviderByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          users!inner(first_name, last_name, email)
        `)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      if (data) {
        // Transform data to match expected format
        return {
          _id: data.id,
          userId: data.user_id,
          businessName: data.business_name,
          firstName: data.users.first_name,
          lastName: data.users.last_name,
          email: data.users.email,
          phone: data.phone,
          profilePicture: data.profile_picture,
          bio: data.bio,
          location: data.location,
          services: data.services,
          specialties: data.specialties,
          experience: data.experience,
          rating: data.rating,
          totalReviews: data.total_reviews,
          totalEarnings: data.total_earnings,
          isVerified: data.is_verified,
          isActive: data.is_active,
          portfolio: data.portfolio,
          certifications: data.certifications,
          languages: data.languages,
          priceRange: {
            min: data.price_range_min,
            max: data.price_range_max
          },
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Get provider by user ID error:', error);
      throw error;
    }
  }

  async getAllServiceProviders() {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          users!inner(first_name, last_name, email)
        `)
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      
      return data?.map(provider => ({
        _id: provider.id,
        userId: provider.user_id,
        businessName: provider.business_name,
        firstName: provider.users.first_name,
        lastName: provider.users.last_name,
        email: provider.users.email,
        phone: provider.phone,
        profilePicture: provider.profile_picture,
        bio: provider.bio,
        location: provider.location,
        services: provider.services,
        specialties: provider.specialties,
        experience: provider.experience,
        rating: provider.rating,
        totalReviews: provider.total_reviews,
        totalEarnings: provider.total_earnings,
        isVerified: provider.is_verified,
        isActive: provider.is_active,
        portfolio: provider.portfolio,
        certifications: provider.certifications,
        languages: provider.languages,
        priceRange: {
          min: provider.price_range_min,
          max: provider.price_range_max
        },
        createdAt: new Date(provider.created_at),
        updatedAt: new Date(provider.updated_at)
      })) || [];
    } catch (error) {
      console.error('Get all providers error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();