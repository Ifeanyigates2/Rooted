import { getDatabase } from './mongodb';
import bcrypt from 'bcryptjs';
import { User, Provider } from '../types/user';

export class AuthService {
  private async getUsersCollection() {
    const db = await getDatabase();
    return db.collection<User>('users');
  }

  private async getProvidersCollection() {
    const db = await getDatabase();
    return db.collection<Provider>('providers');
  }

  async registerUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
      const users = await this.getUsersCollection();
      
      // Check if user already exists
      const existingUser = await users.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      const newUser: Omit<User, '_id'> = {
        ...userData,
        password: hashedPassword,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await users.insertOne(newUser as User);
      
      // If provider, also create provider profile
      if (userData.userType === 'provider') {
        const providers = await this.getProvidersCollection();
        const providerData: Omit<Provider, '_id'> = {
          ...newUser,
          _id: result.insertedId.toString(),
          services: [],
          rating: 0,
          totalReviews: 0,
          totalEarnings: 0,
          isVerified: false
        };
        await providers.insertOne(providerData as Provider);
      }

      return { success: true, userId: result.insertedId };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const users = await this.getUsersCollection();
      const user = await users.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async verifyEmail(email: string) {
    try {
      const users = await this.getUsersCollection();
      await users.updateOne(
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

  async updateProviderProfile(userId: string, profileData: Partial<Provider>) {
    try {
      const providers = await this.getProvidersCollection();
      await providers.updateOne(
        { _id: userId },
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
      const providers = await this.getProvidersCollection();
      const provider = await providers.findOne({ _id: providerId });
      return provider;
    } catch (error) {
      console.error('Get provider error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();