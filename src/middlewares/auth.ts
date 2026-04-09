import { Request, Response, NextFunction } from "express";
import { AuthService, AuthPayload } from "../services/auth.service";
import { UserRole } from "../entities/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

const authService = new AuthService();

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  try {
    const token = header.slice(7);
    req.user = authService.verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
}
