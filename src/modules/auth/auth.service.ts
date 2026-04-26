import { auth } from "../../lib/auth";
import type { SignUpPayload } from "./auth.schema";

const SignUpUserWithEmail = async (payload: SignUpPayload) => {
  try {
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
