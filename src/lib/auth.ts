// Mock authentication service for frontend demo
// In production, this would make API calls to a backend server

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'customer' | 'provider';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceProvider {
  _id: string;
  userId: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  location: string;
  services: string[];
  specialties: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  totalEarnings: number;
  isVerified: boolean;
  isActive: boolean;
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  portfolio: string[];
  certifications: string[];
  languages: string[];
  priceRange: {
    min: number;
    max: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Simple password hashing for demo (not secure for production)
function simpleHash(password: string): string {
  return btoa(password + 'salt'); // Base64 encoding for demo
}

function verifyPassword(password: string, hash: string): boolean {
  return simpleHash(password) === hash;
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export class AuthService {
  private getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  private getProviders(): ServiceProvider[] {
    const providers = localStorage.getItem('service_providers');
    return providers ? JSON.parse(providers) : this.getDefaultProviders();
  }

  private saveProviders(providers: ServiceProvider[]): void {
    localStorage.setItem('service_providers', JSON.stringify(providers));
  }

  private getDefaultProviders(): ServiceProvider[] {
    return [
      {
        _id: "provider1",
        userId: "user1",
        businessName: "Crowned Beauty",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah@crownedbeauty.com",
        phone: "+44 20 7123 4567",
        bio: "Professional hairstylist specializing in natural hair care and protective styling with over 8 years of experience.",
        location: "Westminster, London",
        services: ["Hair", "Styling"],
        specialties: ["Natural Hair", "Protective Styling", "Silk Press", "Hair Treatments"],
        experience: 8,
        rating: 4.9,
        totalReviews: 127,
        totalEarnings: 15420.00,
        isVerified: true,
        isActive: true,
        availability: {
          monday: { start: "09:00", end: "18:00", available: true },
          tuesday: { start: "09:00", end: "18:00", available: true },
          wednesday: { start: "09:00", end: "18:00", available: true },
          thursday: { start: "09:00", end: "18:00", available: true },
          friday: { start: "09:00", end: "20:00", available: true },
          saturday: { start: "08:00", end: "16:00", available: true },
          sunday: { start: "10:00", end: "15:00", available: false }
        },
        portfolio: [
          "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg",
          "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg"
        ],
        certifications: ["City & Guilds Hair Professional", "Trichology Certificate"],
        languages: ["English", "French"],
        priceRange: { min: 45, max: 150 },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: "provider2",
        userId: "user2",
        businessName: "ITSMBEAUTY",
        firstName: "Maya",
        lastName: "Patel",
        email: "maya@itsmbeauty.com",
        phone: "+44 20 7234 5678",
        bio: "Certified makeup artist and beauty specialist. Expert in bridal makeup, special events, and beauty consultations.",
        location: "Chelmsford, UK",
        services: ["Makeup", "Beauty"],
        specialties: ["Bridal Makeup", "Special Events", "Beauty Consultations", "Skincare"],
        experience: 6,
        rating: 4.8,
        totalReviews: 89,
        totalEarnings: 12350.00,
        isVerified: true,
        isActive: true,
        availability: {
          monday: { start: "10:00", end: "19:00", available: true },
          tuesday: { start: "10:00", end: "19:00", available: true },
          wednesday: { start: "10:00", end: "19:00", available: false },
          thursday: { start: "10:00", end: "19:00", available: true },
          friday: { start: "09:00", end: "21:00", available: true },
          saturday: { start: "08:00", end: "18:00", available: true },
          sunday: { start: "10:00", end: "16:00", available: true }
        },
        portfolio: [
          "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg",
          "https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg"
        ],
        certifications: ["VTCT Makeup Artistry", "Beauty Therapy Diploma"],
        languages: ["English", "Hindi", "Gujarati"],
        priceRange: { min: 35, max: 200 },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: "provider3",
        userId: "user3",
        businessName: "KDHAIR",
        firstName: "Kemi",
        lastName: "Davies",
        email: "kemi@kdhair.com",
        phone: "+44 161 234 5678",
        bio: "Specialist in Afro-Caribbean hair care, extensions, and creative styling. Passionate about healthy hair growth.",
        location: "Manchester, UK",
        services: ["Hair", "Extensions"],
        specialties: ["Afro Hair", "Extensions", "Braiding", "Hair Growth Treatments"],
        experience: 10,
        rating: 4.9,
        totalReviews: 203,
        totalEarnings: 18750.00,
        isVerified: true,
        isActive: true,
        availability: {
          monday: { start: "09:00", end: "17:00", available: true },
          tuesday: { start: "09:00", end: "17:00", available: true },
          wednesday: { start: "09:00", end: "17:00", available: true },
          thursday: { start: "09:00", end: "19:00", available: true },
          friday: { start: "09:00", end: "19:00", available: true },
          saturday: { start: "08:00", end: "18:00", available: true },
          sunday: { start: "11:00", end: "16:00", available: false }
        },
        portfolio: [
          "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg"
        ],
        certifications: ["NVQ Level 3 Hairdressing", "Extension Specialist Certificate"],
        languages: ["English"],
        priceRange: { min: 40, max: 180 },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: "provider4",
        userId: "user4",
        businessName: "The Tail Bandit",
        firstName: "Zara",
        lastName: "Ahmed",
        email: "zara@thetailbandit.com",
        phone: "+44 113 234 5678",
        bio: "Creative hairstylist specializing in ponytails, sew-ins, and quick weaves. Making hair dreams come true!",
        location: "Leeds, UK",
        services: ["Hair", "Styling"],
        specialties: ["Ponytails", "Sew-ins", "Quick Weaves", "Hair Styling"],
        experience: 5,
        rating: 4.7,
        totalReviews: 156,
        totalEarnings: 9850.00,
        isVerified: true,
        isActive: true,
        availability: {
          monday: { start: "10:00", end: "18:00", available: true },
          tuesday: { start: "10:00", end: "18:00", available: true },
          wednesday: { start: "10:00", end: "18:00", available: false },
          thursday: { start: "10:00", end: "18:00", available: true },
          friday: { start: "10:00", end: "20:00", available: true },
          saturday: { start: "09:00", end: "17:00", available: true },
          sunday: { start: "12:00", end: "17:00", available: true }
        },
        portfolio: [
          "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg"
        ],
        certifications: ["Hair Styling Certificate"],
        languages: ["English", "Urdu"],
        priceRange: { min: 25, max: 120 },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async registerUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
      const users = this.getUsers();
      
      // Check if user already exists
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = simpleHash(userData.password);

      const newUser: User = {
        _id: generateId(),
        ...userData,
        password: hashedPassword,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      users.push(newUser);
      this.saveUsers(users);
      
      // If provider, also create provider profile
      if (userData.userType === 'provider') {
        const providers = this.getProviders();
        
        const providerData: ServiceProvider = {
          _id: generateId(),
          userId: newUser._id,
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
        
        providers.push(providerData);
        this.saveProviders(providers);
      }

      return { success: true, userId: newUser._id };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.email === email);

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
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex !== -1) {
        users[userIndex].isEmailVerified = true;
        users[userIndex].updatedAt = new Date();
        this.saveUsers(users);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  async updateProviderProfile(userId: string, profileData: Partial<ServiceProvider>) {
    try {
      const providers = this.getProviders();
      const providerIndex = providers.findIndex(p => p.userId === userId);
      
      if (providerIndex !== -1) {
        providers[providerIndex] = {
          ...providers[providerIndex],
          ...profileData,
          updatedAt: new Date()
        };
        this.saveProviders(providers);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async getProviderById(providerId: string) {
    try {
      const providers = this.getProviders();
      return providers.find(p => p._id === providerId) || null;
    } catch (error) {
      console.error('Get provider error:', error);
      throw error;
    }
  }

  async getProviderByUserId(userId: string) {
    try {
      const providers = this.getProviders();
      return providers.find(p => p.userId === userId) || null;
    } catch (error) {
      console.error('Get provider by user ID error:', error);
      throw error;
    }
  }

  async getAllServiceProviders() {
    try {
      const providers = this.getProviders();
      return providers.filter(p => p.isActive);
    } catch (error) {
      console.error('Get all providers error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();