import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { AuthRequest } from "../middlewares/authenticate";

/* =======================
   REGISTER USER
======================= */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next(createHttpError(400, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      wishlist: [],
    });

    const token = sign(
      { sub: user._id.toString(), role: user.role },
      config.jwtSecret as string,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      accessToken: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    next(createHttpError(500, "Error while creating user"));
  }
};

/* =======================
   LOGIN USER
======================= */
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Invalid credentials"));
    }

    const token = sign(
      { sub: user._id.toString(), role: user.role },
      config.jwtSecret as string,
      { expiresIn: "7d" }
    );

    res.json({
      accessToken: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    next(createHttpError(500, "Login failed"));
  }
};

/* =======================
   WISHLIST
======================= */
export const addToWishlist = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const { bookId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid book id" });
  }

  const user = await userModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.wishlist.some((id) => id.toString() === bookId)) {
    return res.status(400).json({ message: "Already in wishlist" });
  }

  user.wishlist.push(new mongoose.Types.ObjectId(bookId));
  await user.save();

  res.json({ message: "Added to wishlist" });
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const { bookId } = req.params;

  const user = await userModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== bookId
  );
  await user.save();

  res.json({ message: "Removed from wishlist" });
};

export const getWishlist = async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;

  const user = await userModel.findById(userId).populate("wishlist");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user.wishlist);
};
