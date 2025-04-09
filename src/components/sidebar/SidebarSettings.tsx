
import React from "react";
import { NavLink } from "react-router-dom";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarSettingsProps {
  collapsed: boolean;
}

export const SidebarSettings: React.FC<SidebarSettingsProps> = ({ collapsed }) => {
  return (
    <NavLink
      to="/settings"
      className={({ isActive }) =>
        cn(
          "flex items-center py-2 px-4 m-2 rounded-md transition-colors",
          collapsed ? "justify-start" : "justify-start",
          isActive
            ? "bg-powerbi-primary text-white"
            : "text-gray-300 hover:bg-powerbi-primary/20"
        )
      }
    >
      <Settings className="h-5 w-5" />
      <span className={cn("ml-3", collapsed ? "block text-xs" : "block")}>Settings</span>
    </NavLink>
  );
};

export default SidebarSettings;
