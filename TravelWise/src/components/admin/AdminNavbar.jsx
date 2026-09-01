import { Menu, LogOut, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminNavbar({ title, onMenuClick }) {
  const { admin, logoutAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    showToast('Admin session ended.', 'info');
    navigate('/admin/login');
  };

  return (
    <header
      className="flex-between"
      style={{
        height: 'var(--header-height)', padding: '0 24px', background: '#fff',
        borderBottom: '1px solid var(--color-border-soft)', position: 'sticky', top: 0, zIndex: 100,
      }}
    >
      <div className="flex" style={{ gap: 14 }}>
        <button className="admin-menu-btn btn-icon btn btn-ghost" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>
      <div className="flex" style={{ gap: 16 }}>
        <span className="flex badge badge-blue" style={{ gap: 6 }}>
          <ShieldCheck size={14} /> {admin?.name || 'Admin'}
        </span>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          <LogOut size={15} /> Logout
        </button>
      </div>
      <style>{`
        @media (min-width: 961px) { .admin-menu-btn { display: none; } }
      `}</style>
    </header>
  );
}
