
import React from "react";

interface SidebarHeaderProps {
  logo?: string | null;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ logo }) => {
  return (
    <div className="flex items-center p-4 border-b border-powerbi-accent/20">
      {logo ? (
        <img src={logo} alt="Logo" className="max-h-8" />
      ) : (
        <div className="font-bold text-xl text-powerbi-accent">PowerBI Nav</div>
      )}
    </div>
  );
};

export default SidebarHeader;
