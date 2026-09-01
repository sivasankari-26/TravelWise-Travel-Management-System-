import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, Compass } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { isValidEmail, isValidPhone } from '../../utils/validators.js';
import { AuthStyles } from './CustomerLogin.jsx';

export default function CustomerRegister() {
  useDocumentTitle('Register');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { registerCustomer } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address.';
    if (!isValidPhone(form.phone)) errs.phone = 'Enter a valid 10-digit phone number.';
    if (!form.password || form.password.length < 4) errs.password = 'Password must be at least 4 characters.';
    if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords do not match.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setTimeout(() => {
      registerCustomer(form);
      setLoading(false);
      showToast('Account created successfully!', 'success');
      navigate('/customer/home');
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="flex" style={{ gap: 8, marginBottom: 28 }}>
          <Compass size={26} color="var(--color-blue)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>Travel Wise</span>
        </Link>
        <h2 style={{ marginBottom: 6 }}>Create your account</h2>
        <p style={{ marginBottom: 28 }}>Join Travel Wise to start planning your trips.</p>

        <form onSubmit={handleSubmit} noValidate>
          <Input label="Full name" id="name" icon={User} placeholder="Jane Doe" value={form.name} error={errors.name} onChange={update('name')} />
          <Input label="Email address" id="email" type="email" icon={Mail} placeholder="you@example.com" value={form.email} error={errors.email} onChange={update('email')} />
          <Input label="Phone number" id="phone" icon={Phone} placeholder="9876543210" value={form.phone} error={errors.phone} onChange={update('phone')} />

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon"><Lock size={17} /></span>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                className={`input has-icon ${errors.password ? 'error' : ''}`}
                placeholder="Create a password"
                value={form.password}
                onChange={update('password')}
              />
              <button type="button" className="input-suffix-btn" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password visibility">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <Input
            label="Confirm password"
            id="confirmPassword"
            type={showPw ? 'text' : 'password'}
            icon={Lock}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            error={errors.confirmPassword}
            onChange={update('confirmPassword')}
          />

          <Button type="submit" variant="primary" block loading={loading}>Create Account</Button>
        </form>

        <p className="text-center" style={{ marginTop: 24, fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-blue)', fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
      <AuthStyles />
    </div>
  );
}
