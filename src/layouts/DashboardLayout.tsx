import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useTokenStore from "@/store";
import {
  CircleUser,
  X,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";
import {
  Link,
  Navigate,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import RequestBookPage from "@/pages/RequestBookPage";

const DashboardLayout = () => {
  const token = useTokenStore((state) => state.token);
  const logout = useTokenStore((state) => state.logout);
  const navigate = useNavigate();

  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  // ✅ PROFILE MENU STATE (FIX)
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  /* ================= WISHLIST COUNT ================= */
  useEffect(() => {
    const updateCount = () => {
      const savedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      setWishlistCount(savedWishlist.length);
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, []);

  /* ================= AUTH GUARD ================= */
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition cursor-pointer ${
      isActive
        ? "text-slate-900 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-slate-900"
        : "text-slate-500 hover:text-slate-900"
    }`;

  const handleRecommendationClick = () => {
    const trendingSection = document.getElementById("trending-section");
    if (trendingSection) {
      trendingSection.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/dashboard/home");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-[9999] border-b bg-white pointer-events-auto">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* LOGO */}
          <Link to="/dashboard/home" className="text-xl font-bold">
            Bookify
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/dashboard/home" className={navClass}>
              Home
            </NavLink>

            <NavLink to="/dashboard/books" className={navClass}>
              Books
            </NavLink>

            <span
              onClick={handleRecommendationClick}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              Recommendation
            </span>

            <span
              onClick={() => setOpenContactModal(true)}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              Contact
            </span>

            {/* WISHLIST */}
            <div
              onClick={() => navigate("/dashboard/wishlist")}
              className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-full"
            >
              <Heart className="h-5 w-5 text-slate-700" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] h-4 w-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpenRequestModal(true)}
            >
              Request a Book
            </Button>
          </nav>

          {/* ================= PROFILE ICON (100% FIXED) ================= */}
          <div className="relative z-[10000]">
            <button
              type="button"
              onClick={() => setOpenProfileMenu((prev) => !prev)}
              className="p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <CircleUser className="h-6 w-6 text-slate-700" />
            </button>

            {openProfileMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border bg-white shadow-xl z-[10001]">
                <button
                  onClick={() => {
                    setOpenProfileMenu(false);
                    navigate("/dashboard/home");
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    setOpenProfileMenu(false);
                    navigate("/dashboard/wishlist");
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                >
                  Wishlist
                </button>

                <button
                  onClick={() => {
                    setOpenProfileMenu(false);
                    logout();
                    navigate("/auth/login", { replace: true });
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}
      <main className="flex-1 w-full relative z-0">
        <Outlet />
      </main>

      {/* ================= REQUEST BOOK MODAL ================= */}
      <RequestBookPage
        open={openRequestModal}
        onClose={() => setOpenRequestModal(false)}
      />

      {/* ================= CONTACT MODAL ================= */}
      {openContactModal && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setOpenContactModal(false)}
              className="absolute top-3 right-3"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">Contact Us</h2>

            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              narayantiwari1369@gmail.com
            </p>

            <p className="flex items-center gap-2 mt-2">
              <Phone className="h-4 w-4" />
              7479785171
            </p>

            <p className="flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4" />
              Galgotias University, Greater Noida
            </p>
          </div>
        </div>
      )}

      {/* ❌ FOOTER REMOVED FROM HERE */}
    </div>
  );
};

export default DashboardLayout;