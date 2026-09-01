import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, MapPin, Hotel, Bus, Package, ClipboardList, Users, BarChart3, Compass, X,
} from 'lucide-react';

const LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/destinations', label: 'Destinations', icon: MapPin },
  { to: '/admin/hotels', label: 'Hotels', icon: Hotel },
  { to: '/admin/transport', label: 'Transport', icon: Bus },
  { to: '/admin/packages', label: 'Packages', icon: Package },
  { to: '/admin/bookings', label: 'Bookings', icon: ClipboardList },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      <aside className={`admin-sidebar ${open ? 'is-open' : ''}`}>
        <div className="flex-between" style={{ padding: '22px 20px', marginBottom: 8 }}>
          <div className="flex" style={{ gap: 8, color: '#fff' }}>
            <Compass size={22} color="var(--color-amber)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Travel Wise</span>
          </div>
          <button className="admin-sidebar-close btn-icon btn" style={{ color: '#fff' }} onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-col" style={{ gap: 2, padding: '0 12px' }}>
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && <div className="admin-sidebar-backdrop" onClick={onClose} />}

      <style>{`
        .admin-sidebar {
          position: fixed; top: 0; left: 0; height: 100vh; width: var(--admin-sidebar-width);
          background: var(--color-ink); z-index: 250; overflow-y: auto;
          transition: transform var(--t-med) var(--ease);
        }
        .admin-sidebar-close { display: none; }
        .admin-link {
          display: flex; align-items: center; gap: 12px; padding: 12px 14px;
          border-radius: 10px; color: #94a3b8; font-size: 0.9rem; font-weight: 500;
          transition: background var(--t-fast) var(--ease), color var(--t-fast) var(--ease);
        }
        .admin-link:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .admin-link.active { background: var(--color-blue); color: #fff; }
        .admin-sidebar-backdrop { display: none; }
        @media (max-width: 960px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.is-open { transform: translateX(0); box-shadow: var(--shadow-lg); }
          .admin-sidebar-close { display: flex; }
          .admin-sidebar-backdrop {
            display: block; position: fixed; inset: 0; background: rgba(15,23,42,0.5); z-index: 240;
          }
        }
      `}</style>
    </>
  );
}
