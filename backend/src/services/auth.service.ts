import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/user.model";

const SALT_ROUNDS = 10;

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
}

export function generateToken(user: { id: string; username: string }): string {
  return jwt.sign({ id: user.id, username: user.username }, getSecret(), {
    expiresIn: "7d",
  });
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<{ token: string; user: UserModel.SafeUser }> {
  const existingUsername = await UserModel.findByUsername(username);
  if (existingUsername) {
    throw new Error("Username already taken");
  }

  const existingEmail = await UserModel.findByEmail(email);
  if (existingEmail) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const created = await UserModel.createUser(username, email, passwordHash);

  const token = generateToken(created);
  const { password_hash: _, ...user } = created;

  return { token, user };
}

export async function login(
  username: string,
  password: string
): Promise<{ token: string; user: UserModel.SafeUser }> {
  const found = await UserModel.findByUsername(username);
  if (!found) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, found.password_hash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(found);
  const { password_hash: _, ...user } = found;

  return { token, user };
}
