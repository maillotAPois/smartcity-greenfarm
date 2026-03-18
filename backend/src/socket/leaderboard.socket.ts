import { Namespace } from "socket.io";
import jwt from "jsonwebtoken";
import * as leaderboardService from "../services/leaderboard.service";
import { AuthUser } from "../middleware/auth.middleware";

export function setupLeaderboardNamespace(nsp: Namespace): void {
  nsp.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) {
      next(new Error("Authentication required"));
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      next(new Error("Server misconfigured"));
      return;
    }

    try {
      const decoded = jwt.verify(token, secret) as AuthUser;
      socket.data.user = { id: decoded.id, username: decoded.username };
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  nsp.on("connection", async (socket) => {
    try {
      const leaderboard = await leaderboardService.getLeaderboard(10);
      socket.emit("leaderboard:top", leaderboard);
    } catch {
      socket.emit("error", { message: "Failed to load leaderboard" });
    }

    socket.on("score:submit", async (data: {
      score: number;
      level: number;
      cityName: string;
    }) => {
      try {
        const user = socket.data.user as AuthUser;
        await leaderboardService.submitScore(
          user.id,
          data.score,
          data.level,
          data.cityName
        );
        const leaderboard = await leaderboardService.getLeaderboard(10);
        nsp.emit("leaderboard:top", leaderboard);
      } catch {
        socket.emit("error", { message: "Failed to submit score" });
      }
    });
  });
}
