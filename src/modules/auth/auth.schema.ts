import { z } from "zod";
import { AppRole } from "../../../generated/prisma/enums";

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
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[0-9]/, "Password must contain number"),
  phone: z
    .string()
    .regex(/^[0-9\-\+\s]+$/, "Invalid phone number")
    .optional(),
  image: z.string().url("Invalid image URL").optional(),
  role: z.enum(AppRole).optional().default("user"),
  callbackURL: z.string().url("Invalid callback URL").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional().default(false),
  callbackURL: z.string().url("Invalid callback URL").optional(),
});

export type SignUpPayload = z.infer<typeof signupSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
