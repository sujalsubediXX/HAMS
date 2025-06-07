import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, role }) => {
  const { user } = useAuth();
  if (!user || user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoutes;
