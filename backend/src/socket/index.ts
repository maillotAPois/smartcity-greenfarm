import { Server } from "socket.io";
import { setupLeaderboardNamespace } from "./leaderboard.socket";

export function initSocket(io: Server): void {
  const leaderboardNsp = io.of("/leaderboard");
  setupLeaderboardNamespace(leaderboardNsp);
}
