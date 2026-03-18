import pool from "./db";

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  username: string;
  score: number;
  level: number;
  city_name: string;
  updated_at: Date;
}

export interface RankResult {
  user_id: string;
  username: string;
  score: number;
  level: number;
  city_name: string;
  rank: number;
}

export async function upsert(
  userId: string,
  score: number,
  level: number,
  cityName: string
): Promise<LeaderboardEntry> {
  const result = await pool.query<LeaderboardEntry>(
    `INSERT INTO leaderboard (user_id, score, level, city_name)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id) DO UPDATE
       SET score = EXCLUDED.score,
           level = EXCLUDED.level,
           city_name = EXCLUDED.city_name,
           updated_at = NOW()
     RETURNING leaderboard.*, (
       SELECT username FROM users WHERE users.id = leaderboard.user_id
     ) AS username`,
    [userId, score, level, cityName]
  );
  return result.rows[0];
}

export async function getTop(limit = 10): Promise<LeaderboardEntry[]> {
  const result = await pool.query<LeaderboardEntry>(
    `SELECT l.*, u.username
     FROM leaderboard l
     JOIN users u ON u.id = l.user_id
     ORDER BY l.score DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export async function getUserRank(
  userId: string
): Promise<RankResult | undefined> {
  const result = await pool.query<RankResult>(
    `SELECT
       user_id,
       score,
       level,
       city_name,
       RANK() OVER (ORDER BY score DESC)::int AS rank,
       (SELECT username FROM users WHERE users.id = ranked.user_id) AS username
     FROM leaderboard ranked
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
}
