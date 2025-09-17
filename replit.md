# Dating App - Spark

## Overview

Spark is a modern dating application inspired by popular platforms like Tinder, Hily, and Bumble. The app features a comprehensive swipe-based matching system with profile creation, real-time messaging, premium VIP features, and subscription management. Built as a full-stack TypeScript application, it provides users with an engaging platform to discover potential matches, communicate through various message types, and access premium dating features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built with React and TypeScript, utilizing a component-based architecture with shadcn/ui components for consistent design. The application follows a single-page architecture with state management handled through React hooks and context. Key architectural decisions include:

- **Component Library**: Uses shadcn/ui with Radix UI primitives for accessible, customizable components
- **Styling System**: Tailwind CSS with custom design tokens following dating app aesthetics (pink-red primary colors, gradients)
- **State Management**: React hooks and context for local state, TanStack Query for server state
- **Build Tool**: Vite for fast development and optimized production builds
- **Type Safety**: Full TypeScript implementation with shared types between client and server

### Backend Architecture
The server follows a RESTful API design built on Express.js with TypeScript. The architecture emphasizes:

- **API Structure**: RESTful endpoints with `/api` prefix for all application routes
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **File Upload**: Multer integration for photo uploads with Google Cloud Storage
- **Session Management**: Express session handling for user authentication
- **Error Handling**: Centralized error handling with consistent JSON responses

### Database Design
Uses PostgreSQL with Drizzle ORM providing type-safe database operations. Core entities include:

- **Users**: Basic user authentication and VIP status tracking
- **Profiles**: Detailed user information including photos, interests, location, and preferences
- **Swipes**: Tracking like/dislike actions between users
- **Matches**: Recording mutual likes between users
- **Messages**: Chat history with support for text, voice, and emoji messages
- **Subscriptions**: Premium feature access and payment tracking

### Authentication & Authorization
The system implements session-based authentication with user roles distinguishing between regular and VIP users. VIP status controls access to premium features like unlimited likes and advanced filters.

### File Storage Integration
Google Cloud Storage handles profile photo uploads with proper access controls. The system supports multiple photos per profile with automatic resizing and optimization.

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern patterns
- **Express.js**: Backend web application framework
- **TypeScript**: Type safety across the full stack
- **Vite**: Build tool and development server

### Database & ORM
- **PostgreSQL**: Primary database via Neon serverless
- **Drizzle ORM**: Type-safe database operations and migrations
- **@neondatabase/serverless**: Serverless PostgreSQL connection

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### Data Fetching & State
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation

### File Upload & Storage
- **Google Cloud Storage**: Object storage for profile photos
- **Multer**: Middleware for handling multipart/form-data

### Payment Processing
- **PayPal Server SDK**: Payment processing for VIP subscriptions

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: CSS vendor prefix automation

### Additional Utilities
- **nanoid**: Unique ID generation
- **clsx & tailwind-merge**: Conditional CSS class handling
- **ws**: WebSocket support for real-time features