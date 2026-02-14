import mongoose, { Schema, Document } from "mongoose";

/* ============================
   Review Interface
============================ */
interface IReview {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

/* ============================
   Book Interface
============================ */
export interface IBook extends Document {
  title: string;
  description: string;

  // 🔐 uploader (logged-in user)
  author: mongoose.Types.ObjectId;

  // ✅ real book author name (UI)
  authorName: string;

  coverImage: string;

  // 📘 PDF file (for normal books)
  file?: string;

  // 🎧 AUDIO BOOK (NEW)
  audioFile?: string;
  duration?: string;

  // 📚 BOOK TYPE
  bookType: "pdf" | "audio";

  genre: string;

  // 🧠 AI
  tags: string[];
  viewsCount: number;

  // 💳 PAYMENT
  isPaid: boolean;
  price: number;

  // ⭐ Reviews & Ratings
  reviews: IReview[];
  averageRating: number;
  ratingsCount: number;

  createdAt: Date;
  updatedAt: Date;
}

/* ============================
   Review Schema
============================ */
const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/* ============================
   Book Schema
============================ */
const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔐 uploader
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ actual book author name
    authorName: {
      type: String,
      required: true,
      trim: true,
    },

    coverImage: {
      type: String,
      required: true,
    },

    /* =========================
       BOOK TYPE
    ========================= */
    bookType: {
      type: String,
      enum: ["pdf", "audio"],
      default: "pdf",
    },

    /* =========================
       PDF BOOK
    ========================= */
    file: {
      type: String,
    },

    /* =========================
       AUDIO BOOK
    ========================= */
    audioFile: {
      type: String,
    },

    duration: {
      type: String,
    },

    genre: {
      type: String,
      required: true,
      trim: true,
    },

    // 🧠 AI
    tags: {
      type: [String],
      default: [],
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    // 💳 PAYMENT
    isPaid: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      default: 0,
    },

    // ⭐ Reviews & Ratings
    reviews: {
      type: [reviewSchema],
      default: [],
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/* ============================
   Export Model
============================ */
const Book = mongoose.model<IBook>("Book", bookSchema);
export default Book;
