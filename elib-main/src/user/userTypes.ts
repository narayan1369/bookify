import { Types } from "mongoose";

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;

  // 🔹 NEW: Wishlist (Book IDs)
  wishlist: Types.ObjectId[];
}
