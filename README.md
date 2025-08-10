# Next.js Boilerplate

A modern, production-ready Next.js boilerplate with TypeScript, authentication, database integration, and comprehensive tooling.

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Redis (optional, for caching)
- SMTP service (optional, for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd next-boiler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example files
   cp env.example .env
   cp env.local.example .env.local
   
   # Edit .env.local with your local development values
   nano .env.local
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   npm run db:migrate
   
   # Generate TypeScript types
   npm run db:generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Your application will be running at [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-jwt-refresh-key-here"

# NextAuth
COOKIE_SECRET="your-cookie-secret-key-here"
```

### Optional Variables

```env
# Application
APP_NAME="Your App Name"
APP_DESCRIPTION="Your app description"
APP_URL="http://localhost:3000"
PORT="3000"

# JWT Configuration
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
JWT_ISSUER="your-app-name"
JWT_AUDIENCE="your-app-users"

# External Services
REDIS_URL="redis://localhost:6379"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# API Keys
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
ANALYTICS_ID="your-analytics-id"
```

### Environment Files

- **`.env`** - Production environment variables
- **`.env.local`** - Local development overrides (gitignored)
- **`env.example`** - Template for production
- **`env.local.example`** - Template for local development

## Database

This project uses **Drizzle ORM** with **PostgreSQL** for robust database management.

### Database Scripts

```bash
# Run migrations
npm run db:migrate

# Generate TypeScript types
npm run db:generate

# Open Drizzle Studio
npm run db:studio

# Reset database (development only)
npm run db:reset
```

### Database Configuration

The database connection is configured through environment variables and can be accessed via:

```typescript
import { DB_CONFIG } from '@/lib/constants';

// Access database configuration
const dbUrl = DB_CONFIG.URL;
const dbHost = DB_CONFIG.HOST;
```

## Development Tools

### Code Quality with Biome

This project uses [Biome](https://biomejs.dev/) for fast formatting, linting, and code quality checks.

#### Available Scripts

```bash
# Code formatting
npm run format          # Check formatting
npm run format:fix      # Fix formatting automatically

# Code quality
npm run lint            # Check code quality
npm run lint:fix        # Fix auto-fixable issues

# Combined checks
npm run check           # Run both formatting and linting
npm run check:fix       # Fix all auto-fixable issues
```

### Git Hooks with Husky

Pre-commit hooks ensure code quality:
- Format code with Biome
- Run linting checks
- Type checking

## Project Structure

```
next-boiler/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/             # Reusable components
│   ├── ui/                # shadcn/ui components
│   ├── Auth/              # Authentication components
│   └── Providers/         # Context providers
├── lib/                    # Utility libraries
│   ├── auth.ts            # Authentication utilities
│   ├── db.ts              # Database connection
│   ├── schema.ts          # Database schema
│   ├── constants.ts       # Environment constants
│   └── utils.ts           # Helper functions
├── context/                # React Context providers
├── hooks/                  # Custom React hooks
├── styles/                 # Additional styles
└── public/                 # Static assets
```

### Other Platforms

1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Set production environment variables

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
