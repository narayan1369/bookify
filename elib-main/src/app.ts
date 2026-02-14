import express, { Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import adminRouter from "./admin/adminRouter";
import requestBookRouter from "./routes/requestBook.routes";

const app = express();

/* ======================
   CORS (FIXED)
====================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",        // Vite local
      "http://localhost:3000",        // React (optional)
      "https://bookify.vercel.app"    // future Vercel
    ],
    credentials: true,
  })
);

app.use(express.json());

/* ======================
   ROUTES
====================== */
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to Bookify APIs 🚀" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);
app.use("/api/admin", adminRouter);
app.use("/api", requestBookRouter);

/* ======================
   ERROR HANDLER
====================== */
app.use(globalErrorHandler);

export default app;
