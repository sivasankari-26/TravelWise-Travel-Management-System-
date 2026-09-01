import { Link } from 'react-router-dom';
import { Compass, Globe, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-ink)', color: '#cbd5e1', paddingTop: 64 }}>
      <div className="container">
        <div className="grid grid-4" style={{ paddingBottom: 48, gap: 32 }}>
          <div>
            <div className="flex" style={{ gap: 8, marginBottom: 14, color: '#fff' }}>
              <Compass size={24} color="var(--color-amber)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>Travel Wise</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: 260 }}>
              Plan, customize and book trips across India — with transparent pricing at every step.
            </p>
            <div className="flex" style={{ gap: 12, marginTop: 16 }}>
              <a href="#top" aria-label="Social link" style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: 8, borderRadius: 8 }}>
                <Globe size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: 16 }}>Explore</h4>
            <ul className="flex-col" style={{ gap: 10, fontSize: '0.9rem' }}>
              <li><Link to="/customer/destinations">Destinations</Link></li>
              <li><Link to="/customer/packages">Travel Packages</Link></li>
              <li><Link to="/customer/customize-package">Customize a Trip</Link></li>
              <li><Link to="/customer/bookings">My Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: 16 }}>Company</h4>
            <ul className="flex-col" style={{ gap: 10, fontSize: '0.9rem' }}>
              <li><Link to="/">About Travel Wise</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/admin/login">Admin Login</Link></li>
              <li><Link to="/">Terms &amp; Privacy</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: 16 }}>Get in touch</h4>
            <ul className="flex-col" style={{ gap: 10, fontSize: '0.9rem' }}>
              <li className="flex" style={{ gap: 8 }}><Mail size={15} /> support@travelwise.example</li>
              <li className="flex" style={{ gap: 8 }}><Phone size={15} /> +91 98765 43210</li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 0', fontSize: '0.8rem', color: '#64748b' }}>
          © {new Date().getFullYear()} Travel Wise. Built as an academic frontend project — all bookings are simulated.
        </div>
      </div>
    </footer>
  );
}
