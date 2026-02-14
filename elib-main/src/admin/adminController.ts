import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import User from "../user/userModel";
import Book from "../book/bookModel";
import BookRequest from "../book/bookRequestModel";

/* =========================
   ADMIN DASHBOARD STATS
========================= */
export const getAdminStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalBooks = await Book.countDocuments();
    const totalBookRequests = await BookRequest.countDocuments();

    const recentUsers = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentBooks = await Book.find()
      .select("title genre authorName createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentBookRequests = await BookRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      stats: {
        totalUsers,
        totalAdmins,
        totalBooks,
        totalBookRequests,
      },
      recentUsers,
      recentBooks,
      recentBookRequests,
    });
  } catch (error) {
    next(createHttpError(500, "Failed to load admin dashboard stats"));
  }
};

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
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(users);
  } catch (error) {
    next(createHttpError(500, "Failed to load users"));
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
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    // ❌ Safety: Admin delete not allowed
    if (user.role === "admin") {
      return next(
        createHttpError(403, "Admin user cannot be deleted")
      );
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(createHttpError(500, "Failed to delete user"));
  }
};

/* =========================
   GET ALL BOOK REQUESTS (ADMIN) 📩
========================= */
export const getAllBookRequests = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requests = await BookRequest.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(requests);
  } catch (error) {
    next(createHttpError(500, "Failed to load book requests"));
  }
};

/* =========================
   📊 TOP VIEWED BOOKS (ADMIN ANALYTICS) 🔥 NEW
========================= */
export const getTopViewedBooks = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const topBooks = await Book.find()
      .sort({ viewsCount: -1 })
      .limit(5)
      .select("title authorName genre viewsCount createdAt")
      .lean();

    res.status(200).json(topBooks);
  } catch (error) {
    next(createHttpError(500, "Failed to load top viewed books"));
  }
};
