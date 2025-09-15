# Idea Board

## Overview

This is a full-stack web application called "Idea Board" (💡 Idea Board) that allows users to share ideas and engage with the community through voting and commenting. The application features a modern, gradient-themed UI with glass morphism effects, built as a real-time collaborative platform where users can create ideas, vote on them, and add comments.

The application follows a monorepo structure with a React frontend, Express.js backend, and PostgreSQL database using Drizzle ORM for data management. It's designed to be deployed on Replit with proper development and production configurations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **Styling**: Tailwind CSS with custom CSS variables for theming, featuring a gradient background and glass morphism design
- **UI Components**: Extensive use of shadcn/ui components with Radix UI primitives for accessibility
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation through @hookform/resolvers

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Connection**: Neon Database serverless with WebSocket support
- **API Design**: RESTful API with structured error handling and logging middleware
- **Development**: Hot reload support with tsx for TypeScript execution

### Database Schema
The application uses three main entities:
- **Ideas**: Core content with author, title, content, and timestamps
- **Votes**: User voting system with upvote/downvote functionality and unique constraints per user per idea
- **Comments**: Threaded commenting system linked to ideas
- All tables use cascade deletion for data integrity and include proper foreign key relationships

### Data Flow & State Management
- Frontend uses React Query for efficient data fetching, caching, and real-time updates
- Auto-refresh mechanisms update ideas every 30 seconds for near real-time experience
- Optimistic updates for voting and commenting to improve user experience
- Type-safe API requests with centralized error handling

### Authentication & User Management
- Simple username generation system (Usuario + random number)
- No persistent authentication - users are assigned temporary usernames per session
- Vote uniqueness enforced at database level per user per idea

### Development & Build Configuration
- **Development**: Vite dev server with HMR, Express backend with tsx
- **Production**: Vite build for frontend assets, esbuild for backend bundling
- **TypeScript**: Strict mode enabled with path mapping for clean imports
- **Database Migrations**: Drizzle Kit for schema management and migrations

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL database with WebSocket support for scalable data storage
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect for database operations
- **Drizzle Kit**: Database migration and introspection tooling

### UI & Styling Framework
- **shadcn/ui**: Complete UI component library built on Radix UI primitives
- **Radix UI**: Headless, accessible UI components for forms, dialogs, and interactive elements
- **Tailwind CSS**: Utility-first CSS framework with custom design system variables
- **Lucide React**: Icon library for consistent iconography

### Development & Build Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **esbuild**: Fast JavaScript bundler for backend code
- **TypeScript**: Static type checking across the entire application
- **tsx**: TypeScript execution engine for development

### Client-Side Libraries
- **TanStack Query**: Advanced server state management with caching and synchronization
- **React Hook Form**: Performant form handling with validation
- **Zod**: Runtime type validation and schema parsing
- **Wouter**: Lightweight routing library for React
- **date-fns**: Date utility library for timestamp formatting

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment
- **@replit/vite-plugin-dev-banner**: Development environment indicators