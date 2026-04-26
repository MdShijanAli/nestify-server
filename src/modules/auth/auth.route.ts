import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resendVerificationEmailSchema,
  resetPasswordSchema,
  signupSchema,
  verifyForgotPasswordOtpSchema,
} from "./auth.schema";

const router = Router();

router.post(
  "/signup",
  validateRequest(signupSchema),
  AuthController.SignUpUserWithEmail,
);
router.post(
  "/signin",
  validateRequest(loginSchema),
  AuthController.SignInUserWithEmail,
);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  AuthController.ForgotPassword,
);
router.post(
  "/verify-forgot-password-otp",
  validateRequest(verifyForgotPasswordOtpSchema),
  AuthController.VerifyForgotPasswordOTP,
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  AuthController.ResetPassword,
);
router.post(
  "/change-password",
  validateRequest(changePasswordSchema),
  AuthController.ChangePassword,
);
router.post(
  "/resend-verification-email",
  validateRequest(resendVerificationEmailSchema),
  AuthController.ResendVerificationEmail,
);
router.post("/logout", AuthController.Logout);

export const AuthRoutes = router;
