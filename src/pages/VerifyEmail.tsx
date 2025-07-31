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
      // Redirect to signup if no email found
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
      // Demo: Just redirect to complete profile
      localStorage.removeItem("verificationEmail");
      setLocation("/complete-profile");
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
    // Demo: Just show alert
    alert("Code resent to your email!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--rooted-primary)]/5 to-[var(--rooted-secondary)]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a 4-digit code to <span className="font-semibold">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter verification code
              </label>
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rooted-primary)] focus:border-transparent text-center text-2xl font-mono tracking-widest"
                maxLength={4}
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={otpValue.length !== 4 || verifyMutation.isPending}
              className="w-full bg-[var(--rooted-primary)] text-white py-4 rounded-xl font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors text-lg"
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify ✨"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendCode}
                className="text-[var(--rooted-primary)] hover:underline font-medium"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}