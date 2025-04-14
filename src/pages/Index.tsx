
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReportProvider } from '@/contexts/ReportContext';
import Layout from './Layout';
import Dashboard from './Dashboard';
import ReportList from './ReportList';
import NotFound from './NotFound';
import ManageReports from './admin/ManageReports';
import ManageUsers from './admin/ManageUsers';
import Settings from './admin/Settings';

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <ReportProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="reports" element={<ReportList />} />
            <Route path="admin/reports" element={<ManageReports />} />
            <Route path="admin/users" element={<ManageUsers />} />
            <Route path="admin/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ReportProvider>
    </AuthProvider>
  );
};

export default Index;
