import { Navigate } from "react-router-dom";
import { useAuth } from "../store/contexts/AuthContext";
import { ROUTES } from "./constants";
import Loading from "../components/common/Loading";

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles.length > 0) {
    if (!user || !user.role) {
      // Corrupted state: Authenticated but no valid user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = ROUTES.LOGIN;
      return null;
    }

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
  }

  return children;
}
