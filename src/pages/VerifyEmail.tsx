@@ .. @@
-import { useMutation } from "@tanstack/react-query";
-import { apiRequest } from "@/lib/queryClient";
-import { useToast } from "@/hooks/use-toast";
 
 export default function VerifyEmail() {
   const [, setLocation] = useLocation();
   const [otpValue, setOtpValue] = useState("");
   const [email, setEmail] = useState("");
-  const { toast } = useToast();
 
   // Get email from localStorage on component mount
   useEffect(() => {
@@ .. @@
     }
   }, [setLocation]);
 
-  const verifyMutation = useMutation({
-    mutationFn: async (otp: string) => {
-      const response = await apiRequest("POST", "/api/verify-email", { email, otp });
-      return response.json();
-    },
-    onSuccess: () => {
-      toast({
-        title: "Email verified successfully!",
-        description: "Please complete your profile to continue.",
-      });
-      // Clean up the stored email
-      localStorage.removeItem("verificationEmail");
-      setLocation("/complete-profile");
-    },
-    onError: () => {
-      toast({
-        title: "Verification failed",
-        description: "Invalid OTP code. Please try again.",
-        variant: "destructive",
-      });
-    },
-  });
-
   const handleVerify = () => {
     if (otpValue.length === 4) {
-      verifyMutation.mutate(otpValue);
+      // Demo: Just redirect to complete profile
+      localStorage.removeItem("verificationEmail");
+      setLocation("/complete-profile");
     }
   };
 
-  const handleResendCode = async () => {
-    if (!email) return;
-    
-    try {
-      await apiRequest("POST", "/api/resend-otp", { email });
-      toast({
-        title: "Code resent",
-        description: "A new verification code has been sent to your email.",
-      });
-    } catch (error) {
-      toast({
-        title: "Failed to resend code",
-        description: "Please try again later.",
-        variant: "destructive",
-      });
-    }
+  const handleResendCode = () => {
+    // Demo: Just show alert
+    alert("Code resent to your email!");
   };
 
   return (
@@ .. @@
           <Button
             onClick={handleVerify}
-            disabled={otpValue.length !== 4 || verifyMutation.isPending}
+            disabled={otpValue.length !== 4}
             className="w-full bg-[var(--rooted-primary)] text-white py-4 rounded-xl font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors text-lg"
           >
-            {verifyMutation.isPending ? "Verifying..." : "Verify ✨"}
+            Verify ✨
           </Button>
         </div>