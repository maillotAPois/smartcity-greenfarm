import { GameSpeed } from "@/game/state/types";

const SPEED_TO_MS: Record<GameSpeed, number> = {
  [GameSpeed.PAUSED]: 0,
  [GameSpeed.NORMAL]: 1000,
  [GameSpeed.FAST]: 500,
  [GameSpeed.ULTRA]: 200,
};

export class GameLoop {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private _speed: GameSpeed = GameSpeed.NORMAL;
  private _running = false;
  private _tickCallback: (() => void) | null = null;

  get running(): boolean {
    return this._running;
  }

  get speed(): GameSpeed {
    return this._speed;
  }

  onTick(callback: () => void): void {
    this._tickCallback = callback;
  }

  start(): void {
    if (this._running) return;
    this._running = true;
    this.scheduleInterval();
  }

  stop(): void {
    this._running = false;
    this.clearInterval();
  }

  setSpeed(speed: GameSpeed): void {
    this._speed = speed;
    if (speed === GameSpeed.PAUSED) {
      this.clearInterval();
      return;
    }
    if (this._running) {
      this.clearInterval();
      this.scheduleInterval();
    }
  }

  private scheduleInterval(): void {
    const ms = SPEED_TO_MS[this._speed];
    if (ms === 0) return;
    this.intervalId = setInterval(() => {
      this._tickCallback?.();
    }, ms);
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  destroy(): void {
    this.stop();
    this._tickCallback = null;
  }
}
