import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import User from "../user/userModel";

/* =========================
   GET ALL USERS (ADMIN)
========================= */
export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    next(createHttpError(500, "Failed to fetch users"));
  }
};

/* =========================
   DELETE USER (ADMIN)
========================= */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    // ❌ extra safety: admin delete nahi ho sakta
    if (user.role === "admin") {
      return next(
        createHttpError(403, "Admin user cannot be deleted")
      );
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    next(createHttpError(500, "Failed to delete user"));
  }
};
