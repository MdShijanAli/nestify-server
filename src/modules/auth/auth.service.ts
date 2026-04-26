import type { IncomingHttpHeaders } from "node:http";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  ResendVerificationEmailPayload,
  ResetPasswordPayload,
  SignUpPayload,
  VerifyForgotPasswordOtpPayload,
} from "./auth.schema";

const buildHeadersInit = (headers: IncomingHttpHeaders): Record<string, string> => {
  const normalizedHeaders: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === "string") {
      normalizedHeaders[key] = value;
      continue;
    }

    if (Array.isArray(value)) {
      normalizedHeaders[key] = value.join(",");
    }
  }

  return normalizedHeaders;
};

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

const SignInUserWithEmail = async (payload: LoginPayload) => {
  try {
    const data = await auth.api.signInEmail({
      body: {
        email: payload.email,
        password: payload.password,
        rememberMe: payload.rememberMe,
        callbackURL: payload.callbackURL,
      },
    });

    return data;
  } catch (error) {
    console.error("[AUTH_SERVICE] Signin error:", error);
    throw error;
  }
};

const ForgotPassword = async (payload: ForgotPasswordPayload) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    if (!existingUser) {
      const notFoundError = new Error("No account found with this email address");
      (notFoundError as Error & { code?: string; statusCode?: number }).code =
        "EMAIL_NOT_FOUND";
      (
        notFoundError as Error & { code?: string; statusCode?: number }
      ).statusCode = 404;
      throw notFoundError;
    }

    const data = await auth.api.requestPasswordResetEmailOTP({
      body: {
        email: payload.email,
      },
    });

    return data;
  } catch (error) {
    console.error("[AUTH_SERVICE] Forgot password error:", error);
    throw error;
  }
};

const VerifyForgotPasswordOTP = async (
  payload: VerifyForgotPasswordOtpPayload,
) => {
  try {
    const data = await auth.api.checkVerificationOTP({
      body: {
        email: payload.email,
        otp: payload.otp,
        type: "forget-password",
      },
    });

    return data;
  } catch (error) {
    console.error("[AUTH_SERVICE] Verify forgot-password OTP error:", error);
    throw error;
  }
};

const ResetPassword = async (payload: ResetPasswordPayload) => {
  try {
    const data = await auth.api.resetPasswordEmailOTP({
      body: {
        email: payload.email,
        otp: payload.otp,
        password: payload.newPassword,
      },
    });

    return data;
  } catch (error) {
    console.error("[AUTH_SERVICE] Reset password error:", error);
    throw error;
  }
};

const ChangePassword = async (
  payload: ChangePasswordPayload,
  headers: IncomingHttpHeaders,
) => {
  try {
    const data = await auth.api.changePassword({
      body: {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
        revokeOtherSessions: payload.revokeOtherSessions,
      },
      headers: buildHeadersInit(headers),
    });

    return data;
  } catch (error) {
    console.error("[AUTH_SERVICE] Change password error:", error);
    throw error;
  }
};

const ResendVerificationEmail = async (
  payload: ResendVerificationEmailPayload,
) => {
  try {
    const data = await auth.api.sendVerificationEmail({
      body: {
        email: payload.email,
        callbackURL: payload.callbackURL,
      },
    });

    return data;
  } catch (error) {
    console.error("[AUTH_SERVICE] Resend verification email error:", error);
    throw error;
  }
};

const Logout = async (headers: IncomingHttpHeaders) => {
  try {
    await auth.api.signOut({ headers: buildHeadersInit(headers) });
  } catch (error) {
    console.error("[AUTH_SERVICE] Logout error:", error);
    throw error;
  }
};

export const AuthService = {
  SignUpUserWithEmail,
  SignInUserWithEmail,
  ForgotPassword,
  VerifyForgotPasswordOTP,
  ResetPassword,
  ChangePassword,
  ResendVerificationEmail,
  Logout,
};
