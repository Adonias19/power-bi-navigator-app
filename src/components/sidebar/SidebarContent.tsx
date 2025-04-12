
import React from "react";
import SidebarCategory from "./SidebarCategory";
import { NavCategory } from "./types";

interface SidebarContentProps {
  categories: NavCategory[];
  collapsed: boolean;
  toggleCategory: (index: number) => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({ 
  categories, 
  collapsed, 
  toggleCategory 
}) => {
  return (
    <div className="flex-1 py-4 overflow-y-auto">
      {categories.map((category, index) => (
        <SidebarCategory
          key={category.name}
          name={category.name}
          icon={category.icon}
          items={category.items}
          expanded={category.expanded || false}
          collapsed={collapsed}
          index={index}
          toggleCategory={toggleCategory}
          showEmbedUrl={true} // Always show embed URL info 
        />
      ))}
    </div>
  );
};

export default SidebarContent;
