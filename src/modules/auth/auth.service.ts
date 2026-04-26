import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import type { SignUpPayload } from "./auth.schema";

const SignUpUserWithEmail = async (payload: SignUpPayload) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    if (existingUser) {
      const conflictError = new Error("This Email already registered");
      (conflictError as Error & { code?: string; statusCode?: number }).code =
        "EMAIL_ALREADY_EXISTS";
      (
        conflictError as Error & { code?: string; statusCode?: number }
      ).statusCode = 409;
      throw conflictError;
    }

    const fullName = [payload.firstName, payload.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const response = await auth.api.signUpEmail({
      body: {
        name: fullName,
        firstName: payload.firstName,
        lastName: payload.lastName || undefined,
        role: payload.role || "user",
        email: payload.email,
        password: payload.password,
        image: payload.image,
        callbackURL: payload.callbackURL,
      },
    });

    return response;
  } catch (error) {
    console.error("[AUTH_SERVICE] Signup error:", error);
    throw error;
  }
};

export const AuthService = {
  SignUpUserWithEmail,
};
