
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Report } from "@/types";
import ReportNavigation from "@/components/reports/ReportNavigation";
import ReportDisplay from "@/components/reports/ReportDisplay";

const DEFAULT_EMBED_URL = "https://playground.powerbi.com/sampleReportEmbed";

// Fetch navigation items dynamically from Supabase
const Reports: React.FC = () => {
  const location = useLocation();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  // Load navigation reports from Supabase on mount or when DB changes
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("nav_items")
        .select("id, name, embed_url")
        .order("order_index", { ascending: true });
      if (!error && data) {
        const dbReports = data.map(item => ({
          id: item.id,
          name: item.name,
          embedUrl: item.embed_url || DEFAULT_EMBED_URL,
          description: ""
        }));
        setReports(dbReports);
        // Select report from URL state if exists, else default to first one
        if (location.state?.embedUrl) {
          setSelectedReport({
            id: "url-embedded",
            name: "Embedded Report",
            embedUrl: location.state.embedUrl,
            description: ""
          });
        } else if (dbReports.length > 0) {
          setSelectedReport(dbReports[0]);
        }
      }
      setLoading(false);
    };
    fetchReports();
    // Also listen for localStorage event to update on nav/db change
    const listener = () => fetchReports();
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, [location.state]);

  const handleNavReportSelect = (report: Report) => {
    setSelectedReport(report);
  };

  return (
    <Layout>
      <div className="space-y-4">
        <ReportNavigation
          reports={reports}
          selectedReport={selectedReport}
          onSelectReport={handleNavReportSelect}
        />
        <ReportDisplay report={selectedReport} loading={loading} />
      </div>
    </Layout>
  );
};

export default Reports;
