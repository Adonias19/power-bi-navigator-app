
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Report } from "@/types";

interface ReportViewerProps {
  report: Report | null;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!report) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg border border-gray-200">
        <p className="text-gray-500">Select a report to view</p>
      </div>
    );
  }

  return (
    <Card className="w-full h-full overflow-hidden border border-gray-200">
      <CardContent className="p-0 h-full">
        {isLoading && (
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-powerbi-primary"></div>
          </div>
        )}
        <iframe
          title={report.name}
          src={report.embedUrl}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          style={{ display: isLoading ? "none" : "block" }}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </CardContent>
    </Card>
  );
};

export default ReportViewer;
