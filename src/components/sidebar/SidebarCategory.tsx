
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem } from "./types";

interface SidebarCategoryProps {
  name: string;
  icon: React.ReactNode;
  items: NavItem[];
  expanded: boolean;
  collapsed: boolean;
  index: number;
  toggleCategory: (index: number) => void;
  showEmbedUrl?: boolean;
}

export const SidebarCategory: React.FC<SidebarCategoryProps> = ({
  name,
  icon,
  items,
  expanded,
  collapsed,
  index,
  toggleCategory,
  showEmbedUrl = false
}) => {
  const location = useLocation();
  
  return (
    <div className="mb-4">
      <div 
        className={cn(
          "flex items-center px-4 py-2 text-gray-300 cursor-pointer",
          collapsed ? "justify-start" : "justify-between"
        )}
        onClick={() => toggleCategory(index)}
      >
        <div className="flex items-center">
          {icon}
          <span className={cn("font-medium text-sm ml-2", collapsed ? "block" : "block")}>
            {name}
          </span>
        </div>
        
        {!collapsed && (
          expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )
        )}
      </div>
      
      {(!collapsed && expanded) && (
        <div className="mt-1 ml-4 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 py-2 px-4 text-sm rounded-md transition-colors",
                  isActive
                    ? "bg-powerbi-primary text-white"
                    : "text-gray-300 hover:bg-powerbi-primary/20"
                )
              }
              state={item.embedUrl ? { embedUrl: item.embedUrl } : undefined}
              end={true}
            >
              {item.icon}
              <span className="flex-1">{item.name}</span>
              {showEmbedUrl && item.embedUrl && false && ( // Set to false to hide the embed URL
                <span className="text-xs text-gray-400 truncate max-w-32" title={item.embedUrl}>
                  {item.embedUrl.substring(0, 20)}...
                </span>
              )}
            </NavLink>
          ))}
        </div>
      )}
      
      {/* Show only icons when collapsed */}
      {(collapsed && items) && (
        <div className="flex flex-col items-start space-y-1 mt-1 px-2">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center p-2 rounded-md transition-colors w-full",
                  isActive
                    ? "bg-powerbi-primary text-white"
                    : "text-gray-300 hover:bg-powerbi-primary/20"
                )
              }
              title={item.name}
              state={item.embedUrl ? { embedUrl: item.embedUrl } : undefined}
              end={true}
            >
              <div className="flex items-center">
                {item.icon}
                <span className="ml-2 text-xs">{item.name}</span>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarCategory;
