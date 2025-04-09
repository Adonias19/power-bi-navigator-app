
import React from "react";
import { ChevronLeft, Menu } from "lucide-react";

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed, toggleSidebar }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-powerbi-accent/20">
      {!collapsed && (
        <div className="font-bold text-xl text-powerbi-accent">PowerBI Nav</div>
      )}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md hover:bg-powerbi-accent/10 transition-colors"
      >
        {collapsed ? (
          <Menu className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default SidebarHeader;
