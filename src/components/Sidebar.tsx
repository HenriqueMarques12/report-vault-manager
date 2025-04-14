
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  FileText, 
  Home, 
  Settings, 
  Users, 
  FolderOpen, 
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isCollapsed, isActive }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 p-3 rounded-lg transition-colors",
      isActive 
        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    )}
  >
    <div className="text-xl">{icon}</div>
    {!isCollapsed && <span>{label}</span>}
  </Link>
);

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { isAdmin, logout, currentUser } = useAuth();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside 
      className={cn(
        "bg-sidebar h-screen sticky top-0 transition-all duration-300 flex flex-col overflow-hidden border-r border-sidebar-border",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
          <FileText size={24} className="text-sidebar-foreground" />
          <h1 className="text-sidebar-foreground font-bold">Report Vault</h1>
        </div>
        <button 
          className="p-1 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
          onClick={toggleSidebar}
        >
          <ChevronLeft className={cn("transition-transform", isCollapsed && "rotate-180")} />
        </button>
      </div>
      
      <div className="flex flex-col gap-2 p-2 flex-1 overflow-auto">
        <SidebarLink 
          to="/" 
          icon={<Home />} 
          label="Dashboard" 
          isCollapsed={isCollapsed} 
          isActive={location.pathname === '/'}
        />
        <SidebarLink 
          to="/reports" 
          icon={<FolderOpen />} 
          label="Reports" 
          isCollapsed={isCollapsed}
          isActive={location.pathname.startsWith('/reports')}
        />
        {isAdmin && (
          <>
            <div className={cn("mt-2 mb-1 px-3 text-xs text-sidebar-foreground/50", isCollapsed && "hidden")}>
              Admin
            </div>
            <SidebarLink 
              to="/admin/reports" 
              icon={<FileText />} 
              label="Manage Reports" 
              isCollapsed={isCollapsed} 
              isActive={location.pathname.startsWith('/admin/reports')}
            />
            <SidebarLink 
              to="/admin/users" 
              icon={<Users />} 
              label="Users" 
              isCollapsed={isCollapsed}
              isActive={location.pathname.startsWith('/admin/users')}
            />
            <SidebarLink 
              to="/admin/settings" 
              icon={<Settings />} 
              label="Settings" 
              isCollapsed={isCollapsed}
              isActive={location.pathname.startsWith('/admin/settings')}
            />
          </>
        )}
      </div>

      <div className="p-2 border-t border-sidebar-border">
        {!isCollapsed && (
          <div className="px-3 py-2 text-sm text-sidebar-foreground">
            <div className="font-medium">{currentUser?.name}</div>
            <div className="opacity-75">{currentUser?.email}</div>
          </div>
        )}
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
