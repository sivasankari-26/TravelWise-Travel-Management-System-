import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, LogOut, Heart } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const PREFERENCE_OPTIONS = ['Beach', 'Mountains', 'Heritage', 'Adventure', 'Relaxation'];

export default function Profile() {
  useDocumentTitle('My Profile');
  const { customer, updateCustomer, logoutCustomer } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: customer?.name || '', email: customer?.email || '', phone: customer?.phone || '' });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [preferences, setPreferences] = useLocalStorage('tw_preferences', ['Beach', 'Adventure']);

  const togglePref = (p) => {
    setPreferences((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateCustomer(form);
    showToast('Profile updated successfully.', 'success');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.next) {
      showToast('Fill in both password fields.', 'error');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setPwForm({ current: '', next: '', confirm: '' });
    showToast('Password changed successfully (simulated).', 'success');
  };

  const handleLogout = () => {
    logoutCustomer();
    navigate('/login');
  };

  return (
    <div className="page">
      <div className="page-hero-plain">
        <div className="container">
          <h1>My Profile</h1>
          <p>Manage your account details and travel preferences.</p>
        </div>
      </div>

      <div className="container section-tight">
        <div className="grid" style={{ gridTemplateColumns: '80px 1fr', gap: 20, alignItems: 'center', marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: 'var(--color-blue-tint)', color: 'var(--color-blue-dark)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700,
          }}>
            {customer?.name?.[0]?.toUpperCase() || <User />}
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{customer?.name}</h3>
            <p style={{ margin: 0 }}>{customer?.email}</p>
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: 24, alignItems: 'start' }}>
          <form onSubmit={handleSaveProfile} className="card card-pad">
            <h4 style={{ marginBottom: 18 }}>Profile Information</h4>
            <Input label="Full name" icon={User} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email address" icon={Mail} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone number" icon={Phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Button type="submit" variant="primary">Save Changes</Button>
          </form>

          <form onSubmit={handleChangePassword} className="card card-pad">
            <h4 style={{ marginBottom: 18 }}>Change Password</h4>
            <Input label="Current password" icon={Lock} type="password" value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} />
            <Input label="New password" icon={Lock} type="password" value={pwForm.next} onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} />
            <Input label="Confirm new password" icon={Lock} type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} />
            <Button type="submit" variant="outline">Update Password</Button>
          </form>
        </div>

        <div className="card card-pad" style={{ marginTop: 24 }}>
          <h4 className="flex" style={{ gap: 8, marginBottom: 16 }}><Heart size={18} color="var(--color-red)" /> Travel Preferences</h4>
          <div className="flex" style={{ gap: 10, flexWrap: 'wrap' }}>
            {PREFERENCE_OPTIONS.map((p) => (
              <button key={p} onClick={() => togglePref(p)} className={`btn btn-sm ${preferences.includes(p) ? 'btn-primary' : 'btn-outline'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center" style={{ marginTop: 32 }}>
          <Button variant="danger" onClick={handleLogout}><LogOut size={16} /> Logout</Button>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .page .container .grid[style*="80px 1fr"] { grid-template-columns: 60px 1fr !important; }
          .page .container .grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
