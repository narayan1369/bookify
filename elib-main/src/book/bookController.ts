import path from "node:path";
import fs from "node:fs";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import Book from "./bookModel";
import User from "../user/userModel";
import { AuthRequest } from "../middlewares/authenticate";
import { sendNewBookNotification } from "../services/emailservice";

/* =========================
   CREATE BOOK (PDF + AUDIO)
========================= */
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      genre,
      description,
      authorName,
      bookType = "pdf",
      duration,
      isPaid = "false",
      price = "0",
    } = req.body;

    if (!title || !genre || !description || !authorName) {
      return next(
        createHttpError(
          400,
          "Title, genre, description and author name are required"
        )
      );
    }

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!files?.coverImage) {
      return next(createHttpError(400, "Cover image is required"));
    }

    if (bookType === "pdf" && !files?.file) {
      return next(createHttpError(400, "PDF file is required"));
    }

    if (bookType === "audio" && !files?.audioFile) {
      return next(createHttpError(400, "Audio file is required"));
    }

    /* ---------- Upload cover image ---------- */
    const cover = files.coverImage[0];
    const coverPath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      cover.filename
    );

    const coverUpload = await cloudinary.uploader.upload(coverPath, {
      folder: "book-covers",
    });

    /* ---------- Upload PDF or AUDIO ---------- */
    let fileUrl: string | undefined;
    let audioUrl: string | undefined;

    if (bookType === "pdf") {
      const pdf = files.file[0];
      const pdfPath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        pdf.filename
      );

      const pdfUpload = await cloudinary.uploader.upload(pdfPath, {
        resource_type: "raw",
        access_mode: "public",
        folder: "book-pdfs",
      });

      fileUrl = pdfUpload.secure_url;
      await fs.promises.unlink(pdfPath);
    }

    if (bookType === "audio") {
      const audio = files.audioFile[0];
      const audioPath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        audio.filename
      );

      const audioUpload = await cloudinary.uploader.upload(audioPath, {
        resource_type: "video",
        folder: "audio-books",
      });

      audioUrl = audioUpload.secure_url;
      await fs.promises.unlink(audioPath);
    }

    const { userId } = req as AuthRequest;

    const book = await Book.create({
      title: title.trim(),
      genre: genre.trim(),
      description: description.trim(),
      author: userId,
      authorName: authorName.trim(),
      coverImage: coverUpload.secure_url,

      // 📚 TYPE
      bookType,

      // 📘 PDF
      file: fileUrl,

      // 🎧 AUDIO
      audioFile: audioUrl,
      duration,

      // 💳 PAYMENT
      isPaid: isPaid === "true",
      price: Number(price) || 0,

      reviews: [],
      averageRating: 0,
      ratingsCount: 0,
    });

    await fs.promises.unlink(coverPath);

    /* ---------- EMAIL NOTIFICATION ---------- */
    try {
      const users = await User.find({ role: "user" })
        .select("email")
        .lean();

      const userEmails = users.map((u) => u.email);

      if (userEmails.length > 0) {
        await sendNewBookNotification({
          title: book.title,
          authorName: book.authorName,
          genre: book.genre,
          userEmails,
        });
      }
    } catch (err) {
      console.error("EMAIL NOTIFICATION FAILED:", err);
    }

    res.status(201).json(book);
  } catch (error) {
    console.error("CREATE BOOK ERROR:", error);
    next(createHttpError(500, "Error creating book"));
  }
};

/* =========================
   UPDATE BOOK
========================= */
export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;
    const { userId } = req as AuthRequest;

    const book = await Book.findById(bookId);
    if (!book) return next(createHttpError(404, "Book not found"));

    if (book.author.toString() !== userId) {
      return next(createHttpError(403, "Not allowed"));
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.description,
        authorName: req.body.authorName,
        price: req.body.price,
        isPaid: req.body.isPaid,
      },
      { new: true }
    );

    res.json(updatedBook);
  } catch (error) {
    next(createHttpError(500, "Error updating book"));
  }
};

/* =========================
   LIST BOOKS
========================= */
export const listBooks = async (_req: Request, res: Response) => {
  try {
    const books = await Book.find()
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    res.json(books);
  } catch {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

/* =========================
   GET SINGLE BOOK
========================= */
export const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return next(createHttpError(404, "Book not found"));

    const authReq = req as AuthRequest;

    if (authReq.userId) {
      await User.findByIdAndUpdate(authReq.userId, {
        $addToSet: { viewedBooks: book._id },
      });
    }

    res.json(book);
  } catch {
    next(createHttpError(500, "Error fetching book"));
  }
};

/* =========================
   DELETE BOOK
========================= */
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { bookId } = req.params;
  const { userId } = req as AuthRequest;

  const book = await Book.findById(bookId);
  if (!book) return next(createHttpError(404, "Book not found"));

  if (book.author.toString() !== userId) {
    return next(createHttpError(403, "Not allowed"));
  }

  await Book.findByIdAndDelete(bookId);
  res.sendStatus(204);
};

/* =========================
   ADD REVIEW ⭐
========================= */
export const addReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;
    const { userId } = req as AuthRequest;

    if (!rating || rating < 1 || rating > 5) {
      return next(createHttpError(400, "Rating must be between 1 and 5"));
    }

    const book = await Book.findById(bookId);
    if (!book) return next(createHttpError(404, "Book not found"));

    if (book.reviews.some((r: any) => r.user.toString() === userId)) {
      return next(createHttpError(400, "Already reviewed"));
    }

    book.reviews.push({
      user: new mongoose.Types.ObjectId(userId),
      rating,
      comment,
      createdAt: new Date(),
    });

    book.ratingsCount = book.reviews.length;
    book.averageRating =
      book.reviews.reduce((s: number, r: any) => s + r.rating, 0) /
      book.reviews.length;

    await book.save();

    res.status(201).json({
      averageRating: book.averageRating,
      ratingsCount: book.ratingsCount,
    });
  } catch {
    next(createHttpError(500, "Error adding review"));
  }
};

/* =========================
   🧠 SIMILAR BOOKS
========================= */
export const getSimilarBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return next(createHttpError(404, "Book not found"));

    const similarBooks = await Book.find({
      _id: { $ne: book._id },
      genre: book.genre,
    })
      .limit(6)
      .lean();

    res.json(similarBooks);
  } catch {
    next(createHttpError(500, "Failed to fetch similar books"));
  }
};

/* =========================
   🧠 RECOMMENDED BOOKS
========================= */
export const getRecommendedBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req as AuthRequest;
    const user = await User.findById(userId);

    if (!user || !user.viewedBooks?.length) {
      const latest = await Book.find().sort({ createdAt: -1 }).limit(10);
      return res.json(latest);
    }

    const viewedBooks = await Book.find({
      _id: { $in: user.viewedBooks },
    });

    const genres = viewedBooks.map((b) => b.genre);

    const recommended = await Book.find({
      genre: { $in: genres },
      _id: { $nin: user.viewedBooks },
    })
      .limit(10)
      .lean();

    res.json(recommended);
  } catch {
    next(createHttpError(500, "Failed to fetch recommendations"));
  }
};
