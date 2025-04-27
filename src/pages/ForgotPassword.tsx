
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { requestPasswordReset } from "@/utils/authUtils";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await requestPasswordReset(email);
      if (success) {
        setIsSubmitted(true);
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
                Reset Password
              </CardTitle>
              <CardDescription className="text-slate text-lg">
                {isSubmitted 
                  ? "If an account with that email exists, we've sent reset instructions."
                  : "Enter your email to reset your password"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {!isSubmitted ? (
                <>
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
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-purple hover:bg-purple-dark" 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-green-600 mb-4">
                    Check your email for instructions to reset your password.
                  </p>
                  <Button 
                    className="bg-purple hover:bg-purple-dark"
                    onClick={() => {
                      setEmail("");
                      setIsSubmitted(false);
                    }}
                  >
                    Try another email
                  </Button>
                </div>
              )}
              
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

export default ForgotPassword;
