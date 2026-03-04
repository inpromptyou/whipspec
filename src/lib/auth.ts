import { getSql } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "whipspec-dev-secret-change-me";
const TOKEN_EXPIRY = "7d";

export interface User {
  id: number;
  name: string;
  email: string;
  account_type: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  created_at: string;
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  accountType: "creator" | "shop"
): Promise<User> {
  const sql = getSql();
  const hash = await bcrypt.hash(password, 12);

  const rows = await sql`
    INSERT INTO users (name, email, password_hash, account_type)
    VALUES (${name}, ${email}, ${hash}, ${accountType})
    RETURNING id, name, email, account_type, avatar_url, bio, location, created_at
  `;

  return rows[0] as User;
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const sql = getSql();

  const rows = await sql`
    SELECT id, name, email, password_hash, account_type, avatar_url, bio, location, created_at
    FROM users WHERE email = ${email}
  `;

  if (rows.length === 0) return null;

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash as string);
  if (!valid) return null;

  const { password_hash: _, ...safeUser } = user;
  return safeUser as User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email, accountType: user.account_type },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyToken(token: string): { userId: number; email: string; accountType: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string; accountType: string };
  } catch {
    return null;
  }
}

export async function getUserFromToken(token: string): Promise<User | null> {
  const payload = verifyToken(token);
  if (!payload) return null;

  const sql = getSql();
  const rows = await sql`
    SELECT id, name, email, account_type, avatar_url, bio, location, created_at
    FROM users WHERE id = ${payload.userId}
  `;

  return rows.length > 0 ? (rows[0] as User) : null;
}
