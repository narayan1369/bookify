import { Router } from "express";
import { requestBookController } from "../controllers/requestBook.controller";
import authenticate from "../middlewares/authenticate";
import isAdmin from "../middlewares/isAdmin";
import { getAllBookRequests } from "../controllers/requestBook.controller"; // ✅ NEW

const router = Router();

/* =========================
   USER: REQUEST A BOOK
========================= */
router.post("/request-book", requestBookController);

/* =========================
   ADMIN: VIEW ALL REQUESTS
========================= */
router.get(
  "/admin/book-requests",
  authenticate,
  isAdmin,
  getAllBookRequests
);

export default router;
