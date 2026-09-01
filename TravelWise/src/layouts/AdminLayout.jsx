import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import AdminNavbar from '../components/admin/AdminNavbar.jsx';

const TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/destinations': 'Manage Destinations',
  '/admin/hotels': 'Manage Hotels',
  '/admin/transport': 'Manage Transport',
  '/admin/packages': 'Manage Packages',
  '/admin/bookings': 'Manage Bookings',
  '/admin/customers': 'Manage Customers',
  '/admin/analytics': 'Analytics',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] || 'Admin';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cloud)' }}>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-content">
        <AdminNavbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="container" style={{ padding: '28px 24px', maxWidth: '100%' }}>
          <Outlet />
        </main>
      </div>
      <style>{`
        .admin-content { margin-left: var(--admin-sidebar-width); }
        @media (max-width: 960px) { .admin-content { margin-left: 0; } }
      `}</style>
    </div>
  );
}
