# TextWord - Infinite Collaborative Canvas

## Overview

TextWord is an infinite collaborative canvas application where users can place text at any coordinate in an unbounded white space. The application enables real-time collaboration, allowing multiple users to see each other's contributions as they create a shared world built entirely of words. Users interact by double-clicking to add text and dragging to pan across the infinite canvas.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI Component Library:**
- Shadcn UI components built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Design philosophy: Minimalist, invisible interface with pure white infinite canvas

**State Management:**
- React Query for server state (text entries, real-time updates)
- Local React state for UI interactions (canvas position, dragging, modals)
- Coordinate-based positioning system with pixel precision

**Key Interactions:**
- Double-click or double-tap to add text at coordinates
- Click-and-drag (mouse) or touch-and-drag (mobile) to pan the canvas
- Modal-based text input with Enter to submit, Escape to cancel
- Automatic viewport calculations to show existing content to new users

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for the REST API
- ESM module system for modern JavaScript standards
- Custom middleware for request logging and error handling

**API Design:**
- RESTful endpoints for text entry CRUD operations
- Supabase authentication endpoints (signup, signin, signout)
- JSON-based request/response format
- Validation using Zod schemas derived from database schema

**Key Endpoints:**
- `POST /api/text-entries` - Create new text entry with x, y coordinates and content
- `GET /api/text-entries` - Retrieve all text entries for canvas rendering
- `POST /api/auth/signup|signin|signout` - User authentication flows

### Data Storage

**Database:**
- PostgreSQL as primary database (configured via Drizzle)
- Supabase as the database provider and real-time backend
- Schema managed through Drizzle ORM with type-safe queries

**Schema Structure:**
- `text_entries` table with fields:
  - `id`: UUID primary key (auto-generated)
  - `content`: Text content (required)
  - `x`: Integer X-coordinate (required)
  - `y`: Integer Y-coordinate (required)
  - `created_at`: Timestamp (auto-set)

**Data Access Patterns:**
- Storage abstraction layer (`IStorage` interface) supports multiple backends
- `SupabaseStorage` for production using Supabase client
- `MemStorage` as fallback in-memory implementation
- All entries fetched on load, ordered by creation time

### External Dependencies

**Third-Party Services:**
- **Supabase**: Real-time database, authentication, and backend-as-a-service
  - Configuration via `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables
  - Provides auth, database, and real-time subscriptions
  
**Database:**
- **PostgreSQL via Neon**: Serverless Postgres database
  - Configuration via `DATABASE_URL` environment variable
  - Accessed through Drizzle ORM and Neon serverless driver
  
**Development Tools:**
- **Drizzle Kit**: Database schema migrations and management
- **Vercel**: Deployment platform (configured in vercel.json)
- **Replit**: Development environment plugins (cartographer, dev-banner, error overlay)

**Key NPM Packages:**
- `@supabase/supabase-js`: Supabase client SDK
- `@neondatabase/serverless`: Neon database driver
- `drizzle-orm` & `drizzle-zod`: ORM and schema validation
- `@tanstack/react-query`: Async state management
- `@radix-ui/*`: Headless UI components
- `tailwindcss`: Utility-first CSS framework
- `wouter`: Minimal routing library
- `zod`: Schema validation library