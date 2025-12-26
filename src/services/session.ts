import { randomBytes } from "crypto";
import { getDB } from "../presistence";

export interface SessionData {
  userId: string;
  username: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const SESSION_TOKEN_LENGTH = 32; // 256 bits
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a cryptographically secure random session token
 */
export function generateSessionToken(): string {
  return randomBytes(SESSION_TOKEN_LENGTH).toString("hex");
}

/**
 * Create a new session in the database
 */
export async function createSession(
  userId: string,
  username: string
): Promise<string> {
  const token = generateSessionToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

  const sessionData: SessionData = {
    userId,
    username,
    token,
    expiresAt,
    createdAt: now,
  };

  await getDB().collection<SessionData>("sessions").insertOne(sessionData);

  return token;
}

/**
 * Validate and retrieve session data by token
 */
export async function validateSession(
  token: string
): Promise<SessionData | null> {
  const session = await getDB()
    .collection<SessionData>("sessions")
    .findOne({ token });

  if (!session) {
    return null;
  }

  // Check if session has expired
  if (new Date() > session.expiresAt) {
    // Clean up expired session
    await deleteSession(token);
    return null;
  }

  return session;
}

/**
 * Delete a session by token
 */
export async function deleteSession(token: string): Promise<void> {
  await getDB().collection("sessions").deleteOne({ token });
}

/**
 * Delete all sessions for a user
 */
export async function deleteUserSessions(userId: string): Promise<void> {
  await getDB().collection("sessions").deleteMany({ userId });
}

/**
 * Clean up expired sessions (can be run periodically)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await getDB()
    .collection("sessions")
    .deleteMany({ expiresAt: { $lt: new Date() } });

  return result.deletedCount || 0;
}

/**
 * Extend session expiration
 */
export async function extendSession(token: string): Promise<boolean> {
  const newExpiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const result = await getDB()
    .collection("sessions")
    .updateOne({ token }, { $set: { expiresAt: newExpiresAt } });

  return result.modifiedCount > 0;
}

