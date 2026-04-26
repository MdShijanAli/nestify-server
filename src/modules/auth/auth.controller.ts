import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { catchAsync } from "../../shared/utils/catchAsync";

const SignUpUserWithEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.SignUpUserWithEmail(req.body);

  console.log("[AUTH_CONTROLLER] Signup successful:", result);

  res.status(201).json({
    success: true,
    message: "User registered successfully. Please verify your email.",
    data: result.user,
  });
});

const SignInUserWithEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.SignInUserWithEmail(req.body);

  console.log("[AUTH_CONTROLLER] Signin successful:", result);
  res.status(200).json({
    success: true,
    message: "User signed in successfully.",
    data: result,
  });
});

const Logout = catchAsync(async (req: Request, res: Response) => {
  await AuthService.Logout(req.headers);
  res.status(200).json({
    success: true,
    message: "User logged out successfully.",
  });
});

export const AuthController = {
  SignUpUserWithEmail,
  SignInUserWithEmail,
  Logout,
};
