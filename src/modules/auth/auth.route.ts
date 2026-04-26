import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/signup", AuthController.SignUpUserWithEmail);

export const AuthRoutes = router;
