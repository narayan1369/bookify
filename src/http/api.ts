import axios from "axios";
import useTokenStore from "@/store";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL:
    import.meta.env.VITE_PUBLIC_BACKEND_URL ||
    "https://bookify-zckw.onrender.com",
});

/* =========================
   TOKEN ATTACH
========================= */
api.interceptors.request.use((config) => {
  let token = useTokenStore.getState().token;

  if (!token) {
    const stored = localStorage.getItem("auth-store");
    if (stored) {
      try {
        token = JSON.parse(stored)?.state?.token;
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
}) => api.post("/api/auth/login", data);

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/api/auth/register", data);

/* =========================
   BOOK APIs
========================= */
export const getBooks = () => api.get("/api/books");

export const getSingleBook = (bookId: string) =>
  api.get(`/api/books/${bookId}`);

export const createBook = (data: FormData) =>
  api.post("/api/books", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================
   WISHLIST
========================= */
export const addToWishlist = (bookId: string) =>
  api.post(`/api/auth/wishlist/${bookId}`);

export const removeFromWishlist = (bookId: string) =>
  api.delete(`/api/auth/wishlist/${bookId}`);

export const getWishlist = () =>
  api.get("/api/auth/wishlist");

/* =========================
   REQUEST BOOK
========================= */
export const requestBook = (data: any) =>
  api.post("/api/request-book", data);

export default api;
