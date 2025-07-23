import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, Briefcase } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: ""
  });

  const loginMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      // Store session ID for authenticated requests
      if (data.sessionId) {
        localStorage.setItem("sessionId", data.sessionId);
      }
      
      // Redirect based on user type
      if (data.user.userType === "provider") {
        setLocation("/provider/dashboard");
      } else {
        // Check if customer needs to complete profile
        if (data.user.profileCompleted) {
          setLocation("/");
        } else {
          setLocation("/complete-profile");
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.userType) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields including user type.",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-2xl font-bold text-[var(--rooted-primary)] mb-4 cursor-pointer">rooted.</h1>
          </Link>
          <h2 className="text-xl font-semibold text-[var(--rooted-primary)] mb-2">Welcome back</h2>
          <p className="text-[var(--rooted-secondary)]">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--rooted-primary)] mb-2">
              I am signing in as a
            </label>
            <Select
              value={formData.userType}
              onValueChange={(value) => handleInputChange("userType", value)}
            >
              <SelectTrigger className="bg-gray-100 border-0 rounded-xl py-4 text-base">
                <SelectValue placeholder="Select your account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Customer - Looking for services
                  </div>
                </SelectItem>
                <SelectItem value="provider">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Service Provider - Offering services
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--rooted-primary)] mb-2">
              Email address
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-gray-100 border-0 rounded-xl py-4 text-base"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--rooted-primary)] mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="bg-gray-100 border-0 rounded-xl py-4 text-base"
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-[var(--rooted-primary)] text-white py-4 rounded-xl font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors text-lg"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in ✨"}
          </Button>
        </form>

        {/* Sign up link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-[var(--rooted-secondary)]">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}