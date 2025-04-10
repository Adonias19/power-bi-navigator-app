import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Report } from "@/types";
import ReportSearch from "@/components/reports/ReportSearch";
import ReportGrid from "@/components/reports/ReportGrid";
import ReportNavigation from "@/components/reports/ReportNavigation";
import ReportDisplay from "@/components/reports/ReportDisplay";

// Demo reports data with the Power BI playground sample report
const reportCategories = {
  recent: [
    {
      id: "1",
      name: "Sales Performance",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      description: "Overview of sales performance across regions",
      thumbnail: "https://via.placeholder.com/200x120/0078D4/FFFFFF?text=Sales"
    },
    {
      id: "2",
      name: "Marketing Campaign Results",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      description: "Analysis of recent marketing campaigns",
      thumbnail: "https://via.placeholder.com/200x120/00B7C3/FFFFFF?text=Marketing"
    },
    {
      id: "3",
      name: "Financial Overview Q1",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      description: "Q1 financial performance and metrics",
      thumbnail: "https://via.placeholder.com/200x120/83B9F9/FFFFFF?text=Finance"
    }
  ],
  favorites: [
    {
      id: "2",
      name: "Marketing Campaign Results",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      description: "Analysis of recent marketing campaigns",
      thumbnail: "https://via.placeholder.com/200x120/00B7C3/FFFFFF?text=Marketing"
    },
    {
      id: "4",
      name: "Customer Insights",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      description: "Customer behavior and satisfaction analysis",
      thumbnail: "https://via.placeholder.com/200x120/0D2135/FFFFFF?text=Customers"
    }
  ],
  all: [
    {
      id: "1",
      name: "Sales Performance",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      description: "Overview of sales performance across regions",
      thumbnail: "https://via.placeholder.com/200x120/0078D4/FFFFFF?text=Sales"
    },
    {
      id: "2",
      name: "Marketing Campaign Results",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      description: "Analysis of recent marketing campaigns",
      thumbnail: "https://via.placeholder.com/200x120/00B7C3/FFFFFF?text=Marketing"
    },
    {
      id: "3",
      name: "Financial Overview Q1",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      description: "Q1 financial performance and metrics",
      thumbnail: "https://via.placeholder.com/200x120/83B9F9/FFFFFF?text=Finance"
    },
    {
      id: "4",
      name: "Customer Insights",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      description: "Customer behavior and satisfaction analysis",
      thumbnail: "https://via.placeholder.com/200x120/0D2135/FFFFFF?text=Customers"
    },
    {
      id: "5",
      name: "HR Dashboard",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      description: "Employee metrics and HR analytics",
      thumbnail: "https://via.placeholder.com/200x120/E6F2FF/000000?text=HR"
    },
    {
      id: "6",
      name: "Supply Chain Analysis",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      description: "Supply chain performance and logistics",
      thumbnail: "https://via.placeholder.com/200x120/00B7C3/FFFFFF?text=Supply"
    }
  ]
};

// Navigation reports data
const navigationReports = [
  {
    id: "nav1",
    name: "Sales Dashboard",
    embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
    description: "Overview of sales performance"
  },
  {
    id: "nav2",
    name: "Marketing Analysis",
    embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
    description: "Marketing campaign effectiveness"
  },
  {
    id: "nav3",
    name: "Financial Reports",
    embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
    description: "Financial performance metrics"
  },
  {
    id: "nav4",
    name: "Customer Insights",
    embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
    description: "Customer behavior analytics"
  }
];

const Reports: React.FC = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [navReport, setNavReport] = useState<Report | null>(null);
  
  // Set report from URL if available
  useEffect(() => {
    if (location.state?.embedUrl) {
      setNavReport({
        id: "url-embedded",
        name: "Embedded Report",
        embedUrl: location.state.embedUrl,
        description: "Power BI report embedded from navigation"
      });
    }
  }, [location.state]);

  // Filter reports based on search query
  const filteredReports = reportCategories[selectedTab as keyof typeof reportCategories].filter(
    report => report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle navigation report selection
  const handleNavReportSelect = (report: Report) => {
    setNavReport(report);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
          <ReportSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
        </div>

        {/* Only show navigation menu if no URL report is set */}
        {!location.state?.embedUrl && (
          <ReportNavigation 
            reports={navigationReports} 
            selectedReport={navReport} 
            onSelectReport={handleNavReportSelect} 
          />
        )}

        {/* Display the selected navigation report */}
        <ReportDisplay report={navReport} />

        {/* Only show tabs and card grid if no report is selected from navigation or URL */}
        {!navReport && (
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="all">All Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              <ReportGrid 
                reports={filteredReports} 
                selectedReport={selectedReport} 
                onSelectReport={setSelectedReport} 
              />

              <ReportDisplay report={selectedReport} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
