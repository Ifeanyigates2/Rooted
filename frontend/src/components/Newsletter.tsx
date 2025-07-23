import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscriptionMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/newsletter", { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive beauty tips and exclusive offers.",
      });
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscriptionMutation.mutate(email);
    }
  };

  return (
    <section className="py-16 bg-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-[var(--rooted-primary)] mb-4">Stay Connected with Your Beauty Community</h2>
        <p className="text-[var(--rooted-secondary)] text-lg mb-8">Get exclusive tips, provider spotlights, and special offers delivered to your inbox.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-3 bg-white border border-gray-300 rounded-full focus:ring-[var(--rooted-accent)] focus:border-[var(--rooted-accent)]"
            required
          />
          <Button 
            type="submit"
            disabled={subscriptionMutation.isPending}
            className="bg-[var(--rooted-primary)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors"
          >
            {subscriptionMutation.isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}
