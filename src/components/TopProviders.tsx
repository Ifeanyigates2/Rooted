import { useQuery } from "@tanstack/react-query";
import type { Provider } from "@shared/schema";
import ProviderCard from "./ProviderCard";

export default function TopProviders() {
  const { data: providers, isLoading } = useQuery<Provider[]>({
    queryKey: ["/api/providers?topRated=true&limit=4"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--rooted-primary)] mb-12">Top Rated Provider</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-2/3"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[var(--rooted-primary)] mb-12">Top Rated Provider</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers?.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </section>
  );
}
