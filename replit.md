# Neon Cinema - Real-Time Seat Booking System

## Overview

Neon Cinema is a real-time cinema seat booking application that allows users to view available seats, reserve them temporarily, and complete bookings. The application features a futuristic neon-themed UI with an interactive cinema hall layout supporting both standard and VIP seating. Users can select multiple seats, add them to a cart, and complete their booking by entering their name.

The system uses an in-memory seat state management system with polling to simulate real-time updates across users. The application is built with a modern full-stack architecture featuring React on the frontend and a dual-backend approach using both Express.js (Node.js) and FastAPI (Python).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as the build tool and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Tailwind CSS with custom theming for styling
- Framer Motion for animations
- Radix UI components via shadcn/ui component library

**Design Decisions:**
The frontend uses a component-based architecture with clear separation of concerns. The `Home.tsx` page serves as the main container, managing global state for seat selection and user identification. The application generates and stores a unique user ID in localStorage to track individual users across sessions.

The UI features a zoomable and pannable cinema hall layout using `react-zoom-pan-pinch`, making it mobile-friendly and accessible on various screen sizes. The seat selection flow uses optimistic updates combined with server polling (every 5 seconds) to provide real-time feedback while maintaining data consistency.

**State Management:**
- Local component state for UI interactions
- TanStack Query for server state with automatic refetching
- localStorage for persisting user identity

### Backend Architecture

**Dual-Backend Approach:**

The application uses two backend services:

1. **Express.js Server** (Node.js) - Primary server handling:
   - Static file serving for the built React application
   - Vite development middleware in development mode
   - API proxying to the FastAPI backend
   - HTTP server creation and routing

2. **FastAPI Server** (Python) - API backend handling:
   - In-memory seat state management
   - RESTful API endpoints for seat operations
   - CORS middleware for cross-origin requests

**Rationale:**
This architecture separates concerns between serving the frontend (Express) and managing business logic (FastAPI). The Express server acts as a reverse proxy, forwarding `/api` requests to FastAPI running on port 8000. This allows the frontend to make API calls to relative paths while the Express server handles routing to the appropriate backend service.

**API Endpoints:**
- `GET /api/seats` - Retrieve all seats and their current states
- `POST /api/seats/reserve` - Temporarily hold a seat (cart functionality)
- `POST /api/seats/release` - Release a held seat (remove from cart)
- `POST /api/seats/book` - Complete booking for selected seats

**Data Model:**
Seats are stored in memory with the following structure:
- `id`: String identifier (format: "row-column")
- `row`: Integer row number
- `col`: Integer column number
- `price`: Numeric price ($12 for standard, $18 for VIP)
- `status`: String ('available' or 'occupied')
- `type`: String ('standard' or 'vip')
- `occupied_by`: Optional string (name of person who booked)
- `held_by`: Optional string (user ID of person holding in cart)

The backend initializes an 8-row by 10-column cinema hall, with the last 2 rows designated as VIP seating at a premium price.

**Trade-offs:**
- In-memory storage provides fast performance but data is lost on server restart
- Polling-based updates are simpler to implement than WebSockets but less efficient
- The dual-backend approach adds complexity but provides flexibility in technology choices

### Database Layer

**Current Implementation:**
The application uses Drizzle ORM configured for PostgreSQL with schema definitions in `shared/schema.ts`. However, the current live backend (FastAPI) uses in-memory storage rather than a database.

**Schema:**
- Users table with fields: id (UUID), username, password

**Storage Interface:**
The Express server includes a storage abstraction layer (`server/storage.ts`) with an in-memory implementation (`MemStorage`) that provides user CRUD operations. This interface design allows for easy migration to database-backed storage in the future.

**Future Considerations:**
The application is structured to support database integration. The Drizzle configuration points to PostgreSQL, and the storage interface provides a clean abstraction layer. To enable persistent storage, one would need to:
1. Provision a PostgreSQL database
2. Run database migrations using Drizzle Kit
3. Implement a database-backed storage class
4. Migrate seat management from FastAPI in-memory to database storage

### Build and Deployment

**Build Process:**
The `script/build.ts` file orchestrates the production build:
1. Cleans the `dist` directory
2. Builds the React client using Vite
3. Bundles the Express server using esbuild with selective dependency bundling

**Bundling Strategy:**
Critical dependencies (like `drizzle-orm`, `express`, `pg`) are bundled into the server bundle to reduce filesystem syscalls and improve cold start performance. Less critical dependencies remain external.

**Development Workflow:**
- `npm run dev` - Starts Express server with Vite middleware for HMR
- `npm run dev:client` - Runs standalone Vite dev server
- `npm run build` - Creates production build
- `npm run start` - Runs production server

## External Dependencies

### UI Component Library
- **shadcn/ui** - Accessible component system built on Radix UI primitives
- **Radix UI** - Unstyled, accessible component primitives

### Styling and Animation
- **Tailwind CSS** - Utility-first CSS framework with custom theming
- **Framer Motion** - Animation library for React
- **canvas-confetti** - Celebration effects for successful bookings

### Form Management
- **React Hook Form** - Form state management
- **Zod** - Schema validation with TypeScript inference
- **@hookform/resolvers** - Integration between React Hook Form and Zod

### Backend Frameworks
- **Express.js** - Node.js web framework
- **FastAPI** - Python web framework for APIs
- **uvicorn** - ASGI server for FastAPI

### Data Fetching and State
- **TanStack Query** - Async state management for React
- **Wouter** - Lightweight routing library

### Development Tools
- **Vite** - Build tool and dev server with HMR
- **TypeScript** - Type-safe JavaScript
- **esbuild** - JavaScript bundler for server code
- **tsx** - TypeScript execution engine
- **Replit plugins** - Development environment integration (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner)

### Fonts
- **Google Fonts** - Custom fonts (Orbitron for display, Rajdhani for body text)

### Future Database Integration
- **Drizzle ORM** - TypeScript ORM for SQL databases
- **PostgreSQL** - Relational database (configured but not currently used)
- **pg** - PostgreSQL client for Node.js