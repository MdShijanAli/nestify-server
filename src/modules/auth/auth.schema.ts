import { z } from "zod";
import { AppRole } from "../../../generated/prisma/enums";

export const emailSchema = z
  .string()
  .email("Invalid email address")
  .toLowerCase()
  .trim();

export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain uppercase letter")
  .regex(/[0-9]/, "Password must contain number");

export const callbackUrlSchema = z
  .string()
  .url("Invalid callback URL")
  .optional();

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .trim(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .trim()
    .optional(),
  email: emailSchema,
  password: strongPasswordSchema,
  phone: z
    .string()
    .regex(/^[0-9\-\+\s]+$/, "Invalid phone number")
    .optional(),
  image: z.string().url("Invalid image URL").optional(),
  role: z.enum(AppRole).optional().default("user"),
  callbackURL: callbackUrlSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: strongPasswordSchema,
  rememberMe: z.boolean().optional().default(false),
  callbackURL: callbackUrlSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyForgotPasswordOtpSchema = z.object({
  email: emailSchema,
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6 digit number"),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6 digit number"),
  newPassword: strongPasswordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: strongPasswordSchema,
  newPassword: strongPasswordSchema,
  revokeOtherSessions: z.boolean().optional().default(false),
});

export const resendVerificationEmailSchema = z.object({
  email: emailSchema,
  callbackURL: callbackUrlSchema,
});

export type SignUpPayload = z.infer<typeof signupSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;
export type VerifyForgotPasswordOtpPayload = z.infer<
  typeof verifyForgotPasswordOtpSchema
>;
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>;
export type ResendVerificationEmailPayload = z.infer<
  typeof resendVerificationEmailSchema
>;
