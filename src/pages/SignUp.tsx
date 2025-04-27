import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, User, UserPlus, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const  SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); //Stops the page from refreshing
      console.log("Form submitted:", { name, email, password, confirmPassword });
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
  
      try {
        // Make a POST request to the backend API for signup
        // Replace with your actual API endpoint
        const res = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        
        const data = await res.json();
  
        if (!res.ok) {
          setError(data.message || "Signup failed.");
          setSuccess(null);
        } else {
          setSuccess("Account created successfully!");
          setError(null);
          // Clear fields if desired
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }
      } catch (err) {
        setError("Something went wrong.");
        setSuccess(null);
      }
    };
  
    return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">

        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-3 pb-8">
            <CardTitle className="text-3xl font-bold text-purple">
              Create Account
            </CardTitle>
            <CardDescription className="text-slate text-lg">
              Join SignScribe today
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-dark mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
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
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-dark mb-2">
                  Password
                </label>
                <div className="relative mb-2">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                <button
                    type="button"
                    onClick = {()=> setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <Input
                    id="password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm"
                    className="pl-10 w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick = {()=> setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <Button className="w-full bg-purple hover:bg-purple-dark" type="submit">
              <UserPlus className="mr-2" size={20} />
              Sign Up
            </Button>
            
            <div className="text-center">
              <p className="text-slate text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-purple hover:underline font-semibold">
                  Sign in
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

export default SignUp;
