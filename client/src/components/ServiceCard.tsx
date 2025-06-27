import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import type { Service, Provider } from "@shared/schema";

interface ServiceCardProps {
  service: Service & { provider?: Provider };
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleBookNow = () => {
    console.log(`Booking service: ${service.name}`);
    // TODO: Implement booking flow
  };

  const getCategoryLabel = (categoryId: number): string => {
    const categoryMap: Record<number, string> = {
      1: "Hair",
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

  const getProviderInitials = (name: string): string => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden provider-card">
      <div className="relative">
        <img 
          src={service.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'} 
          alt={service.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-[var(--rooted-primary)] text-white hover:bg-[var(--rooted-primary)]/90">
            {getCategoryLabel(service.categoryId)}
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
        <h3 className="font-bold text-[var(--rooted-primary)] mb-2">{service.name}</h3>
        <div className="text-3xl font-bold text-[var(--rooted-primary)] mb-3">£{service.price}</div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[var(--rooted-primary)] rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
              {service.provider ? getProviderInitials(service.provider.name) : 'PR'}
            </div>
            <div>
              <div className="text-sm font-medium">
                {service.provider?.name || 'Provider'}
              </div>
              <div className="flex items-center text-[var(--rooted-accent)] text-xs">
                <Star className="h-3 w-3 fill-current mr-1" />
                <span>{service.provider?.rating || '4.9'} ({service.provider?.reviewCount || '13'})</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleBookNow}
            className="bg-[var(--rooted-primary)] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[var(--rooted-primary)]/90 transition-colors"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
