
import React, { useState } from "react";
import Layout from "@/components/Layout";
import ReportViewer from "@/components/ReportViewer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Report } from "@/types";

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

const Reports: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Filter reports based on search query
  const filteredReports = reportCategories[selectedTab as keyof typeof reportCategories].filter(
    report => report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search reports..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="all">All Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab} className="mt-6">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No reports found. Try a different search term.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {filteredReports.map((report) => (
                    <Card 
                      key={report.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedReport?.id === report.id ? 'ring-2 ring-powerbi-primary' : ''
                      }`}
                      onClick={() => setSelectedReport(report)}
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

                <ReportViewer report={selectedReport} />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
