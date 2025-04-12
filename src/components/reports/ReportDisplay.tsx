
import React from "react";
import ReportViewer from "@/components/ReportViewer";
import { Report } from "@/types";

interface ReportDisplayProps {
  report: Report | null;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  if (!report) return null;
  
  return (
    <div className="h-[calc(100vh-120px)] w-full">
      <ReportViewer report={{
        ...report,
        // Remove name and description to ensure no titles are displayed
        name: "",
        description: ""
      }} />
    </div>
  );
};

export default ReportDisplay;
