export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  SESSION_EXPIRES_IN_DAYS: 7,
} as const;

export const APP_CONFIG = {
  NAME: '',
  DESCRIPTION: '',
  URL: process.env.APP_URL || 'http://localhost:3000',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
} as const;

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access-token',
  REFRESH_TOKEN: 'refresh-token',
} as const;

export const DB_CONFIG = { URL: process.env.DATABASE_URL as string } as const;
