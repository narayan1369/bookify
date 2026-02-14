<<<<<<< HEAD
import express, { Request, Response, NextFunction } from "express";
=======
import express from "express";
>>>>>>> 063aaa9 (update api)
import cors from "cors";

import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import adminRouter from "./admin/adminRouter";
import requestBookRouter from "./routes/requestBook.routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

<<<<<<< HEAD
/* ===========================
   CORS CONFIG (VERY IMPORTANT)
=========================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://bookify-3bnu.vercel.app",
      "https://bookify.vercel.app",
    ],
    credentials: true,
  })
);
=======
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://bookify-3bnu.vercel.app"
  ],
  credentials: true,
}));
>>>>>>> 063aaa9 (update api)

/* ===========================
   BODY PARSER
=========================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
/* ===========================
   HEALTH CHECK
=========================== */
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to Bookify APIs 🚀" });
});

/* ===========================
   ROUTES
=========================== */

// AUTH ROUTES
app.use("/api/auth", userRouter);

// BOOK ROUTES
=======
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to Bookify APIs 🚀" });
});

/* ✅ AUTH ROUTES */
app.use("/api/auth", userRouter);

/* OTHER ROUTES */
>>>>>>> 063aaa9 (update api)
app.use("/api/books", bookRouter);

// ADMIN ROUTES
app.use("/api/admin", adminRouter);

// REQUEST BOOK ROUTES
app.use("/api", requestBookRouter);

<<<<<<< HEAD
/* ===========================
   404 HANDLER
=========================== */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

/* ===========================
   GLOBAL ERROR HANDLER
=========================== */
app.use(globalErrorHandler);

=======
>>>>>>> 063aaa9 (update api)
export default app;
