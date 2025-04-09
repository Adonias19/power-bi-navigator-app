
import React, { useState } from "react";
import { User } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserSettings: React.FC = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User>({
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save to backend
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">User Profile</h2>
      
      <div className="flex flex-col sm:flex-row items-start gap-8 mb-8">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-32 w-32">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
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
                value={user.name}
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
                value={user.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input 
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500">
                Leave blank to keep current password
              </p>
            </div>
            
            <div className="mt-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
