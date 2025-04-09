
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  PieChart,
  LineChart,
  AreaChart,
  GanttChart,
  Boxes,
  BookOpen
} from "lucide-react";

type NavCategory = {
  name: string;
  icon: React.ReactNode;
  items: NavItem[];
  expanded?: boolean;
};

type NavItem = {
  name: string;
  path: string;
  icon?: React.ReactNode;
};

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
        collapsed ? "w-16" : "w-64"
      )}
    >
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

      <div className="flex-1 py-4 overflow-y-auto">
        {categories.map((category, index) => (
          <div key={category.name} className="mb-4">
            <div 
              className={cn(
                "flex items-center px-4 py-2 text-gray-300 cursor-pointer",
                collapsed ? "justify-center" : "justify-between"
              )}
              onClick={() => !collapsed && toggleCategory(index)}
            >
              {category.icon}
              
              {!collapsed && (
                <>
                  <span className="font-medium text-sm">{category.name}</span>
                  {category.expanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </>
              )}
            </div>
            
            {(!collapsed && category.expanded) && (
              <div className="mt-1 ml-4 space-y-1">
                {category.items.map((item) => (
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
            {(collapsed && category.items) && (
              <div className="flex flex-col items-center space-y-1 mt-1">
                {category.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex justify-center items-center p-2 rounded-md transition-colors",
                        isActive
                          ? "bg-powerbi-primary text-white"
                          : "text-gray-300 hover:bg-powerbi-primary/20"
                      )
                    }
                    title={item.name}
                  >
                    {item.icon}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          cn(
            "flex items-center py-2 px-4 m-2 rounded-md transition-colors",
            collapsed ? "justify-center" : "justify-start",
            isActive
              ? "bg-powerbi-primary text-white"
              : "text-gray-300 hover:bg-powerbi-primary/20"
          )
        }
      >
        <Settings className="h-5 w-5" />
        {!collapsed && <span className="ml-3">Settings</span>}
      </NavLink>

      <div className="p-4 border-t border-powerbi-accent/20">
        <NavLink
          to="/login"
          className="flex items-center py-2 px-4 rounded-md text-gray-300 hover:bg-powerbi-primary/20 transition-colors"
          style={{ justifyContent: collapsed ? "center" : "start" }}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
