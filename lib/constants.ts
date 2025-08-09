export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  SESSION_EXPIRES_IN_DAYS: 7,
  SECRET: process.env.JWT_SECRET as string,
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  ISSUER: process.env.JWT_ISSUER || 'next-boiler',
  AUDIENCE: process.env.JWT_AUDIENCE || 'users',
} as const;

export const APP_CONFIG = {
  NAME: 'Next Boiler',
  DESCRIPTION: 'Next.js Boilerplate Application',
  URL: process.env.APP_URL || 'http://localhost:3000',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  HOSTNAME: process.env.HOSTNAME || 'localhost',
  GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID || '',
} as const;

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access-token',
  REFRESH_TOKEN: 'refresh-token',
} as const;

export const DB_CONFIG = {
  URL: process.env.DATABASE_URL as string,
  HOST: process.env.DATABASE_HOST || 'localhost',
  PORT: parseInt(process.env.DATABASE_PORT || '5432', 10),
  NAME: process.env.DATABASE_NAME || 'next_boiler',
  USER: process.env.DATABASE_USER || 'postgres',
  PASSWORD: process.env.DATABASE_PASSWORD || '',
} as const;

export const AUTH_CONFIG = {
  COOKIE_SECRET: process.env.COOKIE_SECRET as string,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
} as const;

export const EXTERNAL_SERVICES = {
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  SMTP: {
    HOST: process.env.SMTP_HOST || 'localhost',
    PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    USER: process.env.SMTP_USER || '',
    PASS: process.env.SMTP_PASS || '',
    FROM: process.env.SMTP_FROM || 'noreply@localhost',
  },
} as const;

export const API_KEYS = {
  STRIPE: {
    SECRET: process.env.STRIPE_SECRET_KEY || '',
    PUBLISHABLE: process.env.STRIPE_PUBLISHABLE_KEY || '',
  },
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  },
} as const;

export const MONITORING = {
  SENTRY_DSN: process.env.SENTRY_DSN || '',
  ANALYTICS_ID: process.env.ANALYTICS_ID || '',
} as const;
