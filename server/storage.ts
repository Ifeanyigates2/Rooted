import { categories, providers, services, type Category, type Provider, type Service, type InsertCategory, type InsertProvider, type InsertService } from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Providers
  getProviders(): Promise<Provider[]>;
  getProvidersByCategory(categoryId: number): Promise<Provider[]>;
  getTopRatedProviders(limit?: number): Promise<Provider[]>;
  getProviderById(id: number): Promise<Provider | undefined>;
  createProvider(provider: InsertProvider): Promise<Provider>;

  // Services
  getServices(): Promise<Service[]>;
  getServicesByProvider(providerId: number): Promise<Service[]>;
  getTrendingServices(limit?: number): Promise<Service[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

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
      const provider: Provider = { ...prov, id: this.currentProviderId++ };
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
      const service: Service = { ...serv, id: this.currentServiceId++ };
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
    const newProvider: Provider = { ...provider, id: this.currentProviderId++ };
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
    const newService: Service = { ...service, id: this.currentServiceId++ };
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

export const storage = new MemStorage();
