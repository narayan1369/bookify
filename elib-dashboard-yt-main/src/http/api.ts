import axios, { AxiosHeaders } from "axios";
import useTokenStore from "@/store";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL:
    import.meta.env.VITE_PUBLIC_BACKEND_URL ||
    "http://localhost:7001",
});

/* =========================
   ATTACH JWT TOKEN (FIXED)
========================= */
api.interceptors.request.use(
  (config) => {
    const token = useTokenStore.getState().token;

    if (token) {
      // ✅ FIX: AxiosHeaders compatible
      config.headers = new AxiosHeaders({
        ...(config.headers as any),
        Authorization: `Bearer ${token}`,
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

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
    headers: new AxiosHeaders({
      "Content-Type": "multipart/form-data",
    }),
  });
};

/* =========================
   ⭐ GET CATEGORIES (DERIVED)
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
   REVIEWS
========================= */
export const addReview = (
  bookId: string,
  data: { rating: number; comment?: string }
) => {
  return api.post(`/api/books/${bookId}/reviews`, data);
};

/* =========================
   WISHLIST
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
