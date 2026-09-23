import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, Menu, X, User, LogOut, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useTranslate } from '../../i18n/translations.js';

export default function CustomerNavbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { customer, logoutCustomer } = useAuth();
  const { showToast } = useToast();
  const { language } = useSettings();
  const t = useTranslate(language);
  const navigate = useNavigate();

  const LINKS = [
    { to: '/customer/home', label: t('navHome') },
    { to: '/customer/destinations', label: t('navDestinations') },
    { to: '/customer/packages', label: t('navPackages') },
    { to: '/customer/customize-package', label: t('navCustomize') },
    { to: '/customer/bookings', label: t('navBookings') },
  ];

  const handleLogout = () => {
    logoutCustomer();
    showToast('You have been logged out.', 'info');
    navigate('/login');
  };

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 200, background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--color-border-soft)',
        height: 'var(--header-height)',
      }}
    >
      <div className="container flex-between" style={{ height: '100%' }}>
        <Link to="/customer/home" className="flex" style={{ gap: 8 }}>
          <Compass size={26} color="var(--color-blue)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem' }}>Travel Wise</span>
        </Link>

        <div className="desktop-nav flex" style={{ gap: 28 }}>
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.93rem',
                color: isActive ? 'var(--color-blue)' : 'var(--color-ink-soft)',
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="desktop-actions flex" style={{ gap: 14, position: 'relative' }}>
          <button
            className="flex btn-ghost btn"
            style={{ gap: 8, padding: '9px 14px' }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              style={{
                width: 30, height: 30, borderRadius: '50%', background: 'var(--color-blue-tint)',
                color: 'var(--color-blue-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.8rem',
              }}
            >
              {customer?.name?.[0]?.toUpperCase() || <User size={14} />}
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{customer?.name || t('navAccount')}</span>
            <ChevronDown size={14} />
          </button>
          {menuOpen && (
            <div
              className="card"
              style={{ position: 'absolute', top: '110%', right: 0, minWidth: 180, padding: 8, zIndex: 50 }}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <Link to="/customer/profile" className="flex btn-ghost btn btn-block" style={{ justifyContent: 'flex-start', gap: 10 }} onClick={() => setMenuOpen(false)}>
                <User size={16} /> {t('navProfile')}
              </Link>
              <Link to="/customer/settings" className="flex btn-ghost btn btn-block" style={{ justifyContent: 'flex-start', gap: 10 }} onClick={() => setMenuOpen(false)}>
                <SettingsIcon size={16} /> {t('navSettings')}
              </Link>
              <button className="flex btn-ghost btn btn-block" style={{ justifyContent: 'flex-start', gap: 10 }} onClick={handleLogout}>
                <LogOut size={16} /> {t('navLogout')}
              </button>
            </div>
          )}
        </div>

        <button className="mobile-toggle btn-icon btn btn-ghost" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 300,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            className="flex-col"
            style={{
              position: 'absolute', top: 0, right: 0, height: '100%', width: '78%', maxWidth: 320,
              background: '#fff', padding: 24, gap: 6, boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between" style={{ marginBottom: 18 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Menu</span>
              <button className="btn-icon btn btn-ghost" onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                style={{ padding: '12px 8px', fontWeight: 600, borderBottom: '1px solid var(--color-border-soft)' }}
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/customer/profile" onClick={() => setOpen(false)} style={{ padding: '12px 8px', fontWeight: 600, borderBottom: '1px solid var(--color-border-soft)' }}>
              {t('navProfile')}
            </Link>
            <Link to="/customer/settings" onClick={() => setOpen(false)} style={{ padding: '12px 8px', fontWeight: 600, borderBottom: '1px solid var(--color-border-soft)' }}>
              {t('navSettings')}
            </Link>
            <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={handleLogout}>
              <LogOut size={16} /> {t('navLogout')}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 901px) {
          .mobile-toggle { display: none; }
        }
        @media (max-width: 900px) {
          .desktop-nav, .desktop-actions { display: none !important; }
        }
      `}</style>
    </header>
  );
}