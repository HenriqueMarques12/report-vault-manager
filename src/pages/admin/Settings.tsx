
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Settings: React.FC = () => {
  const { isAdmin } = useAuth();

  // Redirect if not admin
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
            <p>Only administrators can access settings. Please contact an administrator if you need assistance.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage system settings and preferences.</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>System Information</span>
              <Badge>v1.0.0</Badge>
            </CardTitle>
            <CardDescription>General information about the system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">System Name</p>
                <p className="text-sm text-muted-foreground">Report Vault Manager</p>
              </div>
              <div>
                <p className="text-sm font-medium">Environment</p>
                <p className="text-sm text-muted-foreground">Production</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-sm text-muted-foreground">2024-04-12 08:30 UTC</p>
              </div>
              <div>
                <p className="text-sm font-medium">Database Status</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
            </div>

            <Separator />
            
            <div className="flex justify-end gap-2">
              <Button variant="outline">Run Backup</Button>
              <Button variant="outline">System Diagnostics</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
            <CardDescription>Configure default report behaviors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">Auto refresh reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh report data on a schedule
                  </p>
                </div>
                <Switch id="auto-refresh" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="versioning">Report versioning</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep version history for all reports
                  </p>
                </div>
                <Switch id="versioning" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="export-watermark">Add watermark to exports</Label>
                  <p className="text-sm text-muted-foreground">
                    Include a watermark on all exported reports
                  </p>
                </div>
                <Switch id="export-watermark" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="audit-logs">Enable audit logs</Label>
                  <p className="text-sm text-muted-foreground">
                    Track all report access and downloads
                  </p>
                </div>
                <Switch id="audit-logs" defaultChecked />
              </div>
            </div>

            <Separator />
            
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
