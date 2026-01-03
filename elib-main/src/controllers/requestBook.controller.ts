import { Request, Response } from "express";
import { sendRequestBookEmail } from "../services/emailservice";
import BookRequest from "../book/bookRequestModel";

/* =========================
   USER: REQUEST A BOOK
========================= */
export const requestBookController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      bookName,
      authorName,
      category,
      userEmail,
      message,
    } = req.body;

    // 🛑 Validation
    if (!bookName || !authorName || !category || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // 💾 SAVE TO MONGODB
    await BookRequest.create({
      bookName,
      authorName,
      category,
      userEmail,
      message,
    });

    // 📧 Send Email
    await sendRequestBookEmail({
      userEmail,
      bookName,
      authorName,
      category,
      message,
    });

    return res.status(200).json({
      success: true,
      message: "Request sent successfully & saved to database",
    });
  } catch (error) {
    console.error("Request Book Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send request",
    });
  }
};

/* =========================
   ADMIN: GET ALL BOOK REQUESTS (NEW)
========================= */
export const getAllBookRequests = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const requests = await BookRequest.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      total: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("GET BOOK REQUESTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch book requests",
    });
  }
};
