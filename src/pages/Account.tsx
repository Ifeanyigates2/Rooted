@@ .. @@
-import { useMutation } from "@tanstack/react-query";
-import { apiRequest } from "@/lib/queryClient";
-import { useToast } from "@/hooks/use-toast";
 import { User, Briefcase, Sparkles, ArrowLeft } from "lucide-react";
 import signupImage from "@assets/login sign up_1751136337552.jpg";
 
 export default function Account() {
   const [, setLocation] = useLocation();
-  const { toast } = useToast();
   const [userType, setUserType] = useState<"customer" | "provider" | null>(null);
   const [formData, setFormData] = useState({
@@ .. @@
     userType: ""
   });
 
-  const signupMutation = useMutation({
-    mutationFn: async (data: typeof formData) => {
-      const response = await apiRequest("POST", "/api/signup", data);
-      return response.json();
-    },
-    onSuccess: () => {
-      toast({
-        title: "Account created successfully!",
-        description: "Please check your email for verification code.",
-      });
-      // Store email in localStorage for verification page
-      localStorage.setItem("verificationEmail", formData.email);
-      setLocation("/verify-email");
-    },
-    onError: (error: any) => {
-      const errorMessage = error?.message || "Please try again later.";
-      toast({
-        title: "Signup failed",
-        description: errorMessage,
-        variant: "destructive",
-      });
-    },
-  });
-
   const handleInputChange = (field: string, value: string) => {
     setFormData(prev => ({ ...prev, [field]: value }));
   };
 
   const handleSignUp = (e: React.FormEvent) => {
     e.preventDefault();
-    
-    // Basic validation
-    if (formData.password !== formData.confirmPassword) {
-      toast({
-        title: "Password mismatch",
-        description: "Passwords do not match.",
-        variant: "destructive",
-      });
-      return;
-    }
-
-    if (formData.password.length < 8) {
-      toast({
-        title: "Password too short",
-        description: "Password must be at least 8 characters.",
-        variant: "destructive",
-      });
-      return;
-    }
-
-    signupMutation.mutate(formData);
+    // Demo: Just redirect to verification
+    localStorage.setItem("verificationEmail", formData.email);
+    setLocation("/verify-email");
   };
 
   return (
@@ .. @@
               <Button
                 type="submit"
-                disabled={signupMutation.isPending}
                 className="w-full bg-[var(--rooted-primary)] text-white py-4 rounded-xl font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors text-lg mt-8"
               >
-                {signupMutation.isPending ? "Creating account..." : "Sign up ✨"}
+                Sign up ✨
               </Button>
 
               {/* Sign in link */}