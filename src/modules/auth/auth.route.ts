import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginSchema, signupSchema } from "./auth.schema";

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
router.post("/logout", AuthController.Logout);

export const AuthRoutes = router;
