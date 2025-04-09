
import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  path: string;
  icon?: React.ReactNode;
};

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
            >
              {item.icon}
              <span>{item.name}</span>
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
