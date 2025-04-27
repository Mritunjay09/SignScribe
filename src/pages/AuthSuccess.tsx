
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setToken, setRefreshToken, fetchUserProfile } from "@/utils/authUtils";
import { toast } from "sonner";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processAuth = async () => {
      // Get token from URL query parameters
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const refreshToken = params.get('refreshToken');
      
      if (!token) {
        toast.error("Authentication failed. No token received.");
        navigate('/login');
        return;
      }
      
      // Store the tokens
      setToken(token);
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }
      
      // Fetch user profile
      try {
        const user = await fetchUserProfile();
        if (user) {
          toast.success("Successfully logged in!");
          navigate('/');
        } else {
          toast.error("Failed to fetch user profile.");
          navigate('/login');
        }
      } catch (error) {
        console.error("Error processing authentication:", error);
        toast.error("Authentication error occurred.");
        navigate('/login');
      }
    };
    
    processAuth();
  }, [navigate, location.search]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-purple mb-4">Authenticating...</h1>
        <p className="text-slate">Please wait while we complete your login.</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
