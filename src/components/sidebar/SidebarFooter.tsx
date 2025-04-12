
import React from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface SidebarFooterProps {
  collapsed: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed }) => {
  const { signOut, isLoading } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="p-4 border-t border-powerbi-accent/20">
      <Button
        variant="ghost"
        className={cn(
          "flex w-full items-center py-2 px-4 rounded-md text-gray-300 hover:bg-powerbi-primary/20 transition-colors",
          collapsed ? "justify-start" : "justify-start"
        )}
        onClick={handleLogout}
        disabled={isLoading}
      >
        <LogOut className="h-5 w-5" />
        <span className={cn("ml-3", collapsed ? "block text-xs" : "block")}>
          {isLoading ? "Logging out..." : "Logout"}
        </span>
      </Button>
    </div>
  );
};

export default SidebarFooter;
