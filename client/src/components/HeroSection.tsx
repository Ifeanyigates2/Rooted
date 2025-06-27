import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Users } from "lucide-react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [ethnicity, setEthnicity] = useState("");

  const handleSearch = () => {
    console.log("Search initiated:", { searchQuery, location, ethnicity });
    // TODO: Implement search functionality
  };

  return (
    <section className="relative bg-gray-900 min-h-[70vh] flex items-center justify-center">
      <div className="absolute inset-0 hero-gradient"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200')"
        }}
      ></div>
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
            <span className="text-2xl font-bold">S</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Discover beauty professionals who knows your<br />
          <span className="text-[var(--rooted-accent)]">skin, hair & culture !</span>
        </h1>
        
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 mt-8 max-w-3xl mx-auto">
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
