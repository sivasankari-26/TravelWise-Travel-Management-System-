import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function NotFound() {
  useDocumentTitle('Page Not Found');
  return (
    <div
      className="flex-col text-center"
      style={{ minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--color-ink)', color: '#fff' }}
    >
      <Compass size={56} color="var(--color-amber)" style={{ marginBottom: 20 }} />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 700, lineHeight: 1 }}>404</div>
      <h2 style={{ color: '#fff', margin: '10px 0 8px' }}>Looks like you've wandered off the map</h2>
      <p style={{ color: '#94a3b8', maxWidth: 420, marginBottom: 28 }}>
        The page you're looking for doesn't exist or may have moved. Let's get you back on route.
      </p>
      <Link to="/" className="btn btn-accent">
        <Home size={16} /> Back to Home
      </Link>
    </div>
  );
}
