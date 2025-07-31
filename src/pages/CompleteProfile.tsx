@@ .. @@
-import { useMutation } from "@tanstack/react-query";
-import { apiRequest } from "@/lib/queryClient";
-import { useToast } from "@/hooks/use-toast";
 
 export default function CompleteProfile() {
   const [, setLocation] = useLocation();
-  const { toast } = useToast();
   const [profileData, setProfileData] = useState({
     profilePicture: null as File | null,
     gender: "",
@@ .. @@
     { id: "coaching", label: "Coaching", image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" }
   ];
 
-  const profileUpdateMutation = useMutation({
-    mutationFn: async (data: typeof profileData) => {
-      const response = await apiRequest("POST", "/api/complete-profile", data);
-      return response.json();
-    },
-    onSuccess: () => {
-      toast({
-        title: "Profile completed successfully!",
-        description: "Welcome to rooted. Let's find your perfect beauty match.",
-      });
-      setLocation("/");
-    },
-    onError: () => {
-      toast({
-        title: "Failed to save profile",
-        description: "Please try again later.",
-        variant: "destructive",
-      });
-    },
-  });
-
   const handleInputChange = (field: string, value: string) => {
     setProfileData(prev => ({ ...prev, [field]: value }));
   };
@@ .. @@
 
   const handleSave = (e: React.FormEvent) => {
     e.preventDefault();
-    profileUpdateMutation.mutate(profileData);
+    // Demo: Just redirect to home
+    setLocation("/");
   };
 
   return (
@@ .. @@
               <Button
                 type="submit"
-                disabled={profileUpdateMutation.isPending}
                 className="w-full bg-[var(--rooted-primary)] text-white py-4 rounded-xl font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors text-lg"
               >
-                {profileUpdateMutation.isPending ? "Saving..." : "Save ✨"}
+                Save ✨
               </Button>
             </form>
           </div>