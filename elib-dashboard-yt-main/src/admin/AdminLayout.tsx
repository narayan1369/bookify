import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useTokenStore from "@/store";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ShieldAlert,
  LogOut,
  MailQuestion,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const token = useTokenStore((state) => state.token);
  const user = useTokenStore((state) => state.user);
  const setAuth = useTokenStore((state) => state.setAuth);

  // 🔒 Not logged in
  if (!token || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // 🔒 Not admin
  if (user.role !== "admin") {
    return <Navigate to="/dashboard/home" replace />;
  }

  // ✅ LOGOUT HANDLER
  const handleLogout = () => {
    setAuth(null, null); // clear token + user
    navigate("/auth/login", { replace: true });
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
      isActive
        ? "bg-muted text-primary"
        : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      {/* SIDEBAR */}
      <aside className="border-r bg-muted/40 p-4 flex flex-col">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              Admin Panel
            </CardTitle>
          </CardHeader>
        </Card>

        {/* NAVIGATION */}
        <nav className="mt-6 space-y-1 flex-1">
          <NavLink to="/admin/dashboard" className={navClass}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className={navClass}>
            <Users className="h-4 w-4" />
            Users
          </NavLink>

          <NavLink to="/admin/books" className={navClass}>
            <BookOpen className="h-4 w-4" />
            Books
          </NavLink>

          {/* 📩 BOOK REQUESTS */}
          <NavLink to="/admin/book-requests" className={navClass}>
            <MailQuestion className="h-4 w-4" />
            Book Requests
          </NavLink>
        </nav>

        {/* LOGOUT */}
        <Button
          variant="destructive"
          className="mt-4 flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </aside>

      {/* MAIN */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
