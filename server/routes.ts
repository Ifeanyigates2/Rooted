import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Providers
  app.get("/api/providers", async (req, res) => {
    try {
      const { category, limit } = req.query;
      
      if (category) {
        const providers = await storage.getProvidersByCategory(Number(category));
        res.json(providers);
      } else if (req.query.topRated === 'true') {
        const providers = await storage.getTopRatedProviders(limit ? Number(limit) : undefined);
        res.json(providers);
      } else {
        const providers = await storage.getProviders();
        res.json(providers);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch providers" });
    }
  });

  app.get("/api/providers/:id", async (req, res) => {
    try {
      const provider = await storage.getProviderById(Number(req.params.id));
      if (!provider) {
        return res.status(404).json({ error: "Provider not found" });
      }
      res.json(provider);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch provider" });
    }
  });

  // Services
  app.get("/api/services", async (req, res) => {
    try {
      const { provider, trending, limit } = req.query;
      
      if (provider) {
        const services = await storage.getServicesByProvider(Number(provider));
        res.json(services);
      } else if (trending === 'true') {
        const services = await storage.getTrendingServices(limit ? Number(limit) : undefined);
        res.json(services);
      } else {
        const services = await storage.getServices();
        res.json(services);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Search
  app.get("/api/search", async (req, res) => {
    try {
      const { q: query, location, category } = req.query;
      const providers = await storage.searchProviders(
        query as string,
        location as string,
        category ? Number(category) : undefined
      );
      res.json(providers);
    } catch (error) {
      res.status(500).json({ error: "Failed to search providers" });
    }
  });

  // Newsletter subscription (mock endpoint)
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      // In a real app, this would integrate with an email service
      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  // User signup
  app.post("/api/signup", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, password, countryCode } = req.body;
      
      if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // In a real app, this would:
      // 1. Hash the password
      // 2. Save user to database with verified: false
      // 3. Generate and send OTP via email/SMS
      // 4. Store OTP temporarily (Redis/cache)
      
      // For now, just simulate success
      res.json({ 
        message: "Account created successfully. Please check your email for verification code.",
        userId: "user_" + Date.now()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // Email verification
  app.post("/api/verify-email", async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
      }

      // In a real app, this would:
      // 1. Verify OTP against stored value
      // 2. Update user verified status
      // 3. Clear OTP from cache
      
      // For demo, accept any 4-digit code
      if (otp.length === 4) {
        res.json({ message: "Email verified successfully" });
      } else {
        res.status(400).json({ error: "Invalid OTP code" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to verify email" });
    }
  });

  // Resend OTP
  app.post("/api/resend-otp", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // In a real app, this would generate and send a new OTP
      res.json({ message: "New verification code sent to your email" });
    } catch (error) {
      res.status(500).json({ error: "Failed to resend verification code" });
    }
  });

  // Complete profile
  app.post("/api/complete-profile", async (req, res) => {
    try {
      const { profilePicture, gender, ethnicity, ageRange, allergies, interests } = req.body;
      
      // In a real app, this would:
      // 1. Update user profile in database
      // 2. Handle profile picture upload to storage service
      // 3. Save preferences and interests
      // 4. Mark profile as completed
      
      res.json({ 
        message: "Profile completed successfully",
        profile: {
          gender,
          ethnicity,
          ageRange,
          allergies,
          interests,
          profileCompleted: true
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  // User login
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // In a real app, this would:
      // 1. Find user by email in database
      // 2. Compare hashed password
      // 3. Create session/JWT token
      // 4. Return user profile data
      
      // For demo, accept any email/password combination
      // In production, you'd validate against stored credentials
      res.json({ 
        message: "Login successful",
        user: {
          id: "user_" + Date.now(),
          email: email,
          firstName: "Demo",
          lastName: "User",
          profileCompleted: Math.random() > 0.5 // Randomly determine if profile is completed
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to login" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
