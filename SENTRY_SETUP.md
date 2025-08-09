# Sentry Integration Setup

This project includes Sentry for error tracking, performance monitoring, and session replay.

## Configuration Files

- `sentry.client.config.ts` - Browser-side configuration
- `sentry.server.config.ts` - Server-side configuration  
- `sentry.edge.config.ts` - Edge Runtime configuration
- `sentry.properties` - Build configuration (update with your values)

## Environment Variables

Add these to your `.env.local` file:

```bash
# Sentry Configuration
SENTRY_DSN="your-sentry-dsn-here"
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn-here"
```

## Setup Steps

1. **Create a Sentry account** at [sentry.io](https://sentry.io)
2. **Create a new project** for your Next.js application
3. **Get your DSN** from the project settings
4. **Update environment variables** with your DSN
5. **Update `sentry.properties`** with your organization and project details

## Usage Examples

### Basic Error Tracking

```typescript
import { captureException, captureMessage } from '@/lib/sentry';

// Track exceptions
try {
  // Your code here
} catch (error) {
  captureException(error as Error, {
    context: 'user-action',
    userId: 'user-123'
  });
}

// Track messages
captureMessage('User completed onboarding', 'info');
```

### API Route Error Tracking

```typescript
import { trackApiError } from '@/lib/sentry';

export async function GET(request: Request) {
  try {
    // Your API logic
  } catch (error) {
    trackApiError(error as Error, '/api/users', 'GET', 'user-123');
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Database Error Tracking

```typescript
import { trackDatabaseError } from '@/lib/sentry';

try {
  const result = await db.query('SELECT * FROM users');
} catch (error) {
  trackDatabaseError(error as Error, 'SELECT * FROM users');
  throw error;
}
```

### Form Validation Error Tracking

```typescript
import { trackValidationError } from '@/lib/sentry';

const errors = validateForm(data);
if (Object.keys(errors).length > 0) {
  trackValidationError(errors, 'user-registration');
  // Handle validation errors
}
```

### Error Boundary Usage

```typescript
import { SentryErrorBoundaryWrapper } from '@/components/ui/ErrorBoundary';

function App() {
  return (
    <SentryErrorBoundaryWrapper>
      <YourApp />
    </SentryErrorBoundaryWrapper>
  );
}
```

### Performance Tracking

```typescript
import { withPerformanceTracking } from '@/lib/sentry';

const fetchUserData = withPerformanceTracking(
  async (userId: string) => {
    // Your async function
    return await api.getUser(userId);
  },
  'fetch-user-data'
);
```

## Build and Deployment

### Source Maps

Source maps are automatically generated and can be uploaded to Sentry:

```bash
# Create a new release
npm run sentry:create-release

# Upload source maps
npm run sentry:sourcemaps

# Finalize the release
npm run sentry:finalize-release
```

### Environment Configuration

Update `sentry.properties` with your values:

```properties
defaults.url=https://sentry.io/
defaults.org=your-org-slug
defaults.project=your-project-slug
auth.token=your-auth-token
```

## Features

- **Error Tracking**: Automatic capture of JavaScript errors
- **Performance Monitoring**: Track API calls and function performance
- **Session Replay**: Record user sessions for debugging
- **User Context**: Associate errors with specific users
- **Environment Filtering**: Separate development and production errors
- **Source Maps**: Upload source maps for better error debugging

## Best Practices

1. **Don't log sensitive information** - Sentry data may be accessible to your team
2. **Use appropriate error levels** - Use 'warning' for validation errors, 'error' for exceptions
3. **Add context** - Include relevant user, route, and operation information
4. **Filter noise** - Use `beforeSend` to filter out irrelevant errors
5. **Monitor performance** - Track slow operations and optimize accordingly

## Troubleshooting

### Common Issues

1. **DSN not found**: Ensure both `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` are set
2. **Source maps not working**: Check that `productionBrowserSourceMaps: true` is set in `next.config.ts`
3. **Performance data missing**: Verify that `tracesSampleRate` is greater than 0

### Debug Mode

Enable debug mode in development by setting `debug: true` in your Sentry config files.

## Support

For more information, visit:
- [Sentry Documentation](https://docs.sentry.io/)
- [Next.js Integration Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/) 