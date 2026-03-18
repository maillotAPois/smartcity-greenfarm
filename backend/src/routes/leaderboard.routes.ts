import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import * as leaderboardController from "../controllers/leaderboard.controller";

const router = Router();

const submitSchema = z.object({
  score: z.number().int().nonnegative("Score must be non-negative"),
  level: z.number().int().positive("Level must be positive"),
  cityName: z.string().min(1, "City name is required"),
});

router.get("/", leaderboardController.getLeaderboard);
router.post(
  "/",
  authMiddleware,
  validate(submitSchema),
  leaderboardController.submitScore
);
router.get("/me", authMiddleware, leaderboardController.getRank);

export default router;
