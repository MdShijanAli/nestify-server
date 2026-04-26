import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/signup", AuthController.SignUpUserWithEmail);
router.post("/signin", AuthController.SignInUserWithEmail);

export const AuthRoutes = router;
