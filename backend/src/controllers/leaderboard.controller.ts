import { Request, Response } from "express";
import * as leaderboardService from "../services/leaderboard.service";

export async function getLeaderboard(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const entries = await leaderboardService.getLeaderboard(limit);
    res.json({ leaderboard: entries });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to get leaderboard";
    res.status(500).json({ error: message });
  }
}

export async function submitScore(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { score, level, cityName } = req.body;
    const entry = await leaderboardService.submitScore(
      req.user!.id,
      score,
      level,
      cityName
    );
    res.json({ entry });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to submit score";
    res.status(500).json({ error: message });
  }
}

export async function getRank(req: Request, res: Response): Promise<void> {
  try {
    const rank = await leaderboardService.getUserRank(req.user!.id);
    if (!rank) {
      res.status(404).json({ error: "No leaderboard entry found" });
      return;
    }
    res.json({ rank });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to get rank";
    res.status(500).json({ error: message });
  }
}
