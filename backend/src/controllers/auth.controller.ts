import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import * as UserModel from "../models/user.model";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body;
    const result = await authService.register(username, email, password);
    res.status(201).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    if (
      message === "Username already taken" ||
      message === "Email already registered"
    ) {
      res.status(409).json({ error: message });
      return;
    }
    res.status(500).json({ error: message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed";
    if (message === "Invalid credentials") {
      res.status(401).json({ error: message });
      return;
    }
    res.status(500).json({ error: message });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get user";
    res.status(500).json({ error: message });
  }
}
