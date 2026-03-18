import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import * as authController from "../controllers/auth.controller";

const router = Router();

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authMiddleware, authController.getMe);

export default router;
