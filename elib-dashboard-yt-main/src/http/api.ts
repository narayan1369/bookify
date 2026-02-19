import axios, { AxiosHeaders } from "axios";
import useTokenStore from "@/store";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_PUBLIC_BACKEND_URL || "http://localhost:7002",
});

/* TOKEN */
api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;

  if (token) {
    config.headers = new AxiosHeaders({
      ...(config.headers as any),
      Authorization: `Bearer ${token}`,
    });
  }
  return config;
});

/* AUTH */
export const register = (data: any) =>
  api.post("/api/auth/register", data);

export const login = (data: any) =>
  api.post("/api/auth/login", data);

/* BOOKS */
export const getBooks = () => api.get("/api/books");

export const createBook = (data: any) =>
  api.post("/api/books", data);

/* WISHLIST */
export const addToWishlist = (bookId: string) =>
  api.post(`/api/auth/wishlist/${bookId}`);

export const removeFromWishlist = (bookId: string) =>
  api.delete(`/api/auth/wishlist/${bookId}`);

export const getWishlist = () =>
  api.get("/api/auth/wishlist");

/* REQUEST BOOK */
export const requestBook = (data: any) =>
  api.post("/api/request-book", data);

export default api;
