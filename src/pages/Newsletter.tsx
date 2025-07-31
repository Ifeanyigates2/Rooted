@@ .. @@
-import { useMutation } from "@tanstack/react-query";
-import { apiRequest } from "@/lib/queryClient";
-import { useToast } from "@/hooks/use-toast";
 
 export default function Newsletter() {
   const [email, setEmail] = useState("");
-  const { toast } = useToast();
-
-  const subscriptionMutation = useMutation({
-    mutationFn: async (email: string) => {
-      const response = await apiRequest("POST", "/api/newsletter", { email });
-      return response.json();
-    },
-    onSuccess: () => {
-      toast({
-        title: "Successfully subscribed!",
-        description: "You'll receive beauty tips and exclusive offers.",
-      });
-      setEmail("");
-    },
-    onError: () => {
-      toast({
-        title: "Subscription failed",
-        description: "Please try again later.",
-        variant: "destructive",
-      });
-    },
-  });
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (email) {
-      subscriptionMutation.mutate(email);
+      // Demo: Just show alert and clear email
+      alert("Successfully subscribed to newsletter!");
+      setEmail("");
     }
   };
 
@@ .. @@
           <Button 
             type="submit"
-            disabled={subscriptionMutation.isPending}
             className="bg-[var(--rooted-primary)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors"
           >
-            {subscriptionMutation.isPending ? "Subscribing..." : "Subscribe"}
+            Subscribe
           </Button>
         </form>
       </div>