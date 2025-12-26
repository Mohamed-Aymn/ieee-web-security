import { Request, Response, NextFunction } from "express";
import { validateSession, SessionData } from "../../services/session";

// Extend Express Request type to include session
declare global {
  namespace Express {
    interface Request {
      session?: SessionData;
    }
  }
}

/**
 * Middleware to validate session from cookie
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies?.sessionId;

  if (!token) {
    res.status(401).json({ authenticated: false, message: "No session token provided" });
    return;
  }

  const session = await validateSession(token);

  if (!session) {
    res.status(401).json({ authenticated: false, message: "Invalid or expired session" });
    return;
  }

  // Attach session to request object
  req.session = session;
  next();
};

/**
 * Optional auth middleware - attaches session if present but doesn't require it
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies?.sessionId;

  if (token) {
    const session = await validateSession(token);
    if (session) {
      req.session = session;
    }
  }

  next();
};

