import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-3 pb-8">
            <CardTitle className="text-3xl font-bold text-purple">
              Reset Password
            </CardTitle>
            <CardDescription className="text-slate text-lg">
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
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
                />
              </div>
            </div>
            
            <Button className="w-full bg-purple hover:bg-purple-dark">
              Send Reset Link
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
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;