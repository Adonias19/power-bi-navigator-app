
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ReportSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ReportSearch: React.FC<ReportSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search reports..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default ReportSearch;
