import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Demo: Just show alert and clear email
      alert("Successfully subscribed to newsletter!");
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Stay Beautiful with Our Newsletter
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Get the latest beauty tips, product recommendations, and exclusive offers 
          delivered straight to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--rooted-primary)] focus:border-transparent"
            required
          />
          <Button 
            type="submit"
            className="bg-[var(--rooted-primary)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}