import { categories, providers, services, users, type Category, type Provider, type Service, type InsertCategory, type InsertProvider, type InsertService, type User, type UpsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, like, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for authentication)
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Providers
  getProviders(): Promise<Provider[]>;
  getProvidersByCategory(categoryId: number): Promise<Provider[]>;
  getTopRatedProviders(limit?: number): Promise<Provider[]>;
  getProviderById(id: number): Promise<Provider | undefined>;
  getProviderByUserId(userId: number): Promise<Provider | undefined>;
  createProvider(provider: InsertProvider): Promise<Provider>;

  // Services
  getServices(): Promise<Service[]>;
  getServicesByProvider(providerId: number): Promise<Service[]>;
  getTrendingServices(limit?: number): Promise<Service[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, updates: Partial<Service>): Promise<Service>;
  deleteService(id: number): Promise<void>;

  // Search
  searchProviders(query: string, location?: string, categoryId?: number): Promise<Provider[]>;
  searchServices(query: string, location?: string, categoryId?: number): Promise<Service[]>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category> = new Map();
  private providers: Map<number, Provider> = new Map();
  private services: Map<number, Service> = new Map();
  private currentCategoryId = 1;
  private currentProviderId = 1;
  private currentServiceId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Categories
    const categoryData = [
      { name: "Hair", slug: "hair", imageUrl: "https://images.unsplash.com/photo-1560869713-7d0ac4c75a60?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Nails", slug: "nails", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Lash", slug: "lash", imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Body", slug: "body", imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Tattoo & Henna", slug: "tattoo-henna", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Makeup", slug: "makeup", imageUrl: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Waxing", slug: "waxing", imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
      { name: "Barber", slug: "barber", imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" },
    ];

    categoryData.forEach(cat => {
      const category: Category = { ...cat, id: this.currentCategoryId++ };
      this.categories.set(category.id, category);
    });

    // Providers
    const providerData = [
      {
        name: "KDHAIR",
        businessName: "KD Hair Studio",
        location: "Leeds, United Kingdom",
        country: "United Kingdom",
        localGovernment: "Leeds",
        imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        rating: "4.9",
        reviewCount: 13,
        startingPrice: "15.00",
        categoryId: 1,
        specialties: ["Natural Hair", "Protective Styles", "Hair Extensions"],
        verified: true,
      },
      {
        name: "Crowned Beauty",
        businessName: "Crowned Beauty Salon",
        location: "Chelmsford, UK",
        country: "United Kingdom",
        localGovernment: "Chelmsford",
        imageUrl: null,
        rating: "4.9",
        reviewCount: 13,
        startingPrice: "12.00",
        categoryId: 1,
        specialties: ["Hair Styling", "Color Treatment"],
        verified: true,
      },
      {
        name: "The Tail Bandit",
        businessName: "The Tail Bandit Studio",
        location: "Newcastle, UK",
        country: "United Kingdom",
        localGovernment: "Newcastle",
        imageUrl: null,
        rating: "4.9",
        reviewCount: 13,
        startingPrice: "12.00",
        categoryId: 1,
        specialties: ["Ponytails", "Sew Ins", "Quick Weaves"],
        verified: true,
      },
      {
        name: "ITSMBEAUTY",
        businessName: "Its M Beauty",
        location: "Manchester, UK",
        country: "United Kingdom",
        localGovernment: "Manchester",
        imageUrl: null,
        rating: "4.9",
        reviewCount: 13,
        startingPrice: "12.00",
        categoryId: 6,
        specialties: ["Bridal Makeup", "Special Events"],
        verified: true,
      },
      {
        name: "FLESH TATTOO",
        businessName: "Flesh Tattoo Studio",
        location: "London, UK",
        country: "United Kingdom",
        localGovernment: "Camden",
        imageUrl: null,
        rating: "4.9",
        reviewCount: 13,
        startingPrice: "80.00",
        categoryId: 5,
        specialties: ["Custom Tattoos", "Sleeve Work"],
        verified: true,
      },
      {
        name: "CBSALON",
        businessName: "CB Hair Salon",
        location: "Birmingham, UK",
        country: "United Kingdom",
        localGovernment: "Birmingham",
        imageUrl: null,
        rating: "4.9",
        reviewCount: 13,
        startingPrice: "25.00",
        categoryId: 1,
        specialties: ["Wig Styling", "Color Services"],
        verified: true,
      },
    ];

    providerData.forEach(prov => {
      const provider: Provider = { 
        ...prov, 
        id: this.currentProviderId++,
        imageUrl: prov.imageUrl || null,
        businessName: prov.businessName || null,
        reviewCount: prov.reviewCount || 0,
        specialties: prov.specialties || null,
        verified: prov.verified || null
      };
      this.providers.set(provider.id, provider);
    });

    // Services
    const serviceData = [
      {
        name: "Extension Installation",
        description: "Professional hair extension installation",
        price: "115.00",
        duration: 180,
        imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        providerId: 1,
        categoryId: 1,
        trending: true,
      },
      {
        name: "Bridal Makeover",
        description: "Complete bridal makeup and styling",
        price: "222.00",
        duration: 120,
        imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        providerId: 4,
        categoryId: 6,
        trending: true,
      },
      {
        name: "Sleeve Tattoo",
        description: "Custom sleeve tattoo design and application",
        price: "122.00",
        duration: 240,
        imageUrl: "https://images.unsplash.com/photo-1565058379802-bbe93b2731bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        providerId: 5,
        categoryId: 5,
        trending: true,
      },
      {
        name: "Wig Recolouring",
        description: "Professional wig coloring and styling",
        price: "122.00",
        duration: 150,
        imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        providerId: 6,
        categoryId: 1,
        trending: true,
      },
    ];

    serviceData.forEach(serv => {
      const service: Service = { 
        ...serv, 
        id: this.currentServiceId++,
        imageUrl: serv.imageUrl || null,
        description: serv.description || null,
        duration: serv.duration || null,
        trending: serv.trending || null
      };
      this.services.set(service.id, service);
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = { ...category, id: this.currentCategoryId++ };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async getProviders(): Promise<Provider[]> {
    return Array.from(this.providers.values());
  }

  async getProvidersByCategory(categoryId: number): Promise<Provider[]> {
    return Array.from(this.providers.values()).filter(p => p.categoryId === categoryId);
  }

  async getTopRatedProviders(limit = 10): Promise<Provider[]> {
    return Array.from(this.providers.values())
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, limit);
  }

  async getProviderById(id: number): Promise<Provider | undefined> {
    return this.providers.get(id);
  }

  async createProvider(provider: InsertProvider): Promise<Provider> {
    const newProvider: Provider = { 
      ...provider, 
      id: this.currentProviderId++,
      imageUrl: provider.imageUrl || null,
      businessName: provider.businessName || null,
      reviewCount: provider.reviewCount || 0,
      specialties: provider.specialties || null,
      verified: provider.verified || null
    };
    this.providers.set(newProvider.id, newProvider);
    return newProvider;
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServicesByProvider(providerId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(s => s.providerId === providerId);
  }

  async getTrendingServices(limit = 10): Promise<Service[]> {
    return Array.from(this.services.values())
      .filter(s => s.trending)
      .slice(0, limit);
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(service: InsertService): Promise<Service> {
    const newService: Service = { 
      ...service, 
      id: this.currentServiceId++,
      imageUrl: service.imageUrl || null,
      description: service.description || null,
      duration: service.duration || null,
      trending: service.trending || null
    };
    this.services.set(newService.id, newService);
    return newService;
  }

  async searchProviders(query: string, location?: string, categoryId?: number): Promise<Provider[]> {
    let results = Array.from(this.providers.values());

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(lowercaseQuery) ||
        p.businessName?.toLowerCase().includes(lowercaseQuery) ||
        p.specialties?.some(s => s.toLowerCase().includes(lowercaseQuery))
      );
    }

    if (location) {
      const lowercaseLocation = location.toLowerCase();
      results = results.filter(p => p.location.toLowerCase().includes(lowercaseLocation));
    }

    if (categoryId) {
      results = results.filter(p => p.categoryId === categoryId);
    }

    return results;
  }

  async searchServices(query: string, location?: string, categoryId?: number): Promise<Service[]> {
    let results = Array.from(this.services.values());

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      results = results.filter(service => 
        service.name.toLowerCase().includes(lowercaseQuery) ||
        (service.description && service.description.toLowerCase().includes(lowercaseQuery))
      );
    }

    if (location) {
      const lowercaseLocation = location.toLowerCase();
      // Filter services by provider location
      results = results.filter(service => {
        const provider = this.providers.get(service.providerId);
        return provider && provider.location.toLowerCase().includes(lowercaseLocation);
      });
    }

    if (categoryId) {
      // Filter services by provider category
      results = results.filter(service => {
        const provider = this.providers.get(service.providerId);
        return provider && provider.categoryId === categoryId;
      });
    }

    return results;
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Providers
  async getProviders(): Promise<Provider[]> {
    return await db.select().from(providers);
  }

  async getProvidersByCategory(categoryId: number): Promise<Provider[]> {
    return await db.select().from(providers).where(eq(providers.categoryId, categoryId));
  }

  async getTopRatedProviders(limit = 10): Promise<Provider[]> {
    return await db.select().from(providers).orderBy(desc(providers.rating)).limit(limit);
  }

  async getProviderById(id: number): Promise<Provider | undefined> {
    const [provider] = await db.select().from(providers).where(eq(providers.id, id));
    return provider || undefined;
  }

  async getProviderByUserId(userId: number): Promise<Provider | undefined> {
    const [provider] = await db.select().from(providers).where(eq(providers.userId, userId));
    return provider || undefined;
  }

  async createProvider(provider: InsertProvider): Promise<Provider> {
    const [newProvider] = await db.insert(providers).values(provider).returning();
    return newProvider;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getServicesByProvider(providerId: number): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.providerId, providerId));
  }

  async getTrendingServices(limit = 10): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.trending, true)).limit(limit);
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, updates: Partial<Service>): Promise<Service> {
    const [service] = await db
      .update(services)
      .set(updates)
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Search
  async searchProviders(query: string, location?: string, categoryId?: number): Promise<Provider[]> {
    let conditions = [];
    
    if (query) {
      conditions.push(like(providers.name, `%${query}%`));
    }
    
    if (location) {
      conditions.push(like(providers.location, `%${location}%`));
    }
    
    if (categoryId) {
      conditions.push(eq(providers.categoryId, categoryId));
    }

    if (conditions.length === 0) {
      return await db.select().from(providers);
    }

    return await db.select().from(providers).where(and(...conditions));
  }

  async searchServices(query: string, location?: string, categoryId?: number): Promise<Service[]> {
    let conditions = [];
    
    if (query) {
      conditions.push(like(services.name, `%${query}%`));
    }
    
    if (categoryId) {
      conditions.push(eq(services.categoryId, categoryId));
    }

    if (conditions.length === 0) {
      return await db.select().from(services);
    }

    return await db.select().from(services).where(and(...conditions));
  }
}

export const storage = new DatabaseStorage();
