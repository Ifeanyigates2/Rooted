import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import type { Provider } from "@shared/schema";

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const getCategoryLabel = (categoryId: number): string => {
    const categoryMap: Record<number, string> = {
      1: "Hairstylist",
      2: "Nails",
      3: "Lash",
      4: "Body",
      5: "Tattoo",
      6: "Makeup",
      7: "Waxing",
      8: "Barber",
    };
    return categoryMap[categoryId] || "Service";
  };

  const getProviderDisplayContent = () => {
    // Special handling for specific providers based on design
    if (provider.name === "Crowned Beauty") {
      return (
        <div className="relative bg-black flex items-center justify-center h-48">
          <div className="text-white text-center">
            <div className="text-2xl font-light">Obsalon</div>
          </div>
        </div>
      );
    }
    
    if (provider.name === "The Tail Bandit") {
      return (
        <div className="relative bg-gray-50 flex items-center justify-center h-48">
          <div className="text-center">
            <div className="text-2xl font-light text-[var(--rooted-primary)] mb-2">the tail</div>
            <div className="text-[var(--rooted-accent)] font-medium">BANDIT</div>
            <div className="text-sm text-[var(--rooted-secondary)] mt-2">PONYTAILS | SEW INS | QUICKWEAVES</div>
          </div>
        </div>
      );
    }
    
    if (provider.name === "ITSMBEAUTY") {
      return (
        <div className="relative bg-gray-100 flex items-center justify-center h-48">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-gray-300">
            <span className="text-gray-400 text-sm font-medium">Itsmbeauty</span>
          </div>
        </div>
      );
    }
    
    // Default case with image
    if (provider.imageUrl) {
      return (
        <div className="relative">
          <img 
            src={provider.imageUrl} 
            alt={provider.name} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-4 left-4">
            <div className="text-white font-bold text-2xl">{provider.name}</div>
          </div>
        </div>
      );
    }
    
    // Fallback
    return (
      <div className="relative bg-gray-100 flex items-center justify-center h-48">
        <div className="text-[var(--rooted-primary)] font-bold text-xl">{provider.name}</div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden provider-card">
      <div className="relative">
        {getProviderDisplayContent()}
        <div className="absolute top-4 left-4">
          <Badge className="bg-[var(--rooted-primary)] text-white hover:bg-[var(--rooted-primary)]/90">
            {getCategoryLabel(provider.categoryId)}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 p-0 h-auto"
          onClick={handleFavoriteClick}
        >
          <Heart 
            className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </Button>
      </div>
      
      <div className="p-4">
        {provider.name !== "KDHAIR" && (
          <h3 className="font-bold text-[var(--rooted-primary)] mb-1">{provider.name}</h3>
        )}
        <div className="flex items-center mb-2">
          <div className="flex text-[var(--rooted-accent)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span className="ml-2 text-sm text-[var(--rooted-secondary)]">
            {provider.rating} ({provider.reviewCount})
          </span>
        </div>
        <p className="text-[var(--rooted-secondary)] text-sm mb-3">{provider.location}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-[var(--rooted-secondary)]">Starting from</span>
            <span className="text-xl font-bold text-[var(--rooted-primary)] ml-1">
              £{provider.startingPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
