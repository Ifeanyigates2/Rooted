import { db } from "./db";
import { categories, providers, services, users } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");
  
  try {
    // Seed Categories
    const categoryData = [
      { name: "Hair", slug: "hair", imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
      { name: "Nails", slug: "nails", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
      { name: "Lash", slug: "lash", imageUrl: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
      { name: "Body", slug: "body", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
      { name: "Tattoo", slug: "tattoo", imageUrl: "https://images.unsplash.com/photo-1565058379802-bbe93b2731bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
      { name: "Makeup", slug: "makeup", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
      { name: "Waxing", slug: "waxing", imageUrl: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
      { name: "Barber", slug: "barber", imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
    ];

    await db.insert(categories).values(categoryData).onConflictDoNothing();
    console.log("Categories seeded successfully");

    // Check if we already have users before seeding
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already has users, skipping seed");
      return;
    }

    // Seed Users
    const userData = [
      {
        email: "kdhair@example.com",
        firstName: "Kimberly",
        lastName: "Davis",
        businessName: "KD Hair Studio",
        phone: "+234 123 456 7890",
        bio: "Professional hair specialist with 10+ years experience",
        password: "password123",
        userType: "provider" as const,
        verified: true,
      },
      {
        email: "beautybyjess@example.com",
        firstName: "Jessica",
        lastName: "Thompson",
        businessName: "Beauty by Jess",
        phone: "+234 987 654 3210",
        bio: "Expert in makeup and beauty treatments",
        password: "password123",
        userType: "provider" as const,
        verified: true,
      },
      {
        email: "nailartpro@example.com",
        firstName: "Sophie",
        lastName: "Williams",
        businessName: "Nail Art Pro",
        phone: "+234 555 123 4567",
        bio: "Creative nail artist specializing in custom designs",
        password: "password123",
        userType: "provider" as const,
        verified: true,
      },
    ];

    const insertedUsers = await db.insert(users).values(userData).returning();
    console.log("Users seeded successfully");

    // Seed Providers
    const providerData = [
      {
        userId: insertedUsers[0].id,
        name: "KDHAIR",
        businessName: "KD Hair Studio",
        location: "Westminster, London",
        country: "United Kingdom",
        localGovernment: "Westminster",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0b22c6e8daa?w=400&h=400&fit=crop",
        rating: "4.8",
        reviewCount: 124,
        startingPrice: "45.00",
        categoryId: 1,
        specialties: ["Hair Extensions", "Color Correction", "Bridal Hair"],
        verified: true,
      },
      {
        userId: insertedUsers[1].id,
        name: "BeautyByJess",
        businessName: "Beauty by Jess",
        location: "Leeds, Yorkshire",
        country: "United Kingdom",
        localGovernment: "Leeds",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
        rating: "4.9",
        reviewCount: 89,
        startingPrice: "35.00",
        categoryId: 6,
        specialties: ["Bridal Makeup", "Special Events", "Photoshoot Makeup"],
        verified: true,
      },
      {
        userId: insertedUsers[2].id,
        name: "NailArtPro",
        businessName: "Nail Art Pro",
        location: "Chelmsford, Essex",
        country: "United Kingdom",
        localGovernment: "Chelmsford",
        imageUrl: "https://images.unsplash.com/photo-1599948128020-9d00dd8f1a0f?w=400&h=400&fit=crop",
        rating: "4.7",
        reviewCount: 156,
        startingPrice: "25.00",
        categoryId: 2,
        specialties: ["Gel Nails", "Nail Art", "Manicures"],
        verified: true,
      },
    ];

    const insertedProviders = await db.insert(providers).values(providerData).returning();
    console.log("Providers seeded successfully");

    // Seed Services
    const serviceData = [
      {
        name: "Extension Installation",
        description: "Professional hair extension installation",
        price: "115.00",
        duration: 180,
        imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        providerId: insertedProviders[0].id,
        categoryId: 1,
        trending: true,
      },
      {
        name: "Bridal Makeover",
        description: "Complete bridal makeup and styling",
        price: "222.00",
        duration: 120,
        imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        providerId: insertedProviders[1].id,
        categoryId: 6,
        trending: true,
      },
      {
        name: "Gel Manicure",
        description: "Long-lasting gel manicure with custom colors",
        price: "45.00",
        duration: 90,
        imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        providerId: insertedProviders[2].id,
        categoryId: 2,
        trending: true,
      },
    ];

    await db.insert(services).values(serviceData);
    console.log("Services seeded successfully");
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed();
}

export { seed };