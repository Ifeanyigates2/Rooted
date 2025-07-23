import { pgTable, text, serial, integer, decimal, boolean, jsonb, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for authentication and profile management
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  businessName: varchar("business_name"),
  phone: varchar("phone"),
  bio: text("bio"),
  password: varchar("password").notNull(), // In production, this would be hashed
  userType: varchar("user_type").notNull(), // "customer" or "provider"
  country: varchar("country"),
  area: varchar("area"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull(),
});

export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  businessName: text("business_name"),
  location: text("location").notNull(),
  country: text("country").notNull(),
  localGovernment: text("local_government").notNull(),
  imageUrl: text("image_url"),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  reviewCount: integer("review_count").notNull().default(0),
  startingPrice: decimal("starting_price", { precision: 8, scale: 2 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  specialties: text("specialties").array(),
  verified: boolean("verified").default(false),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  duration: integer("duration"), // in minutes
  imageUrl: text("image_url"),
  providerId: integer("provider_id").references(() => providers.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  trending: boolean("trending").default(false),
});

export const insertUserSchema = createInsertSchema(users);
export const insertCategorySchema = createInsertSchema(categories);
export const insertProviderSchema = createInsertSchema(providers);
export const insertServiceSchema = createInsertSchema(services);

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Provider = typeof providers.$inferSelect;
export type Service = typeof services.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
