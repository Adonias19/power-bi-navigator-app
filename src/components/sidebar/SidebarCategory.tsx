
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
}

export const SidebarCategory: React.FC<SidebarCategoryProps> = ({
  name,
  icon,
  items,
  expanded,
  collapsed,
  index,
  toggleCategory
}) => {
  const location = useLocation();
  
  return (
    <div className="mb-4">
      <div 
        className="flex items-center px-4 py-2 text-gray-300 justify-between"
        onClick={() => toggleCategory(index)}
      >
        <div className="flex items-center">
          {icon}
          <span className="font-medium text-sm ml-2">
            {name}
          </span>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </div>
      
      {expanded && (
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
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarCategory;
