
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const UserSettings: React.FC = () => {
  const { toast } = useToast();
  const { user, profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar_url: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        avatar_url: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`
      });
    } else if (user) {
      setFormData({
        name: user.user_metadata?.name || user.email?.split("@")[0] || "",
        email: user.email || "",
        avatar_url: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
      });
    }
  }, [user, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateProfile({
        name: formData.name,
        avatar_url: formData.avatar_url
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">User Profile</h2>
      
      <div className="flex flex-col sm:flex-row items-start gap-8 mb-8">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-32 w-32">
            <AvatarImage src={formData.avatar_url} alt={formData.name} />
            <AvatarFallback>{formData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">Change Avatar</Button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 w-full">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="organization" className="text-sm font-medium">
                Organization
              </label>
              <Input 
                id="organization"
                name="organization"
                value={profile?.organizations?.name || "Not assigned"}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Input 
                id="role"
                name="role"
                value={profile?.role || "user"}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div className="mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
