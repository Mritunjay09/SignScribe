
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LogIn, Mail, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { login } from "@/utils/authUtils";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result) {
        // If "remember me" is not checked, set a shorter expiry on the token
        if (!rememberMe) {
          // This would be handled on the backend in a real app
          // Here we just note it in the UI
          toast.info("Session will expire after 24 hours");
        }
        navigate('/'); // Redirect to home page after successful login
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:3000/auth/facebook';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-8">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-6">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center space-y-3 pb-8">
              <CardTitle className="text-3xl font-bold text-purple">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-slate text-lg">
                Sign in to continue to SignScribe
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-dark mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 w-full"
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-dark mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <label htmlFor="remember" className="text-sm text-slate cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-purple hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <Button 
                className="w-full bg-purple hover:bg-purple-dark" 
                disabled={isLoading}
                type="submit"
              >
                <LogIn className="mr-2" size={20} />
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-sm text-gray-500">Or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  className="w-1/2 bg-red-500 hover:bg-red-600" 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  Google
                </Button>
                <Button 
                  className="w-1/2 bg-blue-600 hover:bg-blue-700" 
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={isLoading}
                >
                  Facebook
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-slate text-sm">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-purple hover:underline font-semibold">
                    Sign up
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

export default Login;
