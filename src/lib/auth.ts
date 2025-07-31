import { User, Provider } from '../types/user';

// Mock database using localStorage
class MockDatabase {
  private getUsers(): User[] {
    const users = localStorage.getItem('rooted_users');
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem('rooted_users', JSON.stringify(users));
  }

  private getProviders(): Provider[] {
    const providers = localStorage.getItem('rooted_providers');
    return providers ? JSON.parse(providers) : [];
  }

  private saveProviders(providers: Provider[]): void {
    localStorage.setItem('rooted_providers', JSON.stringify(providers));
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      _id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(newUser);
    this.saveUsers(users);
    
    return newUser._id;
  }

  async createProvider(providerData: Omit<Provider, 'createdAt' | 'updatedAt'>): Promise<void> {
    const providers = this.getProviders();
    const newProvider: Provider = {
      ...providerData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    providers.push(newProvider);
    this.saveProviders(providers);
  }

  async updateUser(email: string, updates: Partial<User>): Promise<void> {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.email === email);
    
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date()
      };
      this.saveUsers(users);
    }
  }

  async updateProvider(userId: string, updates: Partial<Provider>): Promise<void> {
    const providers = this.getProviders();
    const providerIndex = providers.findIndex(provider => provider._id === userId);
    
    if (providerIndex !== -1) {
      providers[providerIndex] = {
        ...providers[providerIndex],
        ...updates,
        updatedAt: new Date()
      };
      this.saveProviders(providers);
    }
  }

  async getProviderById(providerId: string): Promise<Provider | null> {
    const providers = this.getProviders();
    return providers.find(provider => provider._id === providerId) || null;
  }
}

// Simple password hashing for demo (not secure for production)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

function verifyPassword(password: string, hash: string): boolean {
  return simpleHash(password) === hash;
}

export class AuthService {
  private db = new MockDatabase();

  async registerUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Check if user already exists
      const existingUser = await this.db.findUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = simpleHash(userData.password);

      const newUserData = {
        ...userData,
        password: hashedPassword,
        isEmailVerified: false
      };

      const userId = await this.db.createUser(newUserData);
      
      // If provider, also create provider profile
      if (userData.userType === 'provider') {
        const providerData: Omit<Provider, 'createdAt' | 'updatedAt'> = {
          ...newUserData,
          _id: userId,
          services: [],
          rating: 0,
          totalReviews: 0,
          totalEarnings: 0,
          isVerified: false
        };
        await this.db.createProvider(providerData);
      }

      return { success: true, userId };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await this.db.findUserByEmail(email);

      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = verifyPassword(password, user.password);
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
      await this.db.updateUser(email, { 
        isEmailVerified: true
      });
      return { success: true };
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  async updateProviderProfile(userId: string, profileData: Partial<Provider>) {
    try {
      await this.db.updateProvider(userId, profileData);
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async getProviderById(providerId: string) {
    try {
      return await this.db.getProviderById(providerId);
    } catch (error) {
      console.error('Get provider error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();