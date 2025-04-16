import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarContent from "./SidebarContent";
import SidebarSettings from "./SidebarSettings";
import SidebarFooter from "./SidebarFooter";
import { NavCategory } from "./types";
import { NavigationCategory, NavigationItem } from "@/types";
import * as LucideIcons from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LucideIcons.LayoutDashboard className="h-5 w-5" />,
  BarChart3: <LucideIcons.BarChart3 className="h-5 w-5" />,
  PieChart: <LucideIcons.PieChart className="h-5 w-5" />,
  LineChart: <LucideIcons.LineChart className="h-5 w-5" />,
  AreaChart: <LucideIcons.AreaChart className="h-5 w-5" />,
  GanttChart: <LucideIcons.GanttChart className="h-5 w-5" />,
  Boxes: <LucideIcons.Boxes className="h-5 w-5" />,
  BookOpen: <LucideIcons.BookOpen className="h-5 w-5" />,
  Settings: <LucideIcons.Settings className="h-5 w-5" />,
  FolderIcon: <LucideIcons.FolderIcon className="h-5 w-5" />,
  Building2: <LucideIcons.Building2 className="h-5 w-5" />,
};

const getIcon = (iconName: string, size: 'sm' | 'md' = 'md') => {
  if (iconMap[iconName]) {
    return iconMap[iconName];
  }
  return size === 'sm' 
    ? <LucideIcons.Circle className="h-4 w-4" /> 
    : <LucideIcons.Circle className="h-5 w-5" />;
};

const convertNavigation = (
  categories: NavigationCategory[],
  items: NavigationItem[]
): NavCategory[] => {
  return categories
    .sort((a, b) => a.order - b.order)
    .map(category => {
      const categoryItems = items
        .filter(item => item.categoryId === category.id)
        .sort((a, b) => a.order - b.order)
        .map(item => ({
          name: item.name,
          path: item.path,
          icon: getIcon(item.icon, 'sm'),
          embedUrl: item.embedUrl
        }));

      return {
        name: category.name,
        icon: getIcon(category.icon),
        expanded: true,
        items: categoryItems
      };
    });
};

const loadSavedNavigation = () => {
  const savedNav = localStorage.getItem('appNavigation');
  if (savedNav) {
    return JSON.parse(savedNav);
  }
  
  return {
    categories: [
      { id: "cat1", name: "Dashboards", icon: "FolderIcon", items: [], order: 0 },
      { id: "cat2", name: "Reports", icon: "FolderIcon", items: [], order: 1 },
    ],
    items: [
      { id: "1", name: "Overview", path: "/dashboard", icon: "LayoutDashboard", embedUrl: "https://playground.powerbi.com/sampleReportEmbed", categoryId: "cat1", order: 0 },
      { id: "2", name: "Analytics", path: "/dashboard/analytics", icon: "PieChart", embedUrl: "https://playground.powerbi.com/sampleReportEmbed", categoryId: "cat1", order: 1 },
      { id: "3", name: "All Reports", path: "/reports", icon: "BarChart3", embedUrl: "https://playground.powerbi.com/sampleReportEmbed", categoryId: "cat2", order: 0 },
      { id: "4", name: "Financial", path: "/reports/financial", icon: "LineChart", embedUrl: "https://playground.powerbi.com/sampleReportEmbed", categoryId: "cat2", order: 1 },
    ]
  };
};

export const Sidebar = () => {
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const [logo, setLogo] = useState<string | null>(null);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) {
      const themeSettings = JSON.parse(savedTheme);
      setLogo(themeSettings.logo);
      
      const sidebarElement = document.querySelector('.sidebar-container') as HTMLElement;
      if (sidebarElement) {
        sidebarElement.style.backgroundColor = themeSettings.primaryColor;
      }
    }
  }, []);

  useEffect(() => {
    const { categories: savedCategories, items: savedItems } = loadSavedNavigation();
    const convertedCategories = convertNavigation(savedCategories, savedItems);
    setCategories(convertedCategories);
    
    const handleNavigationUpdate = () => {
      const { categories: updatedCategories, items: updatedItems } = loadSavedNavigation();
      const convertedUpdatedCategories = convertNavigation(updatedCategories, updatedItems);
      setCategories(convertedUpdatedCategories);
    };
    
    window.addEventListener('storage', handleNavigationUpdate);
    
    return () => {
      window.removeEventListener('storage', handleNavigationUpdate);
    };
  }, []);

  const toggleCategory = (index: number) => {
    setCategories(prev => 
      prev.map((cat, i) => 
        i === index ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  return (
    <div className="sidebar-container h-screen bg-powerbi-dark text-white flex flex-col w-64">
      <SidebarHeader logo={logo} />
      <SidebarContent 
        categories={categories}
        collapsed={false}
        toggleCategory={toggleCategory}
      />
      <SidebarSettings collapsed={false} />
      <SidebarFooter collapsed={false} />
    </div>
  );
};

export default Sidebar;
