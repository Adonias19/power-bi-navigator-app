
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarContent from "./SidebarContent";
import SidebarSettings from "./SidebarSettings";
import SidebarFooter from "./SidebarFooter";
import { NavCategory } from "./types";
import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  LineChart,
  AreaChart,
  GanttChart,
  Boxes,
  BookOpen
} from "lucide-react";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState<NavCategory[]>([
    {
      name: "Dashboards",
      icon: <Boxes className="h-5 w-5" />,
      expanded: true,
      items: [
        {
          name: "Overview",
          path: "/dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />
        },
        {
          name: "Analytics",
          path: "/dashboard/analytics",
          icon: <PieChart className="h-4 w-4" />
        }
      ]
    },
    {
      name: "Reports",
      icon: <BookOpen className="h-5 w-5" />,
      expanded: true,
      items: [
        {
          name: "All Reports",
          path: "/reports",
          icon: <BarChart3 className="h-4 w-4" />
        },
        {
          name: "Financial",
          path: "/reports/financial",
          icon: <LineChart className="h-4 w-4" />
        },
        {
          name: "Marketing",
          path: "/reports/marketing",
          icon: <AreaChart className="h-4 w-4" />
        },
        {
          name: "Operations",
          path: "/reports/operations",
          icon: <GanttChart className="h-4 w-4" />
        }
      ]
    }
  ]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleCategory = (index: number) => {
    setCategories(prev => 
      prev.map((cat, i) => 
        i === index ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  return (
    <div
      className={cn(
        "h-screen bg-powerbi-dark text-white flex flex-col transition-all duration-300",
        collapsed ? "w-auto min-w-16" : "w-64"
      )}
    >
      <SidebarHeader collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <SidebarContent 
        categories={categories} 
        collapsed={collapsed} 
        toggleCategory={toggleCategory} 
      />
      <SidebarSettings collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} />
    </div>
  );
};

export default Sidebar;
