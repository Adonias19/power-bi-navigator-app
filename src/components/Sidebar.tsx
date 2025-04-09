
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  ChevronLeft
} from "lucide-react";

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
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

      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-4 rounded-md transition-colors",
                    collapsed ? "justify-center" : "justify-start",
                    isActive
                      ? "bg-powerbi-primary text-white"
                      : "text-gray-300 hover:bg-powerbi-primary/20"
                  )
                }
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

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
