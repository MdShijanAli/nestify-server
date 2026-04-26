import type { Request, Response } from "express";
import { ZodError } from "zod";
import { signupSchema } from "./auth.schema";
import { AuthService } from "./auth.service";

const SignUpUserWithEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = signupSchema.parse(req.body);

    const result = await AuthService.SignUpUserWithEmail(validatedData);

    console.log("[AUTH_CONTROLLER] Signup successful:", result);

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: result.user,
    });
  } catch (error) {
    console.error("[AUTH_CONTROLLER] Signup error:", error);
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      }));

      res.status(400).json({
        success: false,
        message: "Validation failed. Please check the highlighted fields.",
        errors: formattedErrors,
      });
      return;
    }

    const err = error as {
      message?: string;
      code?: string;
      statusCode?: number;
      body?: { code?: string; message?: string };
    };

    const duplicateCodes = [
      "EMAIL_ALREADY_EXISTS",
      "USER_ALREADY_EXISTS",
      "UNIQUE_CONSTRAINT_FAILED",
    ];

    const duplicateFromCode =
      (err.code && duplicateCodes.includes(err.code)) ||
      (err.body?.code && duplicateCodes.includes(err.body.code));

    const duplicateFromMessage =
      (typeof err.message === "string" &&
        /already\s*exists|already\s*registered|unique\s*constraint/i.test(
          err.message,
        )) ||
      (typeof err.body?.message === "string" &&
        /already\s*exists|already\s*registered|unique\s*constraint/i.test(
          err.body.message,
        ));

    // Handle duplicate email error (409 - Conflict)
    if (duplicateFromCode || duplicateFromMessage || err.statusCode === 409) {
      res.status(409).json({
        success: false,
        message: "This Email already registered",
      });
      return;
    }

    // Handle generic errors (500 - Internal Server Error)
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again later.",
      // Only expose error details in development
      ...(process.env.NODE_ENV === "development" && {
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    });
  }
};

export const AuthController = {
  SignUpUserWithEmail,
};
