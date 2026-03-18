import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import * as gameController from "../controllers/game.controller";

const router = Router();

router.use(authMiddleware);

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  state: z.record(z.unknown()).optional(),
});

const updateSchema = z.object({
  state: z.record(z.unknown()),
  tickCount: z.number().int().nonnegative().optional(),
  level: z.number().int().positive().optional(),
});

router.get("/", gameController.listGames);
router.post("/", validate(createSchema), gameController.createGame);
router.get("/:id", gameController.getGame);
router.put("/:id", validate(updateSchema), gameController.updateGame);
router.delete("/:id", gameController.deleteGame);

export default router;
