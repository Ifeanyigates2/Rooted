import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Users } from "lucide-react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Beautiful, diverse images of Black American women showcasing natural beauty
  const heroImages = [
    "https://images.unsplash.com/photo-1594736797933-d0d0a7347bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1400&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1400&q=80",
    "https://images.unsplash.com/photo-1596815064285-45ed8a9c8463?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1400&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1400&q=80",
    "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1400&q=80"
  ];

  // Auto-advance slideshow every 4 seconds when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length, isPlaying]);

  const handleSearch = () => {
    console.log("Search initiated:", { searchQuery, location, ethnicity });
    // TODO: Implement search functionality
  };

  return (
    <section className="relative bg-gray-900 min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-gradient z-10"></div>
      
      {/* Main Content Container */}
      <div className="relative z-20 text-center text-white max-w-6xl mx-auto px-4 w-full">
        {/* Hero Text */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
            <span className="text-2xl font-bold">R</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Discover beauty professionals who knows your<br />
            <span className="text-[var(--rooted-accent)]">skin, hair & culture !</span>
          </h1>
        </div>

        {/* Enhanced Slideshow in Foreground */}
        <div className="relative rounded-3xl overflow-hidden mb-8 mx-auto max-w-5xl shadow-2xl">
          <div className="relative h-72 md:h-96 lg:h-[28rem]">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1500 ease-in-out ${
                  index === currentImageIndex 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-105'
                }`}
                style={{ backgroundImage: `url('${image}')` }}
              />
            ))}
            
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            
            {/* Navigation arrows */}
            <button
              onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110 group"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentImageIndex(currentImageIndex === heroImages.length - 1 ? 0 : currentImageIndex + 1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110 group"
              aria-label="Next image"
            >
              <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Enhanced slide indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'w-8 h-3' 
                      : 'w-3 h-3 hover:scale-110'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div className={`w-full h-full rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white shadow-lg' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`} />
                </button>
              ))}
            </div>
            
            {/* Slide counter and play/pause button */}
            <div className="absolute top-4 right-4 flex items-center space-x-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-black/30 hover:bg-black/40 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <div className="bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {heroImages.length}
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Interface Below Slideshow */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--rooted-secondary)] h-4 w-4" />
              <Input
                type="text"
                placeholder="Search Service provider"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-[var(--rooted-accent)] focus:border-[var(--rooted-accent)] text-[var(--rooted-primary)]"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--rooted-secondary)] h-4 w-4" />
              <Input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-[var(--rooted-accent)] focus:border-[var(--rooted-accent)] text-[var(--rooted-primary)]"
              />
            </div>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--rooted-secondary)] h-4 w-4 z-10" />
              <Select value={ethnicity} onValueChange={setEthnicity}>
                <SelectTrigger className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-[var(--rooted-accent)] focus:border-[var(--rooted-accent)] text-[var(--rooted-primary)]">
                  <SelectValue placeholder="Select Ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="african-caribbean">African/Caribbean</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="hispanic-latino">Hispanic/Latino</SelectItem>
                  <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                  <SelectItem value="mixed-heritage">Mixed Heritage</SelectItem>
                  <SelectItem value="all">All Ethnicities</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={handleSearch}
            className="w-full bg-[var(--rooted-primary)] text-white py-4 rounded-xl font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors text-lg"
          >
            Find Your Perfect match
          </Button>
        </div>
      </div>
    </section>
  );
}
