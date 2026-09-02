import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
function ProtectRoute({ children }) {
  const [authState, setAuthState] = useState("loading");
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dash/me", {
          method: "GET",
          credentials: "include",
        });
        setAuthState(res.ok ? "auth" : "guest");
      } catch {
        setAuthState("guest");
      }
    };
    checkAuth();
  }, []);
  if (authState == "loading") return null;
  if (authState == "guest") return <Navigate to="/" replace />;
  return children;
}
export default ProtectRoute;
