import mongoose, { Schema, Document } from "mongoose";

export interface IReadingHistory extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;

  // 📖 progress tracking
  progress: number; // 0–100 %

  // 👀 how many times opened
  visitCount: number;

  lastReadAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const readingHistorySchema = new Schema<IReadingHistory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    visitCount: {
      type: Number,
      default: 1,
    },

    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// 🚫 Prevent duplicate history for same user + book
readingHistorySchema.index(
  { user: 1, book: 1 },
  { unique: true }
);

const ReadingHistory = mongoose.model<IReadingHistory>(
  "ReadingHistory",
  readingHistorySchema
);

export default ReadingHistory;
