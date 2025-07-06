import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Star, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProviderCard from "@/components/ProviderCard";
import { Provider, Service } from "@shared/schema";

interface ServiceWithProvider extends Service {
  provider?: Provider;
}

export default function SearchResults() {
  const [location, setLocation] = useLocation();
  const [searchType, setSearchType] = useState<"provider" | "service">("provider");
  const [query, setQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [category, setCategory] = useState("");

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchType(params.get("type") as "provider" | "service" || "provider");
    setQuery(params.get("q") || "");
    setSearchLocation(params.get("location") || "");
    setCategory(params.get("category") || "");
  }, []);

  // Search providers
  const { data: providers, isLoading: isLoadingProviders } = useQuery({
    queryKey: ["/api/search/providers", query, searchLocation, category],
    enabled: searchType === "provider" && Boolean(query),
  });

  // Search services
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["/api/search/services", query, searchLocation, category],
    enabled: searchType === "service" && Boolean(query),
  });

  // Get providers for services (to show provider info with each service)
  const { data: allProviders } = useQuery({
    queryKey: ["/api/providers"],
    enabled: searchType === "service",
  });

  const servicesWithProviders: ServiceWithProvider[] = services?.map((service: Service) => ({
    ...service,
    provider: allProviders?.find((p: Provider) => p.id === service.providerId)
  })) || [];

  const isLoading = searchType === "provider" ? isLoadingProviders : isLoadingServices;
  const results = searchType === "provider" ? providers : servicesWithProviders;
  const resultCount = results?.length || 0;

  const handleBackClick = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Search Results for "{query}"
            </h1>
            <p className="text-sm text-gray-600">
              {isLoading ? "Searching..." : `${resultCount} ${searchType === "provider" ? "providers" : "services"} found`}
              {searchLocation && ` in ${searchLocation}`}
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resultCount === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No {searchType === "provider" ? "providers" : "services"} found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or location
            </p>
            <Button onClick={handleBackClick}>
              Search Again
            </Button>
          </div>
        ) : searchType === "provider" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(providers as Provider[])?.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesWithProviders?.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 relative">
                  {service.imageUrl ? (
                    <img 
                      src={service.imageUrl} 
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">💅</span>
                    </div>
                  )}
                  {service.trending && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Trending
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                  {service.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  
                  {/* Provider Info */}
                  {service.provider && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {service.provider.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {service.provider.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {service.provider.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{service.provider.rating}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-[var(--rooted-primary)]">
                          {service.price}
                        </span>
                      </div>
                      {service.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}