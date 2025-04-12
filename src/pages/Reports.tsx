
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Report } from "@/types";
import ReportNavigation from "@/components/reports/ReportNavigation";
import ReportDisplay from "@/components/reports/ReportDisplay";

// Navigation reports data with consistent Power BI URL
const navigationReports = [
  {
    id: "nav1",
    name: "Sales Dashboard",
    embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
    description: ""
  },
  {
    id: "nav2",
    name: "Marketing Analysis",
    embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
    description: ""
  },
  {
    id: "nav3",
    name: "Financial Reports",
    embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
    description: ""
  },
  {
    id: "nav4",
    name: "Customer Insights",
    embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
    description: ""
  }
];

const Reports: React.FC = () => {
  const location = useLocation();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Always set default report from URL or navigation
  useEffect(() => {
    if (location.state?.embedUrl) {
      setSelectedReport({
        id: "url-embedded",
        name: "Embedded Report",
        embedUrl: location.state.embedUrl,
        description: ""
      });
    } else if (navigationReports.length > 0) {
      // Default to first navigation report if no URL report
      setSelectedReport(navigationReports[0]);
    }
  }, [location.state]);

  // Handle navigation report selection
  const handleNavReportSelect = (report: Report) => {
    setSelectedReport(report);
  };

  return (
    <Layout>
      <div className="space-y-4">
        <ReportNavigation 
          reports={navigationReports} 
          selectedReport={selectedReport} 
          onSelectReport={handleNavReportSelect} 
        />

        {/* Display the selected report */}
        <ReportDisplay report={selectedReport} />
      </div>
    </Layout>
  );
};

export default Reports;
