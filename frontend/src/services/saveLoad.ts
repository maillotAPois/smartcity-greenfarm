import type { GameState } from "@/game/state/types";
import * as api from "./api";

export async function saveGame(
  state: GameState,
  saveName?: string,
): Promise<string> {
  const serialized = JSON.stringify(state);
  const name = saveName ?? `${state.cityName} - Tick ${state.tick}`;
  const save = await api.createGame(name, serialized);
  return save.id;
}

export async function loadGame(saveId: string): Promise<Partial<GameState>> {
  const save = await api.getGame(saveId);
  return JSON.parse(save.state) as Partial<GameState>;
}

export function autoSave(
  getState: () => GameState,
  intervalMs: number = 60000,
): () => void {
  const timerId = setInterval(async () => {
    try {
      const state = getState();
      const serialized = JSON.stringify(state);
      const name = `Autosave - ${state.cityName}`;
      await api.createGame(name, serialized);
    } catch {
      // Auto-save failure is non-critical
    }
  }, intervalMs);

  return () => clearInterval(timerId);
}

export function exportLocal(state: GameState): void {
  const serialized = JSON.stringify(state, null, 2);
  const blob = new Blob([serialized], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${state.cityName.replace(/\s+/g, "_")}_tick${state.tick}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function importLocal(file: File): Promise<Partial<GameState>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as Partial<GameState>;
        resolve(parsed);
      } catch (err) {
        reject(new Error("Invalid save file format."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
}
