import { MongoClient, Db, Collection } from 'mongodb';

const MONGODB_URI = "mongodb+srv://Ifeanyi:January2021%23%23%23@cluster0.ac95iuu.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "rooted";

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
  }
  return { client, db };
}

export async function getServiceProvidersCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection('service_providers');
}

export async function getUsersCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection('users');
}

export async function getBookingsCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection('bookings');
}

export async function getServicesCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection('services');
}

// Service Provider interface
export interface ServiceProvider {
  _id?: string;
  userId: string; // Reference to user account
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  location: string;
  services: string[]; // Array of service categories
  specialties: string[];
  experience: number; // Years of experience
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
  portfolio: string[]; // Array of image URLs
  certifications: string[];
  languages: string[];
  priceRange: {
    min: number;
    max: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Initialize service_providers collection with sample data
export async function initializeServiceProviders() {
  const collection = await getServiceProvidersCollection();
  
  // Check if collection already has data
  const count = await collection.countDocuments();
  if (count > 0) {
    console.log('Service providers collection already initialized');
    return;
  }

  // Sample service providers data
  const sampleProviders: Omit<ServiceProvider, '_id'>[] = [
    {
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

  // Insert sample data
  await collection.insertMany(sampleProviders);
  console.log('Service providers collection initialized with sample data');
}