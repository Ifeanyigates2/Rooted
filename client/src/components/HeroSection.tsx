import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Calendar, Award } from "lucide-react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");

  const handleSearch = () => {
    console.log("Search initiated:", { searchQuery, location, service });
    // TODO: Implement search functionality
  };

  return (
    <section className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 min-h-screen flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-7xl mx-auto px-4 w-full">
        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Text Content */}
          <div className="text-left space-y-8">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              <Award className="w-4 h-4 mr-2 text-yellow-400" />
              #1 Beauty Marketplace Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Find Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Perfect Match
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-medium text-gray-200 mt-2">
                in beauty professionals
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              Connect with culturally-aware beauty experts who understand your unique needs. 
              Book appointments with professionals who celebrate your natural beauty.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-sm text-gray-300">Verified Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">50k+</div>
                <div className="text-sm text-gray-300">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">4.9★</div>
                <div className="text-sm text-gray-300">Average Rating</div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Search Interface */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Appointment</h2>
              <p className="text-gray-600">Find the perfect beauty professional for you</p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for services or professionals"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 text-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 text-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger className="pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 text-lg focus:ring-2 focus:ring-purple-500">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hair">Hair Services</SelectItem>
                    <SelectItem value="nails">Nail Services</SelectItem>
                    <SelectItem value="lashes">Lash Extensions</SelectItem>
                    <SelectItem value="makeup">Makeup Application</SelectItem>
                    <SelectItem value="skincare">Skincare Treatments</SelectItem>
                    <SelectItem value="eyebrows">Eyebrow Services</SelectItem>
                    <SelectItem value="massage">Body Treatments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <Search className="w-5 h-5 mr-2" />
                Find My Perfect Match
              </Button>
            </div>
            
            {/* Quick Service Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Popular services:</p>
              <div className="flex flex-wrap gap-2">
                {["Hair Styling", "Nail Art", "Lash Extensions", "Facials"].map((service) => (
                  <button
                    key={service}
                    className="px-4 py-2 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full text-sm font-medium transition-colors"
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 pt-12 border-t border-white/20">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-sm">Verified Reviews</span>
            </div>
            <div className="flex items-center">
              <Award className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-sm">Licensed Professionals</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-sm">Easy Booking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
