import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Lazy load pages for code splitting
import { lazy } from 'react';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const FileListPage = lazy(() => import('../pages/FileListPage'));
const FileDetailPage = lazy(() => import('../pages/FileDetailPage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const UserManagementPage = lazy(() => import('../pages/admin/UserManagementPage'));
const PolicySettingsPage = lazy(() => import('../pages/admin/PolicySettingsPage'));
const JobMonitoringPage = lazy(() => import('../pages/admin/JobMonitoringPage'));
const AuditLogPage = lazy(() => import('../pages/admin/AuditLogPage'));

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <FileListPage />,
      },
      {
        path: 'files/:fileId',
        element: <FileDetailPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'users',
        element: <UserManagementPage />,
      },
      {
        path: 'policies',
        element: <PolicySettingsPage />,
      },
      {
        path: 'jobs',
        element: <JobMonitoringPage />,
      },
      {
        path: 'audit',
        element: <AuditLogPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
