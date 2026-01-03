import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import User from "../user/userModel";
import { AuthRequest } from "./authenticate";

/**
 * 🔐 ADMIN ACCESS MIDDLEWARE
 * ✔ authenticate ke baad use hoga
 */
const isAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req as AuthRequest;

    if (!userId) {
      return next(createHttpError(401, "Unauthorized"));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    // ❌ NOT ADMIN
    if (user.role !== "admin") {
      return next(
        createHttpError(403, "Admin access only ❌")
      );
    }

    // ✅ ADMIN VERIFIED
    next();
  } catch (error) {
    return next(
      createHttpError(500, "Admin verification failed")
    );
  }
};

export default isAdmin;
