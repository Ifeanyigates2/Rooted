# Service Provider Marketplace Platform

## Overview

This is a modern full-stack web application for connecting customers with beauty and wellness service providers. The platform enables users to discover, browse, and connect with professionals across various categories like hair, nails, lashes, body treatments, tattoos, makeup, waxing, and barber services.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: REST API with organized route handlers
- **Data Layer**: In-memory storage with interface for future database integration
- **Development Server**: Custom Vite integration for hot module replacement

### Database Architecture
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Well-defined relational schema with categories, providers, and services
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Current Implementation**: Memory-based storage with seeded data for development

## Key Components

### Data Models
- **Categories**: Service categories (hair, nails, lash, etc.) with images and slugs
- **Providers**: Service providers with ratings, locations, and specialties
- **Services**: Individual services offered by providers with pricing and descriptions

### Core Features
- **Category Browsing**: Visual grid of service categories with images
- **Provider Discovery**: Top-rated providers with ratings and reviews
- **Service Exploration**: Trending services with provider information
- **Search Interface**: Advanced search with location and specialty filters
- **Responsive Design**: Mobile-first approach with adaptive layouts

### UI Components
- **Reusable Component Library**: Built on Radix UI primitives
- **Design System**: Consistent theming with CSS custom properties
- **Interactive Elements**: Cards, buttons, forms, and navigation components
- **Loading States**: Skeleton loaders and loading indicators

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **Route Handling**: Express routes process requests and interact with storage layer
3. **Data Retrieval**: Storage interface abstracts data access (currently in-memory)
4. **Response Processing**: Data is formatted and returned as JSON
5. **State Management**: TanStack Query caches and manages server state
6. **UI Updates**: React components re-render based on query state changes

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Query for UI and state management
- **Routing**: Wouter for lightweight client-side routing
- **Database**: Drizzle ORM with Neon Database serverless driver
- **UI Components**: Extensive Radix UI component collection
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Development**: Vite, TypeScript, ESBuild for tooling

### Development Tools
- **Hot Reload**: Vite plugin for runtime error overlay
- **Code Organization**: Path aliases for clean imports
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Build Optimization**: Separate client and server build processes

## Deployment Strategy

### Development Environment
- **Hot Module Replacement**: Vite middleware integration with Express
- **Development Server**: Single process running both frontend and backend
- **Asset Serving**: Vite handles static asset processing and serving
- **Error Handling**: Runtime error overlay for development debugging

### Production Build
- **Client Build**: Vite bundles React application for static serving
- **Server Build**: ESBuild bundles Express server with external dependencies
- **Asset Optimization**: Vite optimizes images, CSS, and JavaScript
- **Deployment Target**: Configured for autoscale deployment on Replit

### Environment Configuration
- **Port Configuration**: Server runs on port 5000 with external port 80
- **Database Connection**: PostgreSQL connection via environment variable
- **Module System**: ES modules throughout the application
- **Build Scripts**: Separate development, build, and production start commands

## Recent Changes

### December 30, 2025 - Mailchimp Email Integration
- Integrated Mailchimp API for email functionality
- Added email verification system for user signup
- Created newsletter subscription with Mailchimp audience management
- Added email templates for verification and welcome messages
- Configured graceful fallback for development without API keys
- Updated signup flow to send verification emails automatically
- Added resend OTP functionality with Mailchimp
- Created test endpoints for Mailchimp integration verification

### Key Email Features Added:
- **Email Verification**: OTP codes sent via Mailchimp on signup
- **Newsletter Subscription**: Users added to Mailchimp audience
- **Transactional Emails**: Welcome emails and verification messages
- **Development Mode**: Works without API keys for testing
- **Email Templates**: Professional HTML templates with rooted branding

## Changelog
- June 27, 2025. Initial setup
- December 30, 2025. Mailchimp email integration complete

## User Preferences

Preferred communication style: Simple, everyday language.
Email service: Mailchimp (configured for audience management and transactional emails)