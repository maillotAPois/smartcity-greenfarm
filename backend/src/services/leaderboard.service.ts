import * as LeaderboardModel from "../models/leaderboard.model";

export async function submitScore(
  userId: string,
  score: number,
  level: number,
  cityName: string
): Promise<LeaderboardModel.LeaderboardEntry> {
  return LeaderboardModel.upsert(userId, score, level, cityName);
}

export async function getLeaderboard(
  limit = 10
): Promise<LeaderboardModel.LeaderboardEntry[]> {
  return LeaderboardModel.getTop(limit);
}

export async function getUserRank(
  userId: string
): Promise<LeaderboardModel.RankResult | undefined> {
  return LeaderboardModel.getUserRank(userId);
}
