import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
 
export default function CompleteProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    profilePicture: null as File | null,
    gender: "",
    interests: [] as string[],
    bio: "",
    location: ""
  });

  const interests = [
    { id: "skincare", label: "Skincare", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "makeup", label: "Makeup", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "haircare", label: "Hair Care", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "wellness", label: "Wellness", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { id: "fashion", label: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    profileUpdateMutation.mutate(profileData);
    // Demo: Just redirect to home
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Tell us about yourself to get personalized recommendations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Profile Picture */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileData.profilePicture ? (
                  <img 
                    src={URL.createObjectURL(profileData.profilePicture)} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setProfileData(prev => ({ ...prev, profilePicture: file }));
                  }
                }}
                className="hidden"
                id="profile-picture"
              />
              <label
                htmlFor="profile-picture"
                className="text-[var(--rooted-primary)] font-medium cursor-pointer hover:underline"
              >
                Add Profile Picture
              </label>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={profileData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rooted-primary)] focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Interests</label>
              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => handleInterestToggle(interest.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      profileData.interests.includes(interest.id)
                        ? 'border-[var(--rooted-primary)] bg-[var(--rooted-primary)]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={interest.image}
                      alt={interest.label}
                      className="w-12 h-12 rounded-lg mx-auto mb-2 object-cover"
                    />
                    <span className="text-sm font-medium">{interest.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rooted-primary)] focus:border-transparent resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, State"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--rooted-primary)] focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              disabled={profileUpdateMutation.isPending}
              className="w-full bg-[var(--rooted-primary)] text-white py-4 rounded-xl font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors text-lg"
            >
              {profileUpdateMutation.isPending ? "Saving..." : "Save ✨"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}