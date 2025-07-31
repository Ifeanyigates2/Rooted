import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase } from "lucide-react";
import { authService } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.userType) {
      alert("Please fill in all fields including user type.");
      return;
    }

    try {
      const result = await authService.loginUser(formData.email, formData.password);
      
      if (result.success && result.user) {
        // Check if user type matches what they selected
        if (result.user.userType !== formData.userType) {
          alert(`This account is registered as a ${result.user.userType}, not a ${formData.userType}`);
          return;
        }

        login(result.user);
        alert("Login successful!");
        
        // Redirect based on user type
        if (result.user.userType === "provider") {
          setLocation("/provider-dashboard");
        } else {
          setLocation("/");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Sign in to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-center mb-6">
                  I am a...
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    onClick={() => handleInputChange("userType", "customer")}
                    variant={formData.userType === "customer" ? "default" : "outline"}
                    className="p-6 h-auto flex flex-col items-center space-y-2"
                  >
                    <User className="h-6 w-6" />
                    <span>Customer</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleInputChange("userType", "provider")}
                    variant={formData.userType === "provider" ? "default" : "outline"}
                    className="p-6 h-auto flex flex-col items-center space-y-2"
                  >
                    <Briefcase className="h-6 w-6" />
                    <span>Provider</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-lg"
              >
                Sign in ✨
              </Button>

              <p className="text-center text-gray-600 mt-6">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setLocation("/signup")}
                  className="text-gray-900 hover:underline font-semibold"
                >
                  Sign up
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}