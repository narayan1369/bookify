import path from "node:path";
import express from "express";
import multer from "multer";
import authenticate from "../middlewares/authenticate";
import {
  createBook,
  deleteBook,
  getSingleBook,
  listBooks,
  updateBook,
  addReview,
  getSimilarBooks,
  getRecommendedBooks,
} from "./bookController";

const bookRouter = express.Router();

/* =========================
   MULTER CONFIG
========================= */
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: {
    fileSize: 100 * 1024 * 1024, // ✅ 100MB (audio files are large)
  },
});

/* =========================
   BOOK ROUTES
========================= */

/* 📚 CREATE BOOK
   - PDF book  → field: file
   - Audio book → field: audioFile
*/
bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 }, // ✅ required
    { name: "file", maxCount: 1 },       // 📘 PDF (optional if audio)
    { name: "audioFile", maxCount: 1 },  // 🎧 AUDIO (optional if pdf)
  ]),
  createBook
);

/* ✏️ UPDATE BOOK */
bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
  ]),
  updateBook
);

/* 📃 LIST ALL BOOKS */
bookRouter.get("/", listBooks);

/* 🧠 AI: RECOMMENDED FOR LOGGED-IN USER */
bookRouter.get(
  "/recommendations/me",
  authenticate,
  getRecommendedBooks
);

/* 📘 GET SINGLE BOOK */
bookRouter.get("/:bookId", getSingleBook);

/* 🧠 AI: SIMILAR BOOKS */
bookRouter.get("/:bookId/similar", getSimilarBooks);

/* ❌ DELETE BOOK */
bookRouter.delete("/:bookId", authenticate, deleteBook);

/* ⭐ ADD REVIEW & RATING */
bookRouter.post("/:bookId/reviews", authenticate, addReview);

export default bookRouter;
