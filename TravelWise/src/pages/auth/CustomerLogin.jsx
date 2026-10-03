// src/pages/auth/CustomerLogin.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Compass } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { isValidEmail } from '../../utils/validators.js';

export default function CustomerLogin() {
  useDocumentTitle('Login');
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginCustomer, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const googleBtnRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password || form.password.length < 4) errs.password = 'Password must be at least 4 characters.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setTimeout(() => {
      const result = loginCustomer(form.email, form.password);
      setLoading(false);
      if (result.success) {
        showToast('Welcome back!', 'success');
        navigate(location.state?.from?.pathname || '/customer/home');
      } else {
        showToast(result.message, 'error');
      }
    }, 500);
  };

  // Called by Google once the user picks an account in the popup.
  const handleGoogleResponse = async (response) => {
    const result = await loginWithGoogle(response.credential);
    if (result.success) {
      showToast('Welcome back!', 'success');
      navigate(location.state?.from?.pathname || '/customer/home');
    } else {
      showToast(result.message, 'error');
    }
  };

  useEffect(() => {
    if (!window.google || !googleBtnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: 'outline',
      size: 'large',
      width: '100%',
      text: 'signin_with',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="flex" style={{ gap: 8, marginBottom: 28 }}>
          <Compass size={26} color="var(--color-blue)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>Travel Wise</span>
        </Link>
        <h2 style={{ marginBottom: 6 }}>Welcome back</h2>
        <p style={{ marginBottom: 28 }}>Log in to continue planning your next trip.</p>

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Email address"
            id="email"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon"><Lock size={17} /></span>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                className={`input has-icon ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" className="input-suffix-btn" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password visibility">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <div className="flex-between" style={{ marginBottom: 24 }}>
            <label className="checkbox-row">
              <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
              Remember me
            </label>
            <Link to="/forgot-password" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-blue)' }}>
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" block loading={loading}>Log In</Button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center' }} />

        <p className="text-center" style={{ marginTop: 24, fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-blue)', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
      <AuthStyles />
    </div>
  );
}

export function AuthStyles() {
  return (
    <style>{`
      .auth-page {
        min-height: 100vh; display: flex; align-items: center; justify-content: center;
        background: linear-gradient(160deg, var(--color-ink) 0%, #16324a 100%);
        padding: 24px;
      }
      .auth-card {
        background: #fff; border-radius: var(--radius-lg); padding: 44px;
        width: 100%; max-width: 440px; box-shadow: var(--shadow-lg);
      }
      @media (max-width: 480px) { .auth-card { padding: 30px 24px; } }

      .auth-divider {
        display: flex; align-items: center; text-align: center;
        color: var(--color-ink, #16324a); opacity: 0.5;
        font-size: 0.82rem; margin: 20px 0;
      }
      .auth-divider::before, .auth-divider::after {
        content: ''; flex: 1; border-bottom: 1px solid #e2e8f0;
      }
      .auth-divider span { padding: 0 12px; }
    `}</style>
  );
}