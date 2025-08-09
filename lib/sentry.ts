import * as Sentry from '@sentry/nextjs';

export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};

export const setUser = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser(user);
};

export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

export const setContext = (name: string, context: Record<string, any>) => {
  Sentry.setContext(name, context);
};

export const withSentryErrorTracking = <T extends any[], R>(
  fn: (...args: T) => Promise<R> | R,
  operationName: string
) => {
  return async (...args: T): Promise<R> => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      captureException(error as Error, {
        operation: operationName,
        args: args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))),
      });
      throw error;
    }
  };
};

export const trackDatabaseError = (error: Error, query?: string, params?: any[]) => {
  captureException(error, {
    tags: {
      component: 'database',
    },
    extra: {
      query,
      params: params?.map((param) =>
        typeof param === 'object' ? JSON.stringify(param) : String(param)
      ),
    },
  });
};

export const trackAuthError = (error: Error, userId?: string, action?: string) => {
  captureException(error, {
    tags: {
      component: 'authentication',
      action: action || 'unknown',
    },
    extra: {
      userId,
      action,
    },
  });
};

export const trackApiError = (error: Error, route: string, method: string, userId?: string) => {
  captureException(error, {
    tags: {
      component: 'api',
      route,
      method,
    },
    extra: {
      route,
      method,
      userId,
    },
  });
};

export const trackValidationError = (errors: Record<string, string[]>, formName: string) => {
  captureMessage(`Validation errors in ${formName}`, 'warning');
  setContext('validation_errors', {
    form: formName,
    errors,
  });
};

export const withPerformanceTracking = <T extends any[], R>(
  fn: (...args: T) => Promise<R> | R,
  operationName: string
) => {
  return async (...args: T): Promise<R> => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      captureException(error as Error, {
        operation: operationName,
      });
      throw error;
    }
  };
};
