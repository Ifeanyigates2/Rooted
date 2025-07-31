import bcrypt from 'bcryptjs';
import { getUsersCollection, getServiceProvidersCollection, ServiceProvider } from './mongodb';
import { User, Provider } from '../types/user';

// Simple password hashing for demo (not secure for production)
function simpleHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export class AuthService {
  async registerUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
      const usersCollection = await getUsersCollection();
      
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = simpleHash(userData.password);

      const newUserData = {
        ...userData,
        password: hashedPassword,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await usersCollection.insertOne(newUserData);
      const userId = result.insertedId.toString();
      
      // If provider, also create provider profile in service_providers collection
      if (userData.userType === 'provider') {
        const serviceProvidersCollection = await getServiceProvidersCollection();
        
        const providerData: Omit<ServiceProvider, '_id'> = {
          userId: userId,
          businessName: `${userData.firstName} ${userData.lastName}`,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          bio: '',
          location: '',
          services: [],
          specialties: [],
          experience: 0,
          rating: 0,
          totalReviews: 0,
          totalEarnings: 0,
          isVerified: false,
          isActive: true,
          availability: {
            monday: { start: "09:00", end: "17:00", available: true },
            tuesday: { start: "09:00", end: "17:00", available: true },
            wednesday: { start: "09:00", end: "17:00", available: true },
            thursday: { start: "09:00", end: "17:00", available: true },
            friday: { start: "09:00", end: "17:00", available: true },
            saturday: { start: "09:00", end: "17:00", available: false },
            sunday: { start: "09:00", end: "17:00", available: false }
          },
          portfolio: [],
          certifications: [],
          languages: ['English'],
          priceRange: { min: 0, max: 0 },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await serviceProvidersCollection.insertOne(providerData);
      }

      return { success: true, userId };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const usersCollection = await getUsersCollection();
      const user = await usersCollection.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = verifyPassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: { ...userWithoutPassword, _id: user._id.toString() } };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async verifyEmail(email: string) {
    try {
      const usersCollection = await getUsersCollection();
      await usersCollection.updateOne(
        { email },
        { 
          $set: { 
            isEmailVerified: true,
            updatedAt: new Date()
          }
        }
      );
      return { success: true };
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  async updateProviderProfile(userId: string, profileData: Partial<ServiceProvider>) {
    try {
      const serviceProvidersCollection = await getServiceProvidersCollection();
      await serviceProvidersCollection.updateOne(
        { userId },
        { 
          $set: { 
            ...profileData,
            updatedAt: new Date()
          }
        }
      );
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async getProviderById(providerId: string) {
    try {
      const serviceProvidersCollection = await getServiceProvidersCollection();
      return await serviceProvidersCollection.findOne({ _id: providerId });
    } catch (error) {
      console.error('Get provider error:', error);
      throw error;
    }
  }

  async getProviderByUserId(userId: string) {
    try {
      const serviceProvidersCollection = await getServiceProvidersCollection();
      return await serviceProvidersCollection.findOne({ userId });
    } catch (error) {
      console.error('Get provider by user ID error:', error);
      throw error;
    }
  }

  async getAllServiceProviders() {
    try {
      const serviceProvidersCollection = await getServiceProvidersCollection();
      return await serviceProvidersCollection.find({ isActive: true }).toArray();
    } catch (error) {
      console.error('Get all providers error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();