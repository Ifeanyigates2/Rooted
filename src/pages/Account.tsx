import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase, Sparkles, ArrowLeft } from "lucide-react";
import { authService } from "@/lib/auth";

export default function Account() {
  const [, setLocation] = useLocation();
  const [userType, setUserType] = useState<"customer" | "provider" | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      await authService.registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        userType: formData.userType as 'customer' | 'provider',
        isEmailVerified: false
      });

      // Store user type and email for verification flow
      localStorage.setItem("userType", formData.userType);
      localStorage.setItem("verificationEmail", formData.email);
      setLocation("/verify-email");
    } catch (error) {
      console.error('Registration error:', error);
      alert(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Image */}
        <div className="hidden lg:block">
          <div className="w-full h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl shadow-2xl flex items-center justify-center">
            <Sparkles className="h-24 w-24 text-white" />
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/")}
                  className="absolute left-4 top-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Sparkles className="h-8 w-8 text-[var(--rooted-primary)]" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Join Rooted
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Create your account to get started
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!userType ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center mb-6">
                    I want to...
                  </h3>
                  
                  <Button
                    onClick={() => {
                      setUserType("customer");
                      handleInputChange("userType", "customer");
                    }}
                    variant="outline"
                    className="w-full p-6 h-auto flex flex-col items-center space-y-2 hover:bg-gray-50 hover:border-gray-900 transition-colors"
                  >
                    <User className="h-8 w-8 text-gray-900" />
                    <div className="text-center">
                      <div className="font-semibold">Find Services</div>
                      <div className="text-sm text-gray-500">
                        Connect with local service providers
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => {
                      setUserType("provider");
                      handleInputChange("userType", "provider");
                    }}
                    variant="outline"
                    className="w-full p-6 h-auto flex flex-col items-center space-y-2 hover:bg-gray-50 hover:border-gray-900 transition-colors"
                  >
                    <Briefcase className="h-8 w-8 text-gray-900" />
                    <div className="text-center">
                      <div className="font-semibold">Offer Services</div>
                      <div className="text-sm text-gray-500">
                        Grow your business in your community
                      </div>
                    </div>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setUserType(null)}
                    className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to account type
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        className="h-12"
                      />
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-lg mt-8"
                  >
                    Sign up ✨
                  </Button>

                  {/* Sign in link */}
                  <p className="text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setLocation("/login")}
                      className="text-gray-900 hover:underline font-semibold"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}