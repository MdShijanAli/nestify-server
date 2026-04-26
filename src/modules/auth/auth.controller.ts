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

const ForgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.ForgotPassword(req.body);

  res.status(200).json({
    success: true,
    message: "A 6-digit verification code has been sent to your email.",
  });
});

const VerifyForgotPasswordOTP = catchAsync(
  async (req: Request, res: Response) => {
    await AuthService.VerifyForgotPasswordOTP(req.body);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now set a new password.",
    });
  },
);

const ResetPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.ResetPassword(req.body);

  res.status(200).json({
    success: true,
    message: "Password reset successfully.",
  });
});

const ChangePassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.ChangePassword(req.body, req.headers);

  res.status(200).json({
    success: true,
    message: "Password changed successfully.",
    data: result,
  });
});

const ResendVerificationEmail = catchAsync(
  async (req: Request, res: Response) => {
    await AuthService.ResendVerificationEmail(req.body);

    res.status(200).json({
      success: true,
      message: "Verification email has been sent.",
    });
  },
);

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
  ForgotPassword,
  VerifyForgotPasswordOTP,
  ResetPassword,
  ChangePassword,
  ResendVerificationEmail,
  Logout,
};
