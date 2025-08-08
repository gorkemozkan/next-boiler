import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { JWT_CONFIG } from '@/lib/constants';

const JWT_SECRET = process.env.JWT_SECRET!;

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface JWTPayload {}

export interface RefreshTokenPayload {}

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
	return bcrypt.compare(password, hashedPassword);
}

export function generateAccessToken(payload: JWTPayload): string {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
	return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function verifyAccessToken(token: string): JWTPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as JWTPayload;
	} catch {
		return null;
	}
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
	try {
		return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
	} catch {
		return null;
	}
}

export function generateVerificationToken(): string {
	return crypto.randomUUID();
}

export function generateResetToken(): string {
	return crypto.randomUUID();
}

export async function setAuthCookies(accessToken: string, refreshToken: string): Promise<void> {
	const cookieStore = await cookies();

	cookieStore.set('access_token', accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 15 * 60,
	});

	cookieStore.set('refresh_token', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 7 * 24 * 60 * 60,
	});
}

export async function clearAuthCookies(): Promise<void> {
	const cookieStore = await cookies();

	cookieStore.delete('access_token');
	cookieStore.delete('refresh_token');
}

export async function getAccessToken(): Promise<string | undefined> {
	const cookieStore = await cookies();
	return cookieStore.get('access_token')?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
	const cookieStore = await cookies();
	return cookieStore.get('refresh_token')?.value;
}