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

  const httpServer = createServer(app);
  return httpServer;
}
