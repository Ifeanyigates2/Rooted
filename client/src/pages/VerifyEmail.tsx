import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [otpValue, setOtpValue] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  // Get email from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email found, redirect back to signup
      setLocation("/signup");
    }
  }, [setLocation]);

  const verifyMutation = useMutation({
    mutationFn: async (otp: string) => {
      const response = await apiRequest("POST", "/api/verify-email", { email, otp });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email verified successfully!",
        description: "Please complete your profile to continue.",
      });
      // Clean up the stored email
      localStorage.removeItem("verificationEmail");
      setLocation("/complete-profile");
    },
    onError: () => {
      toast({
        title: "Verification failed",
        description: "Invalid OTP code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVerify = () => {
    if (otpValue.length === 4) {
      verifyMutation.mutate(otpValue);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    try {
      await apiRequest("POST", "/api/resend-otp", { email });
      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Failed to resend code",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--rooted-primary)] mb-4">
            Verify your email address
          </h1>
          <p className="text-[var(--rooted-secondary)] mb-2">
            We sent an OTP to your registered email address{" "}
            <span className="text-blue-600 font-medium">{email || "..."}</span>
          </p>
          <p className="text-[var(--rooted-secondary)]">
            Please check and enter the code.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <InputOTP
              maxLength={4}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
              className="gap-3"
            >
              <InputOTPGroup className="gap-3">
                <InputOTPSlot 
                  index={0} 
                  className="w-16 h-16 text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:border-[var(--rooted-accent)] bg-white"
                />
                <InputOTPSlot 
                  index={1} 
                  className="w-16 h-16 text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:border-[var(--rooted-accent)] bg-white"
                />
                <InputOTPSlot 
                  index={2} 
                  className="w-16 h-16 text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:border-[var(--rooted-accent)] bg-white"
                />
                <InputOTPSlot 
                  index={3} 
                  className="w-16 h-16 text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:border-[var(--rooted-accent)] bg-white"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerify}
            disabled={otpValue.length !== 4 || verifyMutation.isPending}
            className="w-full bg-[var(--rooted-primary)] text-white py-4 rounded-xl font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors text-lg"
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify ✨"}
          </Button>
        </div>

        <div className="text-center space-y-4">
          <div className="text-sm text-[var(--rooted-secondary)]">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendCode}
              className="text-blue-600 hover:underline font-medium"
            >
              Resend OTP
            </button>
          </div>
          
          <div className="text-sm text-[var(--rooted-secondary)]">
            Wrong email address?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline font-medium">
              Go back to signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}