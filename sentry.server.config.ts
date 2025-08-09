import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Environment
  environment: process.env.NODE_ENV,

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Before send function to filter out certain errors
  beforeSend(event, _hint) {
    // Don't send errors from localhost in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    // Filter out certain error types if needed
    if (event.exception) {
      const exception = event.exception.values?.[0];
      if (exception?.type === 'DatabaseConnectionError') {
        return null; // Don't send database connection errors
      }
    }

    return event;
  },

  // Additional server-specific options
  serverName: process.env.HOSTNAME || 'unknown',

  // Enable source maps in production
  attachStacktrace: true,
});
