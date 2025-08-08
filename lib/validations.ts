import { z } from 'zod';

export const registerSchema = z.object({});

export const loginSchema = z.object({});

export const forgotPasswordSchema = z.object({});

export const resetPasswordSchema = z.object({});

export const verifyEmailSchema = z.object({});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
