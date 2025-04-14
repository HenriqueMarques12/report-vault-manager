
import React from 'react';
import { FileText, Download, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Report } from '@/contexts/ReportContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type ReportCardProps = {
  report: Report;
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'financial':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'sales':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'operations':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'hr':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'marketing':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const { currentUser } = useAuth();
  const canAccess = report.accessRoles.includes(currentUser?.role || 'user');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleDownload = () => {
    if (canAccess) {
      // In a real app, this would trigger an actual file download
      toast.success(`Downloading "${report.title}"...`);
    } else {
      toast.error("You don't have permission to download this report");
    }
  };

  return (
    <Card className="h-full flex flex-col report-card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-1">
          <Badge className={getCategoryColor(report.category)} variant="outline">
            {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
          </Badge>
          
          {!canAccess && (
            <Badge variant="outline" className="bg-gray-100 text-gray-500">
              <Users size={14} className="mr-1" />
              Restricted
            </Badge>
          )}
        </div>
        <CardTitle className="flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          {report.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-muted-foreground">{report.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar size={14} className="mr-1" />
          Updated {formatDate(report.updatedAt)}
        </div>
        <Button 
          size="sm" 
          className={canAccess ? "" : "opacity-50 cursor-not-allowed"}
          disabled={!canAccess}
          onClick={handleDownload}
          variant={canAccess ? "default" : "outline"}
        >
          <Download size={16} className="mr-1" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
