
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "@/utils/authUtils";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    try {
      if (token) {
        const success = await resetPassword(token, password);
        if (success) {
          // Redirect to login page after successful password reset
          navigate('/login');
        }
      } else {
        setError("Invalid reset token.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-14">
        <form onSubmit={handleSubmit}>
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center space-y-3 pb-8">
              <CardTitle className="text-3xl font-bold text-purple">
                Create New Password
              </CardTitle>
              <CardDescription className="text-slate text-lg">
                Please enter your new password below
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-dark mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pl-10 pr-10 w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-dark mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="pl-10 pr-10 w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full bg-purple hover:bg-purple-dark" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
              
              <div className="text-center">
                <p className="text-slate text-sm">
                  Remember your password?{" "}
                  <Link to="/login" className="text-purple hover:underline font-semibold">
                    Back to login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
