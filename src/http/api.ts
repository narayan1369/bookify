import axios from "axios";
import useTokenStore from "@/store";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL:
    import.meta.env.VITE_PUBLIC_BACKEND_URL || "http://localhost:7001",
});

/* =========================
   ATTACH JWT TOKEN (FIXED 🔥)
========================= */
api.interceptors.request.use((config) => {
  let token = useTokenStore.getState().token;

  // 🛟 fallback if zustand not hydrated (page refresh)
  if (!token) {
    const stored = localStorage.getItem("auth-store"); // ✅ correct key
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        token = parsed?.state?.token;
      } catch {}
    }
  }

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

/* =========================
   AUTH APIs
========================= */
export const login = (data: {
  email: string;
  password: string;
}) => {
  return api.post("/api/users/login", data);
};

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return api.post("/api/users/register", data);
};

/* =========================
   BOOK APIs
========================= */
export const getBooks = () => {
  return api.get("/api/books");
};

export const getSingleBook = (bookId: string) => {
  return api.get(`/api/books/${bookId}`);
};

export const createBook = (data: FormData) => {
  return api.post("/api/books", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* =========================
   ⭐ CATEGORIES (DERIVED)
========================= */
export const getCategories = async (): Promise<string[]> => {
  const res = await api.get("/api/books");
  const books = res.data || [];

  return Array.from(
    new Set(
      books
        .map((b: any) => b.genre)
        .filter(Boolean)
        .map((c: string) => c.trim())
    )
  );
};

/* =========================
   ⭐ REVIEWS & RATINGS
========================= */
export const addReview = (
  bookId: string,
  data: { rating: number; comment?: string }
) => {
  return api.post(`/api/books/${bookId}/reviews`, data);
};

/* =========================
   🤖 AI RECOMMENDATIONS
========================= */
export const getSimilarBooks = (bookId: string) => {
  return api.get(`/api/books/${bookId}/similar`);
};

export const getRecommendedBooks = () => {
  return api.get(`/api/books/recommendations/me`);
};

/* =========================
   ❤️ WISHLIST
========================= */
export const addToWishlist = (bookId: string) => {
  return api.post(`/api/users/wishlist/${bookId}`);
};

export const removeFromWishlist = (bookId: string) => {
  return api.delete(`/api/users/wishlist/${bookId}`);
};

export const getWishlist = () => {
  return api.get("/api/users/wishlist");
};

/* =========================
   📩 REQUEST A BOOK
========================= */
export const requestBook = (data: {
  bookName: string;
  authorName: string;
  category: string;
  userEmail: string;
  message?: string;
}) => {
  return api.post("/api/request-book", data);
};

export default api;
