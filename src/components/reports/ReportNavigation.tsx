
import React from "react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Report } from "@/types";

interface ReportNavigationProps {
  reports: Report[];
  selectedReport: Report | null;
  onSelectReport: (report: Report) => void;
}

const ReportNavigation: React.FC<ReportNavigationProps> = ({ 
  reports, 
  selectedReport, 
  onSelectReport 
}) => {
  return (
    <NavigationMenu className="max-w-full w-full">
      <NavigationMenuList className="w-full justify-start">
        {reports.map((report) => (
          <NavigationMenuItem key={report.id}>
            <NavigationMenuTrigger 
              onClick={() => onSelectReport(report)}
              className={selectedReport?.id === report.id ? "bg-accent text-accent-foreground" : ""}
            >
              {report.name}
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default ReportNavigation;
