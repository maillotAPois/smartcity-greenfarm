import { Request, Response } from "express";
import * as gameService from "../services/game.service";

type IdParams = { id: string };

export async function listGames(req: Request, res: Response): Promise<void> {
  try {
    const saves = await gameService.getUserSaves(req.user!.id);
    res.json({ saves });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list saves";
    res.status(500).json({ error: message });
  }
}

export async function createGame(req: Request, res: Response): Promise<void> {
  try {
    const { name, state } = req.body;
    const save = await gameService.createSave(
      req.user!.id,
      name,
      state ?? {}
    );
    res.status(201).json({ save });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create save";
    res.status(500).json({ error: message });
  }
}

export async function getGame(req: Request<IdParams>, res: Response): Promise<void> {
  try {
    const save = await gameService.getSave(req.params.id, req.user!.id);
    res.json({ save });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get save";
    if (message === "Save not found") {
      res.status(404).json({ error: message });
      return;
    }
    if (message === "Forbidden") {
      res.status(403).json({ error: message });
      return;
    }
    res.status(500).json({ error: message });
  }
}

export async function updateGame(req: Request<IdParams>, res: Response): Promise<void> {
  try {
    const { state, tickCount, level } = req.body;
    const save = await gameService.updateSave(
      req.params.id,
      req.user!.id,
      state,
      tickCount ?? 0,
      level ?? 1
    );
    res.json({ save });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update save";
    if (message === "Save not found or access denied") {
      res.status(404).json({ error: message });
      return;
    }
    res.status(500).json({ error: message });
  }
}

export async function deleteGame(req: Request<IdParams>, res: Response): Promise<void> {
  try {
    await gameService.deleteSave(req.params.id, req.user!.id);
    res.status(204).send();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete save";
    if (message === "Save not found or access denied") {
      res.status(404).json({ error: message });
      return;
    }
    res.status(500).json({ error: message });
  }
}
