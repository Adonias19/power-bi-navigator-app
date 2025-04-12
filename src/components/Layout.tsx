
import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { NavigationCategory, NavigationItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

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
        order: cat.order_index
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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
