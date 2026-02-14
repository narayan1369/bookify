import express from "express";
import {
  createUser,
  loginUser,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "./userController";
import authenticate from "../middlewares/authenticate";

const userRouter = express.Router();

/* =======================
   AUTH ROUTES
======================= */
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

/* =======================
   WISHLIST ROUTES (PROTECTED)
======================= */
userRouter.post(
  "/wishlist/:bookId",
  authenticate,
  addToWishlist
);

userRouter.delete(
  "/wishlist/:bookId",
  authenticate,
  removeFromWishlist
);

userRouter.get(
  "/wishlist",
  authenticate,
  getWishlist
);

export default userRouter;
