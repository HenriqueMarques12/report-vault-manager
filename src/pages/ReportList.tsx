
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useReports, ReportCategory } from '@/contexts/ReportContext';
import { useAuth } from '@/contexts/AuthContext';
import ReportCard from '@/components/ReportCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';

const ReportList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'all'>('all');
  const { reports } = useReports();
  const { currentUser } = useAuth();

  // Filter reports by category, search query, and user access
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Check user access
      if (!report.accessRoles.includes(currentUser?.role || 'user')) {
        return false;
      }
      
      // Check category filter
      if (selectedCategory !== 'all' && report.category !== selectedCategory) {
        return false;
      }
      
      // Check search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          report.title.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [reports, searchQuery, selectedCategory, currentUser]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Browse and download available reports.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search reports..."
          />
        </div>
        <div className="flex-1 overflow-auto">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredReports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
      
      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {searchQuery || selectedCategory !== 'all' 
              ? "No reports match your filters. Try adjusting your search criteria."
              : "No reports available. Contact an administrator for more information."}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportList;
