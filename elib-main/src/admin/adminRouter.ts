import { Router } from "express";
import authenticate from "../middlewares/authenticate";
import isAdmin from "../middlewares/isAdmin";
import {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllBookRequests,
  getTopViewedBooks, // ✅ NEW IMPORT
} from "./adminController";

const adminRouter = Router();

/* =========================
   ADMIN ROUTES 🔐
========================= */

// 📊 Dashboard stats
adminRouter.get(
  "/stats",
  authenticate,
  isAdmin,
  getAdminStats
);

// 👥 Get all users
adminRouter.get(
  "/users",
  authenticate,
  isAdmin,
  getAllUsers
);

// ❌ Delete user
adminRouter.delete(
  "/users/:id",
  authenticate,
  isAdmin,
  deleteUser
);

// 📩 Book requests
adminRouter.get(
  "/book-requests",
  authenticate,
  isAdmin,
  getAllBookRequests
);

// 📊 TOP VIEWED BOOKS (ADMIN ANALYTICS) 🔥 NEW
adminRouter.get(
  "/top-viewed-books",
  authenticate,
  isAdmin,
  getTopViewedBooks
);

export default adminRouter;
