import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, Star } from 'lucide-react';
import { destinations } from '../../data/destinations.js';
import { packages } from '../../data/packages.js';
import { testimonials } from '../../data/testimonials.js';
import DestinationCard from '../../components/customer/DestinationCard.jsx';
import PackageCard from '../../components/customer/PackageCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function CustomerHome() {
  useDocumentTitle('Home');
  const { customer } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/customer/destinations${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <div>
      <section
        style={{
          background: 'linear-gradient(180deg, rgba(15,23,42,0.6), rgba(15,23,42,0.85)), url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop) center/cover',
          color: '#fff', padding: '72px 0',
        }}
      >
        <div className="container">
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
            Welcome back, {customer?.name?.split(' ')[0] || 'Traveller'}
          </span>
          <h1 style={{ color: '#fff', marginBottom: 16, maxWidth: 600 }}>Where to next?</h1>
          <form onSubmit={handleSearch} className="card" style={{ padding: 8, display: 'flex', gap: 8, maxWidth: 520 }}>
            <div className="input-wrap" style={{ flex: 1 }}>
              <span className="input-icon"><Search size={17} /></span>
              <input
                className="input has-icon"
                style={{ border: 'none' }}
                placeholder="Search destinations…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Popular Destinations</span>
            <h2>Handpicked for this season</h2>
          </div>
          <div className="grid grid-4">
            {destinations.slice(0, 4).map((d) => <DestinationCard key={d.id} destination={d} />)}
          </div>
          <div className="text-center" style={{ marginTop: 32 }}>
            <Link to="/customer/destinations" className="btn btn-outline">
              Browse All Destinations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Featured Packages</span>
            <h2>Ready-made trips, priced upfront</h2>
          </div>
          <div className="grid grid-3">
            {packages.slice(0, 3).map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card card-pad" style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', background: 'var(--color-blue-tint)' }}>
            <div style={{ color: 'var(--color-blue)' }}><Sparkles size={36} /></div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h3 style={{ marginBottom: 6 }}>Not sure which package fits your budget?</h3>
              <p style={{ margin: 0 }}>Let the Smart Travel Advisor find the right combination for you.</p>
            </div>
            <Link to="/customer/customize-package" className="btn btn-primary">Customize a Trip</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Traveller Stories</span>
            <h2>Recent experiences</h2>
          </div>
          <div className="grid grid-3">
            {testimonials.map((t) => (
              <div key={t.id} className="card card-pad">
                <div className="stars" style={{ marginBottom: 12 }}>
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p style={{ fontStyle: 'italic', marginBottom: 16 }}>"{t.quote}"</p>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                <div className="muted" style={{ fontSize: '0.8rem' }}>{t.trip}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
