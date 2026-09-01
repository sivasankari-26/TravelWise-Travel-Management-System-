import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Compass, CheckCircle2 } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { isValidEmail } from '../../utils/validators.js';
import { AuthStyles } from './CustomerLogin.jsx';

export default function ForgotPassword() {
  useDocumentTitle('Forgot Password');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="flex" style={{ gap: 8, marginBottom: 28 }}>
          <Compass size={26} color="var(--color-blue)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>Travel Wise</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div style={{ color: 'var(--color-teal)', marginBottom: 16 }}>
              <CheckCircle2 size={48} />
            </div>
            <h2 style={{ marginBottom: 10 }}>Check your inbox</h2>
            <p style={{ marginBottom: 24 }}>
              If an account exists for <strong>{email}</strong>, a password reset link has been sent (simulated).
            </p>
            <Link to="/login" className="btn btn-primary btn-block">Back to Login</Link>
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: 6 }}>Forgot your password?</h2>
            <p style={{ marginBottom: 28 }}>Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="Email address"
                id="email"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={email}
                error={error}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" variant="primary" block loading={loading}>Send Reset Link</Button>
            </form>
            <p className="text-center" style={{ marginTop: 24, fontSize: '0.9rem' }}>
              <Link to="/login" style={{ color: 'var(--color-blue)', fontWeight: 600 }}>Back to Login</Link>
            </p>
          </>
        )}
      </div>
      <AuthStyles />
    </div>
  );
}
