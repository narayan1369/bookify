import { Navigate } from "react-router-dom";
import useTokenStore from "@/store";

const RootRedirect = () => {
  const { token, user } = useTokenStore();

  if (!token || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/dashboard/home" replace />;
};

export default RootRedirect;
