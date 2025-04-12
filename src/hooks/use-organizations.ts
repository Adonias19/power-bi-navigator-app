
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type Organization = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, profile, updateProfile, isSuperAdmin } = useAuth();

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      
      // If user is super admin, fetch all organizations
      let query = supabase
        .from('organizations')
        .select('*')
        .order('name');
        
      // If not super admin, only fetch the user's organization
      if (!isSuperAdmin) {
        query = query.eq('id', profile?.organization_id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setOrganizations(data || []);
    } catch (error: any) {
      console.error("Error fetching organizations:", error);
      toast({
        title: "Error",
        description: "Failed to load organizations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOrganization = async (name: string, description?: string) => {
    try {
      setIsLoading(true);
      
      // First insert the new organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name, description }])
        .select()
        .single();
        
      if (orgError) throw orgError;
      
      // If not super admin, update the user's profile to belong to this organization
      if (!isSuperAdmin) {
        // Update the user's profile to belong to this organization
        await updateProfile({
          organization_id: orgData.id
        });
      }
      
      toast({
        title: "Organization created",
        description: `${name} has been created successfully`,
      });
      
      // Refresh the list
      await fetchOrganizations();
      
      return orgData;
    } catch (error: any) {
      console.error("Error creating organization:", error);
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrganization = async (id: string, updates: Partial<Organization>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Organization updated",
        description: `${updates.name || 'Organization'} has been updated`,
      });
      
      // Refresh the list
      await fetchOrganizations();
      
      return data;
    } catch (error: any) {
      console.error("Error updating organization:", error);
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrganization = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Check if this is the user's current organization
      if (id === profile?.organization_id && !isSuperAdmin) {
        toast({
          title: "Cannot delete",
          description: "You cannot delete your current organization",
          variant: "destructive"
        });
        return false;
      }
      
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Organization deleted",
        description: "Organization has been deleted successfully",
      });
      
      // Refresh the list
      await fetchOrganizations();
      
      return true;
    } catch (error: any) {
      console.error("Error deleting organization:", error);
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const switchOrganization = async (organizationId: string) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to switch organizations",
          variant: "destructive"
        });
        return false;
      }
      
      // Update the user's profile
      const { error } = await supabase
        .from('profiles')
        .update({ organization_id: organizationId })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Refresh the user profile to get the updated organization
      await updateProfile({
        organization_id: organizationId
      });
      
      toast({
        title: "Organization switched",
        description: "You have switched to a different organization",
      });
      
      // Reload the page to refresh all components
      window.location.href = '/dashboard';
      
      return true;
    } catch (error: any) {
      console.error("Error switching organization:", error);
      toast({
        title: "Error",
        description: "Failed to switch organization",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    organizations,
    isLoading,
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    switchOrganization
  };
};
