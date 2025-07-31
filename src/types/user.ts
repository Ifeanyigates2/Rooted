export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'customer' | 'provider';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Provider extends User {
  businessName?: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  services: Service[];
  rating: number;
  totalReviews: number;
  totalEarnings: number;
  isVerified: boolean;
}

export interface Service {
  _id?: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  categoryId: number;
  isActive: boolean;
}

export interface Booking {
  _id?: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  notes?: string;
  createdAt: Date;
}