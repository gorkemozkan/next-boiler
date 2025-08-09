# Development Guide

This guide provides comprehensive information for developers working on the Next.js boilerplate project, including setup, workflows, and best practices.

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Project Setup](#project-setup)
3. [Development Workflow](#development-workflow)
4. [Code Quality Tools](#code-quality-tools)
5. [Testing Strategy](#testing-strategy)
6. [Database Development](#database-development)
7. [API Development](#api-development)
8. [Component Development](#component-development)
9. [Performance Optimization](#performance-optimization)
10. [Debugging and Troubleshooting](#debugging-and-troubleshooting)
11. [Deployment](#deployment)

## Development Environment Setup

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: Version 2.30.0 or higher
- **PostgreSQL**: Version 13.0 or higher
- **VS Code** (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - Error Lens

### System Requirements

- **RAM**: Minimum 8GB, recommended 16GB
- **Storage**: At least 5GB free space
- **OS**: macOS 10.15+, Windows 10+, or Linux (Ubuntu 18.04+)

### Environment Setup

1. **Install Node.js**
   ```bash
   # Using nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   
   # Or download from nodejs.org
   ```

2. **Install PostgreSQL**
   ```bash
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

3. **Install Redis (optional)**
   ```bash
   # macOS with Homebrew
   brew install redis
   brew services start redis
   
   # Ubuntu/Debian
   sudo apt install redis-server
   sudo systemctl start redis-server
   ```

## Project Setup

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-boiler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   # Copy environment files
   cp env.example .env
   cp env.local.example .env.local
   
   # Edit .env.local with your local values
   nano .env.local
   ```

4. **Database setup**
   ```bash
   # Create database
   createdb next_boiler_dev
   
   # Run migrations
   npm run db:migrate
   
   # Generate types
   npm run db:generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/next_boiler_dev"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-jwt-refresh-key-here"

# Application
APP_NAME="Next.js Boilerplate"
APP_DESCRIPTION="A modern Next.js boilerplate"
APP_URL="http://localhost:3000"
PORT="3000"

# Development
NODE_ENV="development"
```

## Development Workflow

### Daily Development Cycle

1. **Start the day**
   ```bash
   git pull origin main
   npm install  # If dependencies changed
   npm run dev
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Development work**
   - Write code following the style guide
   - Test your changes locally
   - Run quality checks before committing

4. **Pre-commit checks**
   ```bash
   npm run check:fix  # Format and lint
   npm run build      # Ensure build works
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

### Git Workflow

- **Main branch**: Production-ready code
- **Feature branches**: `feature/description`
- **Bug fix branches**: `fix/description`
- **Hotfix branches**: `hotfix/description`

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat(auth): add JWT refresh token support
fix(api): resolve user creation validation error
docs(readme): update installation instructions
style(components): format button component
refactor(db): optimize database queries
test(auth): add authentication test cases
```

## Code Quality Tools

### Biome Configuration

The project uses Biome for fast formatting and linting. Configuration is in `biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.5.3/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
    "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

### Available Scripts

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

### Pre-commit Hooks

Husky automatically runs quality checks before commits:

```bash
# Manual security check
npm run security:check

# Check staged files only
npm run security:check:staged

# Check all files
npm run security:check:all
```

## Testing Strategy

### Testing Framework

The project uses Jest and React Testing Library for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=useForm.test.ts
```

### Test Structure

```
__tests__/
├── components/          # Component tests
├── hooks/              # Hook tests
├── utils/              # Utility function tests
└── integration/        # Integration tests
```

### Writing Tests

```typescript
// Example test for useForm hook
import { renderHook, act } from '@testing-library/react';
import { useForm } from '@/hooks/useForm';

describe('useForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useForm({ name: '', email: '' }));
    
    expect(result.current.values).toEqual({ name: '', email: '' });
    expect(result.current.errors).toEqual({});
  });

  it('should update values on change', () => {
    const { result } = renderHook(() => useForm({ name: '', email: '' }));
    
    act(() => {
      result.current.handleChange('name', 'John');
    });
    
    expect(result.current.values.name).toBe('John');
  });
});
```

## Database Development

### Database Management

```bash
# Generate new migration
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema changes (development only)
npm run db:push

# Open Drizzle Studio
npm run db:studio

# Reset database (development only)
npm run db:reset
```

### Schema Development

```typescript
// lib/schema.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### Database Queries

```typescript
// lib/db.ts
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';

export async function getUserById(id: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  
  return result[0] || null;
}
```

## API Development

### API Route Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts
│   │   └── register/
│   │       └── route.ts
│   └── users/
│       └── route.ts
```

### API Route Example

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/db';
import { validateUserId } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const validation = validateUserId.safeParse(userId);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    const user = await getUserById(validation.data);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Error Handling

```typescript
// lib/api-errors.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }
  
  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

## Component Development

### Component Structure

The project includes several UI components in the `components/ui/` directory:

- **Button**: Versatile button component with multiple variants
- **Card**: Card container component
- **Badge**: Badge/label component
- **Separator**: Visual separator component

### Component Example

```typescript
// components/ui/Button.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ButtonProps } from './types';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
            'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 px-3': size === 'sm',
            'h-11 px-8': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
```

### Component Testing

```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });
});
```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npm run analyze

# Or use Next.js built-in analyzer
ANALYZE=true npm run build
```

### Image Optimization

```typescript
import Image from 'next/image';

// Optimized image component
<Image
  src="/hero-image.jpg"
  alt="Hero section image"
  width={1200}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Code Splitting

```typescript
// Lazy load components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable SSR for client-only components
});
```

## Debugging and Troubleshooting

### Development Tools

1. **React Developer Tools**: Browser extension for React debugging
2. **Next.js DevTools**: Built-in development tools
3. **Drizzle Studio**: Database management and debugging

### Common Issues

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Verify dependencies
npm ls
```

#### Database Connection Issues

```bash
# Check PostgreSQL status
brew services list | grep postgresql

# Test connection
psql -h localhost -U username -d next_boiler_dev

# Check environment variables
echo $DATABASE_URL
```

#### Performance Issues

```bash
# Check bundle size
npm run analyze

# Monitor memory usage
node --inspect npm run dev

# Profile React components
npm run dev -- --profile
```

### Debug Mode

Enable debug logging in development:

```typescript
// lib/constants.ts
export const DEBUG = process.env.NODE_ENV === 'development';

// Usage
if (DEBUG) {
  console.log('Debug info:', data);
}
```

## Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start npm --name "next-boiler" -- start
```

### Environment Configuration

```bash
# Production environment
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="production-secret"
SENTRY_DSN="production-sentry-dsn"
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      # Add deployment steps
```

## Best Practices Summary

### Code Quality
- ✅ Write tests for all new functionality
- ✅ Follow the established code style
- ✅ Use TypeScript strictly
- ✅ Validate all inputs with Zod
- ✅ Handle errors gracefully

### Performance
- ✅ Optimize images and assets
- ✅ Use code splitting appropriately
- ✅ Implement proper caching strategies
- ✅ Monitor bundle size
- ✅ Profile performance bottlenecks

### Security
- ✅ Never commit secrets
- ✅ Validate all user inputs
- ✅ Use HTTPS in production
- ✅ Keep dependencies updated
- ✅ Follow OWASP guidelines

### Documentation
- ✅ Document complex logic
- ✅ Keep README updated
- ✅ Write clear commit messages
- ✅ Document API endpoints
- ✅ Maintain changelog

This development guide provides a comprehensive foundation for working with the Next.js boilerplate project. Follow these practices to ensure code quality, maintainability, and team productivity. 