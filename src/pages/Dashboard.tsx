
import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import ReportViewer from "@/components/ReportViewer";

const Dashboard: React.FC = () => {
  const location = useLocation();
  const embedUrl = location.state?.embedUrl || "https://playground.powerbi.com/sampleReportEmbed";

  return (
    <Layout>
      <div className="h-[calc(100vh-80px)]">
        <ReportViewer report={{ 
          id: "dashboard-embedded", 
          name: "", // Remove name to ensure no title is displayed
          embedUrl: embedUrl,
          description: "" 
        }} />
      </div>
    </Layout>
  );
};

export default Dashboard;
