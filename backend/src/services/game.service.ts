import * as GameSaveModel from "../models/game-save.model";

export async function createSave(
  userId: string,
  name: string,
  initialState: Record<string, unknown>
): Promise<GameSaveModel.GameSave> {
  return GameSaveModel.create(userId, name, initialState);
}

export async function getUserSaves(
  userId: string
): Promise<GameSaveModel.GameSave[]> {
  return GameSaveModel.findByUser(userId);
}

export async function getSave(
  id: string,
  userId: string
): Promise<GameSaveModel.GameSave> {
  const save = await GameSaveModel.findById(id);
  if (!save) {
    throw new Error("Save not found");
  }
  if (save.user_id !== userId) {
    throw new Error("Forbidden");
  }
  return save;
}

export async function updateSave(
  id: string,
  userId: string,
  state: Record<string, unknown>,
  tickCount: number,
  level: number
): Promise<GameSaveModel.GameSave> {
  const updated = await GameSaveModel.update(id, userId, state, tickCount, level);
  if (!updated) {
    throw new Error("Save not found or access denied");
  }
  return updated;
}

export async function deleteSave(
  id: string,
  userId: string
): Promise<void> {
  const deleted = await GameSaveModel.remove(id, userId);
  if (!deleted) {
    throw new Error("Save not found or access denied");
  }
}
