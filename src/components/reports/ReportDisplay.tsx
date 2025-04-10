
import React from "react";
import ReportViewer from "@/components/ReportViewer";
import { Report } from "@/types";

interface ReportDisplayProps {
  report: Report | null;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  if (!report) return null;
  
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">{report.name}</h2>
      <p className="text-gray-500 mb-4">{report.description}</p>
      <ReportViewer report={report} />
    </div>
  );
};

export default ReportDisplay;
