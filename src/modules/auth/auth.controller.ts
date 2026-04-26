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
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    // Handle duplicate email error (409 - Conflict)
    if (error instanceof Error && error.message.includes("unique constraint")) {
      res.status(409).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    // Handle generic errors (500 - Internal Server Error)
    console.error("[AUTH_CONTROLLER] Signup error:", error);
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
