import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, Briefcase, Sparkles, ArrowLeft } from "lucide-react";
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
    country: "",
    area: "",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/">
          <h1 className="text-2xl font-bold text-[var(--rooted-primary)] cursor-pointer">rooted.</h1>
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left side - Form */}
          <div className="max-w-lg mx-auto lg:mx-0">
            {!userType ? (
              <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-[var(--rooted-primary)] to-[var(--rooted-accent)] p-3 rounded-full">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold text-[var(--rooted-primary)] mb-3">Welcome to rooted.</h2>
                  <p className="text-lg text-[var(--rooted-secondary)] max-w-md mx-auto leading-relaxed">
                    Join our community of beauty enthusiasts and professionals
                  </p>
                </div>
                
                {/* User Type Selection Cards */}
                <div className="space-y-4">
                  <div 
                    onClick={() => {
                      setUserType("customer");
                      setFormData(prev => ({ ...prev, userType: "customer" }));
                    }}
                    className="group p-6 border-2 border-gray-100 rounded-2xl hover:border-[var(--rooted-primary)] hover:shadow-xl hover:shadow-[var(--rooted-primary)]/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-[var(--rooted-primary)]/10 group-hover:bg-[var(--rooted-primary)] p-3 rounded-xl transition-colors duration-300">
                        <User className="h-6 w-6 text-[var(--rooted-primary)] group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[var(--rooted-primary)] mb-2 group-hover:text-[var(--rooted-primary)]">
                          I'm looking for services
                        </h3>
                        <p className="text-[var(--rooted-secondary)] text-sm leading-relaxed">
                          Discover and book appointments with talented beauty professionals in your area
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-[var(--rooted-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium">
                          Select
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => {
                      setUserType("provider");
                      setFormData(prev => ({ ...prev, userType: "provider" }));
                    }}
                    className="group p-6 border-2 border-gray-100 rounded-2xl hover:border-[var(--rooted-accent)] hover:shadow-xl hover:shadow-[var(--rooted-accent)]/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-[var(--rooted-accent)]/10 group-hover:bg-[var(--rooted-accent)] p-3 rounded-xl transition-colors duration-300">
                        <Briefcase className="h-6 w-6 text-[var(--rooted-accent)] group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[var(--rooted-primary)] mb-2">
                          I offer beauty services
                        </h3>
                        <p className="text-[var(--rooted-secondary)] text-sm leading-relaxed">
                          Join our network of professionals and grow your beauty business
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-[var(--rooted-accent)] text-white px-4 py-2 rounded-lg text-sm font-medium">
                          Select
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sign in link */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-[var(--rooted-secondary)]">
                    Already part of the rooted community?{" "}
                    <Link href="/login" className="text-[var(--rooted-primary)] font-semibold hover:underline transition-colors">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <Button
                  onClick={() => setUserType(null)}
                  variant="ghost"
                  className="flex items-center space-x-2 text-[var(--rooted-secondary)] hover:text-[var(--rooted-primary)] transition-colors p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to selection</span>
                </Button>
                
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      userType === "customer" 
                        ? "bg-[var(--rooted-primary)]/10" 
                        : "bg-[var(--rooted-accent)]/10"
                    }`}>
                      {userType === "customer" ? (
                        <User className="h-6 w-6 text-[var(--rooted-primary)]" />
                      ) : (
                        <Briefcase className="h-6 w-6 text-[var(--rooted-accent)]" />
                      )}
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-[var(--rooted-primary)] mb-3">
                    {userType === "customer" ? "Join as Customer" : "Join as Service Provider"}
                  </h2>
                  <p className="text-[var(--rooted-secondary)] leading-relaxed">
                    {userType === "customer" 
                      ? "Create your account to discover and book amazing beauty services" 
                      : "Create your professional profile and start connecting with clients"}
                  </p>
                </div>
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

              {/* Country and Area fields */}
              <div className="grid grid-cols-2 gap-4">
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger className="bg-gray-100 border-0 rounded-xl py-3 px-4">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nigeria">🇳🇬 Nigeria</SelectItem>
                    <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="usa">🇺🇸 United States</SelectItem>
                    <SelectItem value="canada">🇨🇦 Canada</SelectItem>
                    <SelectItem value="france">🇫🇷 France</SelectItem>
                    <SelectItem value="germany">🇩🇪 Germany</SelectItem>
                    <SelectItem value="australia">🇦🇺 Australia</SelectItem>
                    <SelectItem value="south_africa">🇿🇦 South Africa</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Enter your area"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  className="bg-gray-100 border-0 rounded-xl py-3 px-4 text-[var(--rooted-primary)] placeholder:text-gray-500"
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