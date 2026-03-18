import pool from "./db";

export interface GameSave {
  id: string;
  user_id: string;
  name: string;
  state: Record<string, unknown>;
  tick_count: number;
  level: number;
  created_at: Date;
  updated_at: Date;
}

export async function create(
  userId: string,
  name: string,
  state: Record<string, unknown>
): Promise<GameSave> {
  const result = await pool.query<GameSave>(
    `INSERT INTO game_saves (user_id, name, state)
     VALUES ($1, $2, $3::jsonb)
     RETURNING *`,
    [userId, name, JSON.stringify(state)]
  );
  return result.rows[0];
}

export async function findByUser(userId: string): Promise<GameSave[]> {
  const result = await pool.query<GameSave>(
    `SELECT * FROM game_saves WHERE user_id = $1 ORDER BY updated_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function findById(id: string): Promise<GameSave | undefined> {
  const result = await pool.query<GameSave>(
    `SELECT * FROM game_saves WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function update(
  id: string,
  userId: string,
  state: Record<string, unknown>,
  tickCount: number,
  level: number
): Promise<GameSave | undefined> {
  const result = await pool.query<GameSave>(
    `UPDATE game_saves
     SET state = $3::jsonb, tick_count = $4, level = $5, updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId, JSON.stringify(state), tickCount, level]
  );
  return result.rows[0];
}

export async function remove(
  id: string,
  userId: string
): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM game_saves WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return (result.rowCount ?? 0) > 0;
}
