import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  // Environment
  environment: process.env.NODE_ENV,

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Before send function to filter out certain errors
  beforeSend(event, hint) {
    // Don't send errors from localhost in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    // Filter out certain error types if needed
    if (event.exception) {
      const exception = event.exception.values?.[0];
      if (exception?.type === 'ChunkLoadError') {
        return null; // Don't send chunk load errors
      }
    }

    return event;
  },

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      // Additional replay options
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
});
