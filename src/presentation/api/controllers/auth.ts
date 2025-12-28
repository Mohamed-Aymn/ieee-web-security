import { Request, Response } from "express";
import { getDB } from "../../../presistence";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "../../../services/session";

// Cookie security settings
const getCookieOptions = () => {
  const cookieSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
  return {
    httpOnly: true, // Prevents XSS attacks by making cookie inaccessible to JavaScript
    secure: cookieSecure, // HT TPS only - prevents cookie transmission over insecure connections
    sameSite: 'strict' as const, // CSRF protection - strict mode (most secure)
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    path: '/', // Cookie available for entire site
  };
};


export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username } = req.body;

  try {
    const user = await getDB()
      .collection("users")
      .findOne({username: username});

    if (!user) {
      return res.status(401).json({ message: "No user found" });
    }

    const { password } = req.body;
    const verified = await bcrypt.compare(password, user.passwordHash);

    if (verified) {
      // Create session in database
      const sessionToken = await createSession(
        user._id.toString(),
        user.username
      );

      // Set secure cookie manually
      res.cookie('sessionId', sessionToken, getCookieOptions());

      return res.json({ success: true, username: user.username });
    }

    return res.status(401).json({ message: "Wrong password" });

  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.cookies?.sessionId;

    if (token) {
      // Delete session from database
      await deleteSession(token);
    }

    // Clear the session cookie with same security settings
    const cookieSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
    res.clearCookie('sessionId', {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'strict',
      path: '/',
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to logout" });
  }
};

export const getSession = async (req: Request, res: Response): Promise<Response> => {
  // Session is attached by optionalAuth middleware if valid
  if (req.session) {
    return res.json({
      authenticated: true,
      username: req.session.username,
      userId: req.session.userId,
    });
  }

  return res.status(401).json({ authenticated: false, message: "Not authenticated" });
};
