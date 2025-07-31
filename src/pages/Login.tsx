import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
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
    // Demo: Just redirect based on user type
    if (formData.userType === "provider") {
      setLocation("/provider/dashboard");
    } else {
      setLocation("/");
    }
  };

  return (
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-[var(--rooted-primary)] text-white py-4 rounded-xl font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors text-lg"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in ✨"}
            Sign in ✨
          </Button>
        </form>
  );
}