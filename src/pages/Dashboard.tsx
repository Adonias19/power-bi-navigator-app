
import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import DashboardOverview from "@/components/DashboardOverview";
import ReportViewer from "@/components/ReportViewer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell, ResponsiveContainer } from "recharts";

const dashboardData = {
  weeklyViews: [
    { name: "Mon", views: 400 },
    { name: "Tue", views: 300 },
    { name: "Wed", views: 520 },
    { name: "Thu", views: 480 },
    { name: "Fri", views: 380 },
    { name: "Sat", views: 250 },
    { name: "Sun", views: 200 },
  ],
  reportUsage: [
    { name: "Sales", value: 35 },
    { name: "Marketing", value: 25 },
    { name: "Finance", value: 20 },
    { name: "HR", value: 10 },
    { name: "Operations", value: 10 },
  ],
  monthlyTrends: [
    { name: "Jan", reports: 4, views: 500 },
    { name: "Feb", reports: 5, views: 600 },
    { name: "Mar", reports: 6, views: 800 },
    { name: "Apr", reports: 8, views: 1200 },
    { name: "May", reports: 10, views: 1800 },
    { name: "Jun", reports: 12, views: 2345 },
  ],
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Dashboard: React.FC = () => {
  const location = useLocation();
  const embedUrl = location.state?.embedUrl;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>

        {embedUrl ? (
          <div className="mb-6">
            <ReportViewer report={{ 
              id: "dashboard-embedded", 
              name: "Dashboard Report", 
              embedUrl: embedUrl,
              description: "Embedded Power BI report" 
            }} />
          </div>
        ) : (
          <DashboardOverview />
        )}

        {!embedUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Views</CardTitle>
                <CardDescription>Report views over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.weeklyViews}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} views`, "Views"]} />
                    <Bar
                      dataKey="views"
                      fill="#0078D4"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Usage by Department</CardTitle>
                <CardDescription>Distribution of report usage</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.reportUsage}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardData.reportUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Usage"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Growth</CardTitle>
                <CardDescription>Reports and views over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.monthlyTrends}>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="reports"
                      stroke="#0078D4"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="views"
                      stroke="#00B7C3"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
