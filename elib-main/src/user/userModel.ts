import mongoose, { Schema, Document } from "mongoose";

/* ============================
   User Interface
============================ */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  // 🔐 ROLE BASED ACCESS
  role: "user" | "admin";

  // 📧 EMAIL NOTIFICATION PREFERENCE
  emailNotifications: boolean;

  // ❤️ WISHLIST
  wishlist: mongoose.Types.ObjectId[];

  // 👀 AI: VIEWED BOOKS (NEW - for recommendations)
  viewedBooks: mongoose.Types.ObjectId[];

  // 💳 FUTURE: PURCHASED BOOKS (payment integration)
  purchasedBooks: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

/* ============================
   User Schema
============================ */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 🔐 USER ROLE (admin / user)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 📧 EMAIL NOTIFICATIONS
    emailNotifications: {
      type: Boolean,
      default: true,
    },

    // ❤️ WISHLIST
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],

    // 👀 AI: VIEWED BOOKS (NEW)
    viewedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],

    // 💳 FUTURE: PURCHASED BOOKS
    purchasedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true,
  }
);

/* ============================
   Export Model
============================ */
const User = mongoose.model<IUser>("User", userSchema);
export default User;
