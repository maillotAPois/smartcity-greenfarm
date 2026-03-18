import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

interface LeaderboardEntry {
  userId: string;
  cityName: string;
  score: number;
  level: number;
  population: number;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io("/ws", {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("leaderboard:update", (data: LeaderboardEntry[]) => {
      setLeaderboard(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const submitScore = (entry: Omit<LeaderboardEntry, "userId">) => {
    socketRef.current?.emit("leaderboard:submit", entry);
  };

  return {
    leaderboard,
    connected,
    submitScore,
  };
}
