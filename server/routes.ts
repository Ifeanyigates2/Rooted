import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mailchimpService } from "./mailchimp";
import { resendService } from "./resend";

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

  // Search Providers
  app.get("/api/search/providers", async (req, res) => {
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

  // Search Services
  app.get("/api/search/services", async (req, res) => {
    try {
      const { q: query, location, category } = req.query;
      const services = await storage.searchServices(
        query as string,
        location as string,
        category ? Number(category) : undefined
      );
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to search services" });
    }
  });

  // Newsletter subscription with Mailchimp
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email, firstName, lastName } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const success = await mailchimpService.addSubscriber({
        email,
        firstName,
        lastName,
        status: 'subscribed'
      });

      if (success) {
        res.json({ message: "Successfully subscribed to newsletter" });
      } else {
        res.status(500).json({ error: "Failed to subscribe to newsletter" });
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  // User signup with email verification
  app.post("/api/signup", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, password, countryCode } = req.body;
      
      if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Generate OTP (4-digit code)
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Generate verification email content
      const htmlContent = resendService.generateVerificationEmail(email, otp);
      
      // Send verification email
      const emailSent = await resendService.sendEmail({
        to: email,
        subject: "Verify your rooted account",
        htmlContent,
        from: {
          email: "onboarding@resend.dev",
          name: "rooted"
        }
      });

      // Add user to Mailchimp audience
      await mailchimpService.addSubscriber({
        email,
        firstName,
        lastName,
        status: 'pending' // Set as pending until email is verified
      });

      if (emailSent) {
        res.json({ 
          message: "Account created successfully. Please check your email for verification code.",
          userId: "user_" + Date.now(),
          // In development, include OTP for testing purposes
          otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
      } else {
        res.status(500).json({ error: "Failed to send verification email" });
      }
    } catch (error) {
      console.error("Signup error:", error);
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

  // Resend OTP with Mailchimp
  app.post("/api/resend-otp", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Generate new OTP (4-digit code)
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Generate verification email content
      const htmlContent = resendService.generateVerificationEmail(email, otp);
      
      // Send verification email
      const emailSent = await resendService.sendEmail({
        to: email,
        subject: "Your new rooted verification code",
        htmlContent,
        from: {
          email: "onboarding@resend.dev",
          name: "rooted"
        }
      });

      if (emailSent) {
        res.json({ 
          message: "New verification code sent to your email",
          // In development, include OTP for testing purposes
          otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
      } else {
        res.status(500).json({ error: "Failed to send verification code" });
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
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

  // Test endpoint for sending verification email
  app.post('/api/test-email', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Generate a test OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      
      console.log('=== SENDING TEST EMAIL ===');
      console.log('To:', email);
      console.log('OTP:', otp);
      console.log('========================');

      // Send verification email
      const emailSent = await mailchimpService.sendEmail({
        to: email,
        subject: 'Test OTP - rooted account verification',
        htmlContent: mailchimpService.generateVerificationEmail(email, otp)
      });

      if (emailSent) {
        res.json({
          success: true,
          message: 'Test email sent successfully',
          email: email,
          otp: otp // Include OTP for development testing
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send test email'
        });
      }
    } catch (error: any) {
      console.error('Test email error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Test email failed'
      });
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

  // Provider dashboard endpoints
  app.get("/api/provider/me", async (req, res) => {
    try {
      // In a real app, this would:
      // 1. Get user ID from session/JWT
      // 2. Find provider by user ID
      // 3. Return provider profile
      
      // For demo, return a mock provider profile
      const mockProvider = {
        id: 1,
        name: "Sarah Johnson",
        businessName: "Sarah's Beauty Studio",
        email: "sarah@beautymail.com",
        phone: "+44 20 1234 5678",
        location: "Westminster, London",
        country: "United Kingdom",
        localGovernment: "Westminster",
        bio: "Expert hair stylist and colorist with 10+ years experience",
        specialties: ["Hair Styling", "Hair Coloring", "Bridal Hair"],
        rating: 4.8,
        reviewCount: 127,
        startingPrice: 45,
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0b22c6e8daa?w=400&h=400&fit=crop",
        verified: true,
        categoryId: 1,
        instagramHandle: "@sarahbeautystudio",
        portfolioImages: ["https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop"],
        trending: false,
        joinDate: "2023-01-15"
      };
      
      res.json(mockProvider);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch provider profile" });
    }
  });

  app.get("/api/provider/services", async (req, res) => {
    try {
      // In a real app, this would:
      // 1. Get user ID from session/JWT
      // 2. Find provider by user ID
      // 3. Get services for that provider
      
      // For demo, return mock services for the provider
      const mockServices = [
        {
          id: 1,
          name: "Classic Haircut & Blow Dry",
          description: "Professional haircut with styling and blow dry finish",
          price: 45,
          duration: 60,
          categoryId: 1,
          providerId: 1,
          imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop",
          trending: false
        },
        {
          id: 2,
          name: "Full Hair Color Service",
          description: "Complete hair coloring service with consultation and aftercare",
          price: 120,
          duration: 180,
          categoryId: 1,
          providerId: 1,
          imageUrl: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=400&fit=crop",
          trending: true
        },
        {
          id: 3,
          name: "Bridal Hair Styling",
          description: "Elegant bridal hair styling for your special day",
          price: 85,
          duration: 120,
          categoryId: 1,
          providerId: 1,
          imageUrl: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=400&fit=crop",
          trending: false
        }
      ];
      
      res.json(mockServices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch provider services" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const { name, description, price, duration, categoryId, imageUrl } = req.body;
      
      if (!name || !price || !categoryId) {
        return res.status(400).json({ error: "Name, price, and category are required" });
      }
      
      // In a real app, this would:
      // 1. Get user ID from session/JWT
      // 2. Find provider by user ID
      // 3. Create service with provider ID
      // 4. Store in database
      
      // For demo, return mock created service
      const newService = {
        id: Date.now(),
        name,
        description: description || "",
        price: Number(price),
        duration: duration ? Number(duration) : null,
        categoryId: Number(categoryId),
        providerId: 1, // Mock provider ID
        imageUrl: imageUrl || "",
        trending: false
      };
      
      res.json(newService);
    } catch (error) {
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.patch("/api/services/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, duration, categoryId, imageUrl } = req.body;
      
      // In a real app, this would:
      // 1. Get user ID from session/JWT
      // 2. Find provider by user ID
      // 3. Verify service belongs to provider
      // 4. Update service in database
      
      // For demo, return mock updated service
      const updatedService = {
        id: Number(id),
        name,
        description: description || "",
        price: Number(price),
        duration: duration ? Number(duration) : null,
        categoryId: Number(categoryId),
        providerId: 1, // Mock provider ID
        imageUrl: imageUrl || "",
        trending: false
      };
      
      res.json(updatedService);
    } catch (error) {
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // In a real app, this would:
      // 1. Get user ID from session/JWT
      // 2. Find provider by user ID
      // 3. Verify service belongs to provider
      // 4. Delete service from database
      
      // For demo, just return success
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Test Mailchimp endpoint
  app.post("/api/test-mailchimp", async (req, res) => {
    try {
      const { email, firstName, lastName } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Test subscriber addition
      const subscribeResult = await mailchimpService.addSubscriber({
        email,
        firstName: firstName || 'Test',
        lastName: lastName || 'User',
        status: 'subscribed'
      });

      // Test email sending
      const emailResult = await mailchimpService.sendEmail({
        to: email,
        subject: "Test email from rooted",
        htmlContent: `<h1>Test Email</h1><p>This is a test email from rooted marketplace.</p>`,
        from: {
          email: "test@rooted.com",
          name: "rooted Test"
        }
      });

      // Get audience info
      const audienceInfo = await mailchimpService.getAudienceInfo();

      res.json({
        subscribeResult,
        emailResult,
        audienceInfo,
        message: "Mailchimp test completed"
      });
    } catch (error) {
      console.error("Mailchimp test error:", error);
      res.status(500).json({ message: "Mailchimp test failed", error: String(error) });
    }
  });

  // Get Mailchimp audience info (for admin)
  app.get("/api/audience-info", async (req, res) => {
    try {
      const info = await mailchimpService.getAudienceInfo();
      res.json(info);
    } catch (error) {
      console.error("Audience info error:", error);
      res.status(500).json({ message: "Failed to get audience info" });
    }
  });

  // Test Resend integration
  app.get("/api/test-resend", async (req, res) => {
    try {
      console.log("Testing Resend integration...");
      
      // Test sending email
      const testEmailSent = await resendService.sendEmail({
        to: "test@resend.dev",
        subject: "Test Email from rooted",
        htmlContent: resendService.generateVerificationEmail("test@resend.dev", "1234"),
        from: {
          email: "onboarding@resend.dev",
          name: "rooted"
        }
      });
      
      res.json({ 
        message: "Resend test completed",
        emailSent: testEmailSent
      });
    } catch (error) {
      console.error("Resend test error:", error);
      res.status(500).json({ error: "Resend test failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
