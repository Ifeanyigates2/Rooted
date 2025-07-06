import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import signupImage from "@assets/login sign up_1751136337552.jpg";

export default function Account() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [userType, setUserType] = useState<"customer" | "provider" | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    countryCode: "+234",
    userType: ""
  });

  const signupMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/signup", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account created successfully!",
        description: "Please check your email for verification code.",
      });
      // Store email in localStorage for verification page
      localStorage.setItem("verificationEmail", formData.email);
      setLocation("/verify-email");
    },
    onError: () => {
      toast({
        title: "Signup failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    signupMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/">
          <h1 className="text-2xl font-bold text-[var(--rooted-primary)] cursor-pointer">rooted.</h1>
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left side - Form */}
          <div className="max-w-md">
            {!userType ? (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[var(--rooted-primary)] mb-2">Welcome to rooted</h2>
                <p className="text-[var(--rooted-secondary)] mb-8">Choose how you'd like to join our community</p>
                
                {/* User Type Selection */}
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      setUserType("customer");
                      setFormData(prev => ({ ...prev, userType: "customer" }));
                    }}
                    className="w-full bg-[var(--rooted-primary)] hover:bg-[var(--rooted-primary)]/90 text-white py-6 rounded-xl text-lg font-semibold transition-colors"
                  >
                    Sign up as Customer
                    <span className="block text-sm font-normal opacity-80">Find and book beauty services</span>
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setUserType("provider");
                      setFormData(prev => ({ ...prev, userType: "provider" }));
                    }}
                    className="w-full bg-[var(--rooted-accent)] hover:bg-[var(--rooted-accent)]/90 text-white py-6 rounded-xl text-lg font-semibold transition-colors"
                  >
                    Sign up as Service Provider
                    <span className="block text-sm font-normal opacity-80">Offer your beauty services to clients</span>
                  </Button>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-[var(--rooted-secondary)]">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[var(--rooted-primary)] font-medium hover:underline">
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <Button
                  onClick={() => setUserType(null)}
                  variant="ghost"
                  className="mb-4 text-[var(--rooted-secondary)] hover:text-[var(--rooted-primary)]"
                >
                  ← Back to selection
                </Button>
                <h2 className="text-3xl font-bold text-[var(--rooted-primary)] mb-2">
                  {userType === "customer" ? "Customer" : "Service Provider"} Signup
                </h2>
                <p className="text-[var(--rooted-secondary)]">
                  {userType === "customer" 
                    ? "Create your account to start booking services" 
                    : "Join our network of professional beauty service providers"}
                </p>
              </div>
            )}

            {userType && (
              <form onSubmit={handleSignUp} className="space-y-4">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="bg-gray-100 border-0 rounded-xl py-3 px-4 text-[var(--rooted-primary)] placeholder:text-gray-500"
                  required
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="bg-gray-100 border-0 rounded-xl py-3 px-4 text-[var(--rooted-primary)] placeholder:text-gray-500"
                  required
                />
              </div>

              {/* Email */}
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-100 border-0 rounded-xl py-3 px-4 text-[var(--rooted-primary)] placeholder:text-gray-500"
                required
              />

              {/* Phone */}
              <div className="flex gap-2">
                <Select value={formData.countryCode} onValueChange={(value) => handleInputChange("countryCode", value)}>
                  <SelectTrigger className="w-24 bg-gray-100 border-0 rounded-xl py-3 px-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+234">🇳🇬 +234</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+33">🇫🇷 +33</SelectItem>
                    <SelectItem value="+49">🇩🇪 +49</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  placeholder="Enter here"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="flex-1 bg-gray-100 border-0 rounded-xl py-3 px-4 text-[var(--rooted-primary)] placeholder:text-gray-500"
                  required
                />
              </div>

              {/* Password fields */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-gray-100 border-0 rounded-xl py-3 px-4 text-[var(--rooted-primary)] placeholder:text-gray-500"
                  required
                />
                <Input
                  type="password"
                  placeholder="Re-Enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="bg-gray-100 border-0 rounded-xl py-3 px-4 text-[var(--rooted-primary)] placeholder:text-gray-500"
                  required
                />
              </div>

              {/* Password requirements */}
              <div className="text-sm text-[var(--rooted-secondary)] space-y-1">
                <p className="font-medium">Password must contain at least</p>
                <div className="space-y-1 ml-4">
                  <div className="flex items-center">
                    <Checkbox className="mr-2" />
                    <span>8 characters</span>
                  </div>
                  <div className="flex items-center">
                    <Checkbox className="mr-2" />
                    <span>1 upper case letter</span>
                  </div>
                  <div className="flex items-center">
                    <Checkbox className="mr-2" />
                    <span>1 special character</span>
                  </div>
                </div>
              </div>

              {/* Sign up button */}
              <Button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full bg-[var(--rooted-primary)] text-white py-4 rounded-xl font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors text-lg mt-8"
              >
                {signupMutation.isPending ? "Creating account..." : "Sign up ✨"}
              </Button>

              {/* Sign in link */}
              <div className="text-center mt-6">
                <span className="text-[var(--rooted-secondary)]">Already have an account? </span>
                <Link href="/signin" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </div>

              {/* Terms */}
              <div className="text-center text-sm text-[var(--rooted-secondary)] mt-6">
                By Signing up, you have agreed to our{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms & Conditions</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </div>
            </form>
            )}
          </div>

          {/* Right side - Image */}
          <div className="hidden lg:block">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={signupImage}
                alt="Two professional women in elegant black and white portrait"
                className="w-full h-[600px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}