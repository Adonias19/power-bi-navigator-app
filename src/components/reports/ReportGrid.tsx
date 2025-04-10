
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Report } from "@/types";

interface ReportGridProps {
  reports: Report[];
  selectedReport: Report | null;
  onSelectReport: (report: Report) => void;
}

const ReportGrid: React.FC<ReportGridProps> = ({ 
  reports, 
  selectedReport, 
  onSelectReport 
}) => {
  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reports found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {reports.map((report) => (
        <Card 
          key={report.id} 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedReport?.id === report.id ? 'ring-2 ring-powerbi-primary' : ''
          }`}
          onClick={() => onSelectReport(report)}
        >
          <CardContent className="p-0">
            <div 
              className="h-32 bg-cover bg-center" 
              style={{ backgroundImage: `url(${report.thumbnail})` }}
            />
            <div className="p-4">
              <h3 className="font-medium">{report.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{report.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportGrid;
