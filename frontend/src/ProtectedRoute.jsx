import { Navigate } from "react-router-dom";

// reads the "exp" time inside the JWT and checks it is still in the future
function isTokenValid(token) {
  if (!token) return false;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return isTokenValid(token) ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;