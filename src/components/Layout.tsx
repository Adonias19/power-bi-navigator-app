
import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { NavigationCategory, NavigationItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useOrganizations } from "@/hooks/use-organizations";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger 
} from "@/components/ui/navigation-menu";
import { Building2 } from "lucide-react";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { profile, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const { organizations, fetchOrganizations, switchOrganization } = useOrganizations();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch organizations for super admin
  useEffect(() => {
    if (isSuperAdmin) {
      fetchOrganizations();
    }
  }, [isSuperAdmin, fetchOrganizations]);

  useEffect(() => {
    // Only fetch navigation when profile is loaded and we have an organization_id
    if (profile?.organization_id) {
      fetchNavigation(profile.organization_id);
    }
  }, [profile]);

  const fetchNavigation = async (organizationId: string) => {
    try {
      setIsLoading(true);
      
      // Fetch navigation categories for the organization
      const { data: categories, error: categoriesError } = await supabase
        .from('nav_categories')
        .select('*')
        .eq('organization_id', organizationId)
        .order('order_index', { ascending: true });
        
      if (categoriesError) throw categoriesError;
      
      // Fetch navigation items for the organization
      const { data: items, error: itemsError } = await supabase
        .from('nav_items')
        .select('*')
        .eq('organization_id', organizationId)
        .order('order_index', { ascending: true });
        
      if (itemsError) throw itemsError;
      
      // Format the data to match our frontend types
      const formattedCategories: NavigationCategory[] = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        order: cat.order_index,
        items: [] // Add empty items array to satisfy the type
      }));
      
      const formattedItems: NavigationItem[] = items.map(item => ({
        id: item.id,
        name: item.name,
        path: item.path,
        icon: item.icon,
        embedUrl: item.embed_url,
        categoryId: item.category_id,
        order: item.order_index
      }));
      
      // Save to localStorage for the sidebar to use
      localStorage.setItem('appNavigation', JSON.stringify({
        categories: formattedCategories,
        items: formattedItems
      }));
      
      // Trigger storage event for sidebar to detect
      window.dispatchEvent(new Event('storage'));
      
    } catch (error: any) {
      console.error("Error fetching navigation:", error);
      toast({
        title: "Error loading navigation",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchOrganization = (orgId: string) => {
    switchOrganization(orgId);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {isSuperAdmin && (
          <div className="p-2 bg-powerbi-dark text-white">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-powerbi-dark text-white hover:bg-powerbi-primary/80">
                    <Building2 className="mr-2 h-4 w-4" />
                    Organizations
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white p-2 rounded-md shadow-lg w-64 z-50">
                    <div className="flex flex-col space-y-1">
                      {organizations.map((org) => (
                        <Button
                          key={org.id}
                          variant="ghost"
                          className="justify-start text-left"
                          onClick={() => handleSwitchOrganization(org.id)}
                        >
                          {org.name}
                          {org.id === profile?.organization_id && (
                            <span className="ml-2 text-xs text-green-500">(current)</span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}
        <div className="p-6 h-[calc(100vh-60px)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
