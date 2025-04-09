
import React from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  collapsed: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed }) => {
  return (
    <div className="p-4 border-t border-powerbi-accent/20">
      <NavLink
        to="/login"
        className={cn(
          "flex items-center py-2 px-4 rounded-md text-gray-300 hover:bg-powerbi-primary/20 transition-colors",
          collapsed ? "justify-start" : "justify-start"
        )}
      >
        <LogOut className="h-5 w-5" />
        <span className={cn("ml-3", collapsed ? "block text-xs" : "block")}>Logout</span>
      </NavLink>
    </div>
  );
};

export default SidebarFooter;
