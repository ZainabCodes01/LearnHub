
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function OAuthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userParam = params.get("user");

    if (!token || !userParam) {
      navigate("/login?error=google", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userParam);
      login(user, token);
      navigate("/courses", { replace: true });
    } catch (error) {
      console.error("Google login failed:", error);
      navigate("/login?error=google", { replace: true });
    }
  }, [location.search, login, navigate]);

  return (
    <div className="container mt-5 text-center">
      <h3>Signing you in...</h3>
      <p>Please wait while LearnHub completes your login.</p>
    </div>
  );
}

export default OAuthSuccess;
