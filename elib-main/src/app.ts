import express, { Request, Response } from "express";
import cors from "cors";

import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import adminRouter from "./admin/adminRouter";
import requestBookRouter from "./routes/requestBook.routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

/* CORS */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bookify-3bnu.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Bookify API running 🚀" });
});

/* ROUTES */
app.use("/api/auth", userRouter);
app.use("/api/books", bookRouter);
app.use("/api/admin", adminRouter);
app.use("/api", requestBookRouter);

/* 404 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

app.use(globalErrorHandler);

export default app;
