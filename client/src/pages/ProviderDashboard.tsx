import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Eye, Star, Calendar, DollarSign, Users, TrendingUp } from "lucide-react";
import type { Provider, Service, Category } from "@shared/schema";

export default function ProviderDashboard() {
  const { toast } = useToast();
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phone: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Get provider data (assuming the logged-in user is a provider)
  const { data: provider, isLoading: isLoadingProvider } = useQuery<any>({
    queryKey: ["/api/provider/me"],
  });

  // Populate profile form when provider data is loaded
  React.useEffect(() => {
    if (provider) {
      const [firstName, lastName] = provider.name?.split(' ') || ['', ''];
      setProfileForm({
        firstName: firstName || "",
        lastName: lastName || "",
        businessName: provider.businessName || "",
        email: provider.email || "",
        phone: provider.phone || "",
        bio: provider.bio || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  }, [provider]);

  // Get provider's services
  const { data: services = [], isLoading: isLoadingServices } = useQuery<Service[]>({
    queryKey: ["/api/provider/services"],
  });

  // Get categories for service creation
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    categoryId: "",
    imageUrl: "",
  });

  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: async (serviceData: any) => {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(serviceData),
      });
      if (!response.ok) throw new Error("Failed to create service");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Service created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/services"] });
      setIsAddingService(false);
      resetServiceForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create service",
        variant: "destructive",
      });
    },
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, ...serviceData }: any) => {
      const response = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(serviceData),
      });
      if (!response.ok) throw new Error("Failed to update service");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Service updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/services"] });
      setEditingService(null);
      resetServiceForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    },
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: number) => {
      const response = await apiRequest("DELETE", `/api/services/${serviceId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/services"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Omit<typeof profileForm, 'currentPassword' | 'newPassword' | 'confirmPassword'>) => {
      const response = await apiRequest("PATCH", "/api/provider/profile", profileData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/me"] });
      // Clear password fields
      setProfileForm(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (passwordData: { currentPassword: string; newPassword: string }) => {
      const response = await apiRequest("PATCH", "/api/provider/password", passwordData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully",
      });
      setProfileForm(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    },
    onError: (error: any) => {
      toast({
        title: "Password Update Failed",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    },
  });

  const resetServiceForm = () => {
    setServiceForm({
      name: "",
      description: "",
      price: "",
      duration: "",
      categoryId: "",
      imageUrl: "",
    });
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData = {
      ...serviceForm,
      price: parseFloat(serviceForm.price),
      duration: serviceForm.duration ? parseInt(serviceForm.duration) : null,
      categoryId: parseInt(serviceForm.categoryId),
    };

    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, ...serviceData });
    } else {
      createServiceMutation.mutate(serviceData);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration: service.duration?.toString() || "",
      categoryId: service.categoryId.toString(),
      imageUrl: service.imageUrl || "",
    });
    setIsAddingService(true);
  };

  const handleDeleteService = (serviceId: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteServiceMutation.mutate(serviceId);
    }
  };

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { currentPassword, newPassword, confirmPassword, ...profileData } = profileForm;
    
    // Update profile information
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileForm.currentPassword || !profileForm.newPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in both current and new password",
        variant: "destructive",
      });
      return;
    }

    if (profileForm.newPassword !== profileForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match",
        variant: "destructive",
      });
      return;
    }

    if (profileForm.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    updatePasswordMutation.mutate({
      currentPassword: profileForm.currentPassword,
      newPassword: profileForm.newPassword
    });
  };

  if (isLoadingProvider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--rooted-primary)]"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You need to be a registered service provider to access this dashboard.</p>
          <Button onClick={() => window.location.href = "/"}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-[var(--rooted-primary)] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {provider.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{provider.businessName || provider.name}</h1>
                <p className="text-gray-600">{provider.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={provider.verified ? "default" : "secondary"}>
                {provider.verified ? "Verified" : "Unverified"}
              </Badge>
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                View Public Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{services.length}</div>
                  <p className="text-xs text-muted-foreground">Active services</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{provider.rating}</div>
                  <p className="text-xs text-muted-foreground">{provider.reviewCount} reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Starting Price</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">£{provider.startingPrice}</div>
                  <p className="text-xs text-muted-foreground">Base price</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Bookings</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest business activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity to display</p>
                  <p className="text-sm">Your bookings and service updates will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Your Services</h2>
                <p className="text-gray-600">Manage your service offerings</p>
              </div>
              <Button 
                onClick={() => {
                  setIsAddingService(true);
                  setEditingService(null);
                  resetServiceForm();
                }}
                className="bg-[var(--rooted-primary)] hover:bg-[var(--rooted-primary)]/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>

            {isAddingService && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingService ? "Edit Service" : "Add New Service"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Service Name</label>
                        <Input
                          value={serviceForm.name}
                          onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                          placeholder="e.g., Hair Cut & Style"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select
                          value={serviceForm.categoryId}
                          onValueChange={(value) => setServiceForm({ ...serviceForm, categoryId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Price (£)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Duration (minutes)</label>
                        <Input
                          type="number"
                          value={serviceForm.duration}
                          onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                          placeholder="60"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        placeholder="Describe your service..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Image URL (optional)</label>
                      <Input
                        value={serviceForm.imageUrl}
                        onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
                      >
                        {editingService ? "Update" : "Create"} Service
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsAddingService(false);
                          setEditingService(null);
                          resetServiceForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingServices ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--rooted-primary)] mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
                  <p className="text-gray-600 mb-6">Start by adding your first service offering</p>
                  <Button 
                    onClick={() => {
                      setIsAddingService(true);
                      setEditingService(null);
                      resetServiceForm();
                    }}
                    className="bg-[var(--rooted-primary)] hover:bg-[var(--rooted-primary)]/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Service
                  </Button>
                </div>
              ) : (
                services.map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription>£{service.price}</CardDescription>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditService(service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {service.imageUrl && (
                        <img 
                          src={service.imageUrl} 
                          alt={service.name}
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                      )}
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{service.duration ? `${service.duration} min` : "Duration TBD"}</span>
                        {service.trending && (
                          <Badge variant="secondary">Trending</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
                <CardDescription>Manage your upcoming and past appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600">Your bookings will appear here once customers start booking your services</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal and business details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <Input
                        value={profileForm.firstName}
                        onChange={(e) => handleProfileInputChange("firstName", e.target.value)}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <Input
                        value={profileForm.lastName}
                        onChange={(e) => handleProfileInputChange("lastName", e.target.value)}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <Input
                      value={profileForm.businessName}
                      onChange={(e) => handleProfileInputChange("businessName", e.target.value)}
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => handleProfileInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <Input
                      value={profileForm.phone}
                      onChange={(e) => handleProfileInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <Textarea
                      value={profileForm.bio}
                      onChange={(e) => handleProfileInputChange("bio", e.target.value)}
                      placeholder="Tell customers about yourself and your expertise"
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className="w-full md:w-auto"
                  >
                    {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password for security</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <Input
                      type="password"
                      value={profileForm.currentPassword}
                      onChange={(e) => handleProfileInputChange("currentPassword", e.target.value)}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <Input
                      type="password"
                      value={profileForm.newPassword}
                      onChange={(e) => handleProfileInputChange("newPassword", e.target.value)}
                      placeholder="Enter your new password"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <Input
                      type="password"
                      value={profileForm.confirmPassword}
                      onChange={(e) => handleProfileInputChange("confirmPassword", e.target.value)}
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={updatePasswordMutation.isPending}
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}