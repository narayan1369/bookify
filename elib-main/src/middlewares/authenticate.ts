import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

/* =======================
   Auth Request Interface
======================= */
export interface AuthRequest extends Request {
  userId: string;
  role?: "admin" | "user";
}

/* =======================
   AUTHENTICATE USER
======================= */
const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // ❌ No token
  if (!authHeader) {
    return next(createHttpError(401, "Authorization header missing"));
  }

  // ❌ Wrong format
  if (!authHeader.startsWith("Bearer ")) {
    return next(
      createHttpError(401, "Authorization format must be Bearer token")
    );
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = verify(
      token,
      config.jwtSecret as string
    ) as {
      sub: string;
      role?: "admin" | "user";
    };

    // ✅ Attach to request
    (req as AuthRequest).userId = decoded.sub;
    (req as AuthRequest).role = decoded.role || "user";

    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};

export default authenticate;

/* =======================
   ADMIN GUARD
======================= */
export const isAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { role } = req as AuthRequest;

  if (role !== "admin") {
    return next(
      createHttpError(403, "Admin access required")
    );
  }

  next();
};
