
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useAuth, User, UserRole } from '@/contexts/AuthContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, UserCog } from 'lucide-react';

const ManageUsers: React.FC = () => {
  const { isAdmin, currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    },
    {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user',
    },
    {
      id: '3',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    },
    {
      id: '4',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
    },
    {
      id: '5',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'admin',
    },
  ]);

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
            <p>Only administrators can manage users. Please contact an administrator if you need assistance.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    // Don't allow changing your own role
    if (userId === currentUser?.id) {
      toast.error("You cannot change your own role");
      return;
    }

    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    
    toast.success("User role updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and their access permissions.</p>
        </div>
        
        <Button onClick={() => toast.info("User creation form would open here")}>
          <UserCog className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user access and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name}
                    {user.id === currentUser?.id && (
                      <Badge variant="outline" className="ml-2">You</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' && <Shield size={16} className="text-primary" />}
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                        disabled={user.id === currentUser?.id}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="user">Regular User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={user.id === currentUser?.id}
                      onClick={() => toast.info(`User details for ${user.name} would open here`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;
