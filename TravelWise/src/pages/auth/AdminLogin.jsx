import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, BarChart3, MapPin, ClipboardList, Compass } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { isValidEmail } from '../../utils/validators.js';

export default function AdminLogin() {
  useDocumentTitle('Admin Login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password || form.password.length < 4) errs.password = 'Password must be at least 4 characters.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setTimeout(() => {
      const result = loginAdmin(form.email, form.password);
      setLoading(false);
      if (result.success) {
        showToast('Welcome back, Admin.', 'success');
        navigate('/admin/dashboard');
      } else {
        showToast(result.message, 'error');
      }
    }, 500);
  };

  return (
    <div className="admin-login-shell">
      {/* Left: dashboard-style brand panel — distinctly "admin control room", not the travel-brochure look of customer auth */}
      <div className="admin-login-panel">
        <div className="flex" style={{ gap: 10, color: '#fff', marginBottom: 56 }}>
          <ShieldCheck size={26} color="var(--color-amber)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>Travel Wise <span style={{ color: '#94a3b8', fontWeight: 500 }}>Admin</span></span>
        </div>

        <h2 style={{ color: '#fff', maxWidth: 360, marginBottom: 14 }}>Run the platform from one dashboard.</h2>
        <p style={{ color: '#94a3b8', maxWidth: 340, marginBottom: 44 }}>
          Manage destinations, packages, bookings and customers — with live analytics on every decision.
        </p>

        <div className="flex-col" style={{ gap: 18 }}>
          {[
            { icon: BarChart3, label: 'Real-time revenue & booking analytics' },
            { icon: MapPin, label: 'Full control over destinations & packages' },
            { icon: ClipboardList, label: 'Booking status management at a glance' },
          ].map((f) => (
            <div key={f.label} className="flex" style={{ gap: 12, color: '#e2e8f0' }}>
              <span style={{ background: 'rgba(255,255,255,0.08)', padding: 9, borderRadius: 9, flexShrink: 0 }}>
                <f.icon size={16} color="var(--color-amber)" />
              </span>
              <span style={{ fontSize: '0.9rem' }}>{f.label}</span>
            </div>
          ))}
        </div>

        <Link to="/" className="flex" style={{ gap: 6, color: '#64748b', fontSize: '0.82rem', marginTop: 'auto', paddingTop: 56 }}>
          <Compass size={14} /> Back to Travel Wise
        </Link>
      </div>

      {/* Right: the actual sign-in form, on plain white — no card-on-dark-gradient like customer auth */}
      <div className="admin-login-form-side">
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ marginBottom: 6 }}>Admin Sign In</h2>
          <p style={{ marginBottom: 32 }}>Enter your credentials to access the admin panel.</p>

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Admin email"
              id="admin-email"
              type="email"
              icon={Mail}
              placeholder="admin@travelwise.example"
              value={form.email}
              error={errors.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Password"
              id="admin-password"
              type="password"
              icon={Lock}
              placeholder="Enter admin password"
              value={form.password}
              error={errors.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Button type="submit" variant="primary" block loading={loading}>Sign In to Admin Panel</Button>
          </form>

          <p className="muted" style={{ fontSize: '0.78rem', marginTop: 22 }}>
            Frontend simulation — use any email and a password of 4+ characters.
          </p>
        </div>
      </div>

      <style>{`
        .admin-login-shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .admin-login-panel {
          background: var(--color-ink);
          padding: 56px 56px 40px;
          display: flex;
          flex-direction: column;
        }
        .admin-login-form-side {
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }
        @media (max-width: 860px) {
          .admin-login-shell { grid-template-columns: 1fr; }
          .admin-login-panel { display: none; }
        }
      `}</style>
    </div>
  );
}
