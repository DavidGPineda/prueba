import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (userRole !== requiredRole.toString()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
