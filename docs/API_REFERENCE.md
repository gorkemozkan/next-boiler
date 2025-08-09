# API Reference

This document provides a comprehensive reference for all APIs, utilities, and endpoints available in the Next.js boilerplate project.

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Database API](#database-api)
3. [Validation API](#validation-api)
4. [Utility Functions](#utility-functions)
5. [React Hooks](#react-hooks)
6. [Context APIs](#context-apis)
7. [Component APIs](#component-apis)
8. [Error Handling](#error-handling)
9. [Type Definitions](#type-definitions)

## Authentication API

### Core Authentication Functions

#### `generateTokens(userId: string, email: string)`

Generates JWT access and refresh tokens for a user.

```typescript
import { generateTokens } from '@/lib/auth';

const { accessToken, refreshToken } = await generateTokens('user-123', 'user@example.com');
```

**Parameters:**
- `userId` (string): Unique user identifier
- `email` (string): User's email address

**Returns:**
```typescript
{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

#### `verifyToken(token: string)`

Verifies and decodes a JWT token.

```typescript
import { verifyToken } from '@/lib/auth';

try {
  const payload = await verifyToken(accessToken);
  console.log('User ID:', payload.userId);
} catch (error) {
  console.error('Invalid token:', error);
}
```

**Parameters:**
- `token` (string): JWT token to verify

**Returns:**
```typescript
{
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
```

#### `refreshAccessToken(refreshToken: string)`

Refreshes an access token using a valid refresh token.

```typescript
import { refreshAccessToken } from '@/lib/auth';

try {
  const newAccessToken = await refreshAccessToken(refreshToken);
} catch (error) {
  // Handle invalid refresh token
}
```

**Parameters:**
- `refreshToken` (string): Valid refresh token

**Returns:**
```typescript
{
  accessToken: string;
  expiresIn: number;
}
```

### Authentication Middleware

#### `withAuth(handler: Function)`

Higher-order function that adds authentication to API routes.

```typescript
import { withAuth } from '@/lib/auth';

export const GET = withAuth(async (request: Request, user: AuthUser) => {
  // User is authenticated, access user data
  return Response.json({ user });
});
```

**Parameters:**
- `handler` (Function): API route handler function

**Handler Parameters:**
- `request` (Request): HTTP request object
- `user` (AuthUser): Authenticated user object

## Database API

### Database Connection

#### `db` (Database Instance)

Main database connection instance.

```typescript
import { db } from '@/lib/db';

// Execute raw queries
const result = await db.execute(sql`SELECT * FROM users WHERE id = ${userId}`);

// Use Drizzle ORM
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const user = await db.select().from(users).where(eq(users.id, userId));
```

### Schema Definitions

#### `users` Table

```typescript
import { users } from '@/lib/schema';

// Table structure
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// TypeScript type
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### Database Operations

#### `createUser(userData: NewUser)`

Creates a new user in the database.

```typescript
import { createUser } from '@/lib/db';

const newUser = await createUser({
  email: 'user@example.com',
  name: 'John Doe',
  passwordHash: 'hashed-password'
});
```

#### `getUserById(id: string)`

Retrieves a user by their ID.

```typescript
import { getUserById } from '@/lib/db';

const user = await getUserById('user-123');
if (!user) {
  // Handle user not found
}
```

#### `getUserByEmail(email: string)`

Retrieves a user by their email address.

```typescript
import { getUserByEmail } from '@/lib/db';

const user = await getUserByEmail('user@example.com');
```

#### `updateUser(id: string, updates: Partial<User>)`

Updates user information.

```typescript
import { updateUser } from '@/lib/db';

const updatedUser = await updateUser('user-123', {
  name: 'Jane Doe'
});
```

#### `deleteUser(id: string)`

Deletes a user from the database.

```typescript
import { deleteUser } from '@/lib/db';

await deleteUser('user-123');
```

## Validation API

### Zod Schemas

#### `userSchema`

Validation schema for user data.

```typescript
import { userSchema } from '@/lib/validations';

const validation = userSchema.safeParse(userData);
if (validation.success) {
  const validUser = validation.data;
} else {
  const errors = validation.error.errors;
}
```

**Schema Definition:**
```typescript
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});
```

#### `loginSchema`

Validation schema for login data.

```typescript
import { loginSchema } from '@/lib/validations';

const validation = loginSchema.safeParse(loginData);
```

**Schema Definition:**
```typescript
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});
```

#### `registerSchema`

Validation schema for user registration.

```typescript
import { registerSchema } from '@/lib/validations';

const validation = registerSchema.safeParse(registerData);
```

**Schema Definition:**
```typescript
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
```

### Validation Utilities

#### `validateInput<T>(schema: ZodSchema<T>, data: unknown)`

Generic validation function.

```typescript
import { validateInput } from '@/lib/validations';

const result = validateInput(userSchema, userData);
if (result.success) {
  // Data is valid
  const validData = result.data;
} else {
  // Handle validation errors
  const errors = result.error.errors;
}
```

## Utility Functions

### String Utilities

#### `cn(...inputs: ClassValue[])`

Utility for conditionally joining CSS class names.

```typescript
import { cn } from '@/lib/utils';

const buttonClasses = cn(
  'base-button-classes',
  variant === 'primary' && 'primary-variant-classes',
  size === 'large' && 'large-size-classes',
  className
);
```

**Parameters:**
- `...inputs` (ClassValue[]): CSS class names or conditional expressions

**Returns:**
- `string`: Combined CSS class string

#### `formatDate(date: Date | string)`

Formats a date for display.

```typescript
import { formatDate } from '@/lib/utils';

const formattedDate = formatDate(new Date());
// Returns: "January 1, 2024"
```

#### `slugify(text: string)`

Converts text to URL-friendly slug.

```typescript
import { slugify } from '@/lib/utils';

const slug = slugify('Hello World!');
// Returns: "hello-world"
```

### Object Utilities

#### `deepMerge<T>(target: T, source: Partial<T>)`

Deep merges two objects.

```typescript
import { deepMerge } from '@/lib/utils';

const merged = deepMerge(
  { user: { name: 'John', age: 30 } },
  { user: { age: 31 } }
);
// Returns: { user: { name: 'John', age: 31 } }
```

#### `pick<T, K extends keyof T>(obj: T, keys: K[])`

Creates a new object with only the specified keys.

```typescript
import { pick } from '@/lib/utils';

const userData = { id: '123', name: 'John', email: 'john@example.com' };
const publicData = pick(userData, ['name']);
// Returns: { name: 'John' }
```

### Array Utilities

#### `groupBy<T>(array: T[], key: keyof T)`

Groups array items by a specified key.

```typescript
import { groupBy } from '@/lib/utils';

const users = [
  { id: '1', role: 'admin' },
  { id: '2', role: 'user' },
  { id: '3', role: 'admin' }
];

const grouped = groupBy(users, 'role');
// Returns: { admin: [...], user: [...] }
```

## React Hooks

### Form Management

#### `useForm<T>(initialValues: T)`

Custom hook for form state management.

```typescript
import { useForm } from '@/hooks/useForm';

const { values, errors, handleChange, handleSubmit, reset } = useForm({
  email: '',
  password: ''
});

// Usage
<input
  value={values.email}
  onChange={(e) => handleChange('email', e.target.value)}
/>
```

**Returns:**
```typescript
{
  values: T;
  errors: Record<keyof T, string>;
  handleChange: (field: keyof T, value: any) => void;
  handleSubmit: (onSubmit: (values: T) => void) => void;
  reset: () => void;
  setFieldError: (field: keyof T, error: string) => void;
  clearErrors: () => void;
}
```

#### `useFormSubmit<T>(onSubmit: (values: T) => Promise<void>)`

Hook for handling form submission with loading state.

```typescript
import { useFormSubmit } from '@/hooks/useFormSubmit';

const { submit, isLoading, error } = useFormSubmit(async (values) => {
  await api.createUser(values);
});

// Usage
<button onClick={() => submit(formValues)} disabled={isLoading}>
  {isLoading ? 'Creating...' : 'Create User'}
</button>
```

**Returns:**
```typescript
{
  submit: (values: T) => void;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}
```

### Utility Hooks

#### `useDebounce<T>(value: T, delay: number)`

Debounces a value to reduce unnecessary updates.

```typescript
import { useDebounce } from '@/hooks/useDebounce';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

// Use debouncedSearchTerm for API calls
useEffect(() => {
  if (debouncedSearchTerm) {
    searchUsers(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

**Parameters:**
- `value` (T): Value to debounce
- `delay` (number): Delay in milliseconds

**Returns:**
- `T`: Debounced value

## Context APIs

### User Context

#### `UserContext`

React context for managing user authentication state.

```typescript
import { UserContext } from '@/context/UserContext';

const { user, login, logout, isLoading } = useContext(UserContext);
```

**Context Value:**
```typescript
{
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}
```

#### `UserProvider`

Provider component for user context.

```typescript
import { UserProvider } from '@/context/UserContext';

function App() {
  return (
    <UserProvider>
      <YourApp />
    </UserProvider>
  );
}
```

### Query Provider

#### `QueryProvider`

Provider for React Query configuration.

```typescript
import { QueryProvider } from '@/components/Providers/QueryProvider';

function App() {
  return (
    <QueryProvider>
      <YourApp />
    </QueryProvider>
  );
}
```

## Component APIs

### UI Components

#### `Button`

Versatile button component with multiple variants.

```typescript
import { Button } from '@/components/ui/button';

<Button variant="primary" size="large" onClick={handleClick}>
  Click Me
</Button>
```

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}
```

#### `Card`

Container component for content sections.

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

#### `Badge`

Small badge component for labels and status indicators.

```typescript
import { Badge } from '@/components/ui/badge';

<Badge variant="secondary">Status</Badge>
```

**Props:**
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}
```

### Error Boundary

#### `ErrorBoundary`

Component for catching and handling React errors.

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ComponentType<{ error: Error }>;
}
```

## Error Handling

### Error Classes

#### `ApiError`

Custom error class for API-related errors.

```typescript
import { ApiError } from '@/lib/errors';

throw new ApiError(400, 'Invalid input data', 'VALIDATION_ERROR');
```

**Constructor:**
```typescript
constructor(
  public statusCode: number,
  public message: string,
  public code?: string
)
```

#### `DatabaseError`

Custom error class for database-related errors.

```typescript
import { DatabaseError } from '@/lib/errors';

throw new DatabaseError('Failed to connect to database', originalError);
```

### Error Handling Utilities

#### `handleApiError(error: unknown)`

Standardized error handler for API routes.

```typescript
import { handleApiError } from '@/lib/errors';

export async function GET(request: Request) {
  try {
    // Your API logic
  } catch (error) {
    return handleApiError(error);
  }
}
```

#### `trackApiError(error: Error, route: string, method: string, userId?: string)`

Tracks API errors for monitoring.

```typescript
import { trackApiError } from '@/lib/sentry';

try {
  // API logic
} catch (error) {
  trackApiError(error, '/api/users', 'GET', 'user-123');
  throw error;
}
```

## Type Definitions

### Core Types

#### `User`

User entity type.

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `AuthUser`

Authenticated user type (without sensitive data).

```typescript
interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
```

#### `ApiResponse<T>`

Standard API response type.

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}
```

### Utility Types

#### `Nullable<T>`

Makes all properties of T nullable.

```typescript
type NullableUser = Nullable<User>;
// Results in: { id: string | null, email: string | null, ... }
```

#### `PartialDeep<T>`

Makes all properties of T deeply partial.

```typescript
type PartialUser = PartialDeep<User>;
// Results in: { id?: string, email?: string, ... }
```

#### `PickRequired<T, K extends keyof T>`

Picks required properties from T.

```typescript
type RequiredUserFields = PickRequired<User, 'email' | 'name'>;
// Results in: { email: string, name: string }
```

This API reference provides comprehensive documentation for all the functions, components, and utilities available in the Next.js boilerplate project. Use this as a quick reference when developing features or debugging issues. 