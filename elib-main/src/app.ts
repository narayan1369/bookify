import express, { Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import adminRouter from "./admin/adminRouter";
import requestBookRouter from "./routes/requestBook.routes"; // ✅ ADD
import { config } from "./config/config";

const app = express();

app.use(
  cors({
    origin: config.frontendDomain,
  })
);

app.use(express.json());

// ======================
// ROUTES
// ======================
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to elib APIs" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// 🔐 ADMIN ROUTES
app.use("/api/admin", adminRouter);

// 📩 REQUEST BOOK ROUTE
app.use("/api", requestBookRouter); // ✅ FIXED

// ======================
// GLOBAL ERROR HANDLER
// ======================
app.use(globalErrorHandler);

export default app;
