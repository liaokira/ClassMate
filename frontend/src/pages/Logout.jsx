import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setIsAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication-related data
    localStorage.removeItem("accessToken"); // Remove the token or any session data
    setIsAuthenticated(false); // Update authentication state

    // Redirect to login
    setTimeout(() => {
        navigate("/"); // Ensures state has updated before navigating
      }, 1);
  }, [setIsAuthenticated, navigate]);

  return null; // This component doesn't render anything
}

export default Logout;
