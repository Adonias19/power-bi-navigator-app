
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart, TrendingUp, Users } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendUp,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-powerbi-light flex items-center justify-center text-powerbi-primary">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className="flex items-center mt-2">
          <span
            className={`text-xs ${
              trendUp ? "text-green-500" : "text-red-500"
            } flex items-center`}
          >
            <TrendingUp
              className={`h-3 w-3 mr-1 ${!trendUp && "transform rotate-180"}`}
            />
            {trend}
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

const DashboardOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Reports"
        value="12"
        description="Active Power BI reports"
        icon={<BarChart3 className="h-4 w-4" />}
        trend="4% from last month"
        trendUp={true}
      />
      <StatCard
        title="Total Views"
        value="2,345"
        description="Report views this month"
        icon={<Users className="h-4 w-4" />}
        trend="12% from last month"
        trendUp={true}
      />
      <StatCard
        title="Performance"
        value="98.2%"
        description="Average load time"
        icon={<TrendingUp className="h-4 w-4" />}
        trend="2% from last month"
        trendUp={true}
      />
      <StatCard
        title="Data Freshness"
        value="6h"
        description="Average refresh interval"
        icon={<PieChart className="h-4 w-4" />}
        trend="Same as last month"
        trendUp={true}
      />
    </div>
  );
};

export default DashboardOverview;
