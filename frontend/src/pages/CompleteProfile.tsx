import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CompleteProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    profilePicture: null as File | null,
    gender: "",
    ethnicity: "",
    ageRange: "",
    allergies: "",
    interests: [] as string[]
  });

  const interests = [
    { id: "hair", label: "Hair", image: "https://images.unsplash.com/photo-1560869713-7d0ac4c75a60?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "makeup", label: "Makeup", image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "wellness", label: "Wellness", image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "waxing", label: "Waxing", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "skin", label: "Skin", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "barber", label: "Barber", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "nails", label: "Nails", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "cosmetic-procedure", label: "Cosmetic procedure", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "chiropractors", label: "Chiropractors", image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "alternative-medicine", label: "Alternative medicine", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "fitness", label: "Fitness", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "coaching", label: "Coaching", image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" }
  ];

  const profileUpdateMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const response = await apiRequest("POST", "/api/complete-profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile completed successfully!",
        description: "Welcome to rooted. Let's find your perfect beauty match.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Failed to save profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interestId: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    profileUpdateMutation.mutate(profileData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/">
          <h1 className="text-2xl font-bold text-[var(--rooted-primary)] cursor-pointer">rooted.</h1>
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side - Form */}
          <div className="max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[var(--rooted-primary)] mb-2">Complete your profile</h2>
              <p className="text-[var(--rooted-secondary)]">Help us serve you better, by providing the following information</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {profileData.profilePicture ? (
                      <img
                        src={URL.createObjectURL(profileData.profilePicture)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-[var(--rooted-primary)]">Upload Profile Picture</p>
                  <p className="text-xs text-[var(--rooted-secondary)]">2 MB, JPG, PNG</p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--rooted-primary)] mb-2">Gender</label>
                  <Select value={profileData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="bg-gray-100 border-0 rounded-xl">
                      <SelectValue placeholder="Select options" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--rooted-primary)] mb-2">Ethnicity</label>
                  <Select value={profileData.ethnicity} onValueChange={(value) => handleInputChange("ethnicity", value)}>
                    <SelectTrigger className="bg-gray-100 border-0 rounded-xl">
                      <SelectValue placeholder="Select options" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="african-caribbean">African/Caribbean</SelectItem>
                      <SelectItem value="asian">Asian</SelectItem>
                      <SelectItem value="hispanic-latino">Hispanic/Latino</SelectItem>
                      <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                      <SelectItem value="mixed-heritage">Mixed Heritage</SelectItem>
                      <SelectItem value="white-european">White/European</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--rooted-primary)] mb-2">Age range</label>
                  <Select value={profileData.ageRange} onValueChange={(value) => handleInputChange("ageRange", value)}>
                    <SelectTrigger className="bg-gray-100 border-0 rounded-xl">
                      <SelectValue placeholder="Select options" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45-54">45-54</SelectItem>
                      <SelectItem value="55-64">55-64</SelectItem>
                      <SelectItem value="65+">65+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--rooted-primary)] mb-2">Allergies</label>
                  <Input
                    type="text"
                    placeholder="Enter here"
                    value={profileData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    className="bg-gray-100 border-0 rounded-xl"
                  />
                </div>
              </div>

              {/* Save Button */}
              <Button
                type="submit"
                disabled={profileUpdateMutation.isPending}
                className="w-full bg-[var(--rooted-primary)] text-white py-4 rounded-xl font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors text-lg"
              >
                {profileUpdateMutation.isPending ? "Saving..." : "Save ✨"}
              </Button>
            </form>
          </div>

          {/* Right side - Interests */}
          <div>
            <h3 className="text-xl font-semibold text-[var(--rooted-primary)] mb-6">Select your interests</h3>
            <div className="grid grid-cols-2 gap-4">
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => handleInterestToggle(interest.id)}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                    profileData.interests.includes(interest.id)
                      ? 'bg-[var(--rooted-primary)] text-white'
                      : 'bg-gray-100 text-[var(--rooted-primary)] hover:bg-gray-200'
                  }`}
                >
                  <img
                    src={interest.image}
                    alt={interest.label}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">{interest.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}