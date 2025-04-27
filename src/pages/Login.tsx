import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LogIn, Mail, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const HandleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); //Stops the page from refreshing    
    
    try {
      //Send a Get request to the server to check if the user exists
      //and if the password is correct
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      console.log("Response from server:", data);
      if (response.ok) {
        // Handle successful login (e.g., redirect to dashboard)
        console.log("Login successful:", data);
        setEmail("")
        setPassword("")
        
      } else {
        // Handle login error (e.g., show error message)
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-14">
        <form onSubmit={HandleLogin}>
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
                    value = {email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
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
                    type= {showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm text-slate">
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
            
            <Button className="w-full bg-purple hover:bg-purple-dark">
              <LogIn className="mr-2" size={20} />
              Sign In
            </Button>
            
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