const API_BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

function setToken(token: string): void {
  localStorage.setItem("token", token);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API error ${response.status}: ${errorBody}`);
  }

  return response.json() as Promise<T>;
}

// -- Auth --

interface AuthResponse {
  token: string;
  user: { id: string; email: string; username: string };
}

export async function register(
  email: string,
  username: string,
  password: string,
): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  });
  setToken(data.token);
  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function getMe(): Promise<AuthResponse["user"]> {
  return request("/auth/me");
}

// -- Games --

interface GameSave {
  id: string;
  name: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export async function listGames(): Promise<GameSave[]> {
  return request("/games");
}

export async function createGame(name: string, state: string): Promise<GameSave> {
  return request("/games", {
    method: "POST",
    body: JSON.stringify({ name, state }),
  });
}

export async function getGame(id: string): Promise<GameSave> {
  return request(`/games/${id}`);
}

export async function updateGame(id: string, state: string): Promise<GameSave> {
  return request(`/games/${id}`, {
    method: "PUT",
    body: JSON.stringify({ state }),
  });
}

export async function deleteGame(id: string): Promise<void> {
  await request(`/games/${id}`, { method: "DELETE" });
}

// -- Leaderboard --

interface LeaderboardEntry {
  userId: string;
  cityName: string;
  score: number;
  level: number;
  rank: number;
}

export async function getTop(limit = 50): Promise<LeaderboardEntry[]> {
  return request(`/leaderboard?limit=${limit}`);
}

export async function submitScore(data: {
  cityName: string;
  score: number;
  level: number;
  population: number;
}): Promise<void> {
  await request("/leaderboard", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// -- Achievements --

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
}

export async function getAllAchievements(): Promise<Achievement[]> {
  return request("/achievements");
}

export async function getMyAchievements(): Promise<Achievement[]> {
  return request("/achievements/mine");
}
