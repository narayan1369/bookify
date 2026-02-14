import { createBrowserRouter, Navigate } from "react-router-dom";

/* AUTH */
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

/* USER */
import HomePage from "@/pages/HomePage";
import BooksPage from "@/pages/BooksPage";
import WishlistPage from "@/pages/WishlistPage";
import RequestBookPage from "@/pages/RequestBookPage";

/* ADMIN */
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminBooks from "@/pages/admin/AdminBooks";
import AdminBookRequests from "@/pages/admin/AdminBookRequests"; // ✅ NEW
import CreateBook from "@/pages/CreateBook";

/* LAYOUTS */
import DashboardLayout from "@/layouts/DashboardLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/admin/AdminLayout";

/* ROOT */
import RootRedirect from "@/routes/RootRedirect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },

  /* ================= AUTH ================= */
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },

  /* ================= USER DASHBOARD ================= */
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "home", element: <HomePage /> },
      { path: "books", element: <BooksPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "request-book", element: <RequestBookPage /> },
    ],
  },

  /* ================= ADMIN DASHBOARD ================= */
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },

      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> },
      { path: "books", element: <AdminBooks /> },
      { path: "books/create", element: <CreateBook /> },

      // ✅ FIX: BOOK REQUESTS ROUTE
      {
        path: "book-requests",
        element: <AdminBookRequests />,
      },
    ],
  },

  /* ================= FALLBACK ================= */
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
