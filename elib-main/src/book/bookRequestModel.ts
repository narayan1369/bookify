import mongoose, { Schema, Document } from "mongoose";

/* =========================
   INTERFACE
========================= */
export interface IBookRequest extends Document {
  bookName: string;
  authorName: string;
  category: string;
  userEmail: string;
  message?: string;

  // ✅ NEW (ADMIN WORKFLOW)
  status: "pending" | "approved" | "rejected";
  adminNote?: string;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================
   SCHEMA
========================= */
const bookRequestSchema = new Schema<IBookRequest>(
  {
    bookName: {
      type: String,
      required: true,
      trim: true,
    },

    authorName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
    },

    // ✅ NEW: REQUEST STATUS
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // ✅ NEW: ADMIN NOTE
    adminNote: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  }
);

/* =========================
   MODEL
========================= */
const BookRequest = mongoose.model<IBookRequest>(
  "BookRequest",
  bookRequestSchema
);

export default BookRequest;
