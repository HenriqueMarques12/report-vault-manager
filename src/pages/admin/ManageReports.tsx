
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FilePlus, Pencil, Trash2, Users } from 'lucide-react';
import { useReports, Report } from '@/contexts/ReportContext';
import ReportForm from '@/components/ReportForm';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ManageReports: React.FC = () => {
  const { reports, addReport, updateReport, deleteReport } = useReports();
  const { isAdmin } = useAuth();
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Check if user has admin access
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Only administrators can manage reports. Please contact an administrator if you need assistance.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
    addReport(reportData);
    setIsAddDialogOpen(false);
    toast.success('Report created successfully!');
  };

  const handleUpdateReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingReport) {
      updateReport(editingReport.id, reportData);
      setEditingReport(null);
      setIsEditDialogOpen(false);
      toast.success('Report updated successfully!');
    }
  };

  const handleDelete = (reportId: string) => {
    setReportToDelete(reportId);
  };

  const confirmDelete = () => {
    if (reportToDelete) {
      deleteReport(reportToDelete);
      setReportToDelete(null);
      toast.success('Report deleted successfully!');
    }
  };

  const startEdit = (report: Report) => {
    setEditingReport(report);
    setIsEditDialogOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'sales': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'operations': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'hr': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'marketing': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Reports</h1>
          <p className="text-muted-foreground">Create, edit, and delete reports.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FilePlus className="mr-2 h-4 w-4" />
              Add Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Report</DialogTitle>
            </DialogHeader>
            <ReportForm onSubmit={handleAddReport} buttonText="Create Report" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {reports.map(report => (
          <Card key={report.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap gap-2 mb-1">
                <Badge className={getCategoryColor(report.category)} variant="outline">
                  {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users size={14} />
                  {report.accessRoles.includes('admin') && report.accessRoles.includes('user')
                    ? 'All Users'
                    : report.accessRoles.includes('admin')
                      ? 'Admins Only'
                      : 'Regular Users'}
                </Badge>
              </div>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription className="mt-1">{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="bg-muted p-3 rounded-md overflow-x-auto">
                <pre className="text-xs font-mono">{report.sqlQuery}</pre>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(report.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <Dialog open={isEditDialogOpen && editingReport?.id === report.id} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => startEdit(report)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only sm:ml-2">Edit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Report</DialogTitle>
                    </DialogHeader>
                    {editingReport && (
                      <ReportForm 
                        onSubmit={handleUpdateReport} 
                        initialValues={editingReport}
                        buttonText="Update Report" 
                      />
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button variant="destructive" size="sm" onClick={() => handleDelete(report.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-2">Delete</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}

        {reports.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No reports have been created yet. Click "Add Report" to create your first report.
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={!!reportToDelete} onOpenChange={(open) => !open && setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageReports;
