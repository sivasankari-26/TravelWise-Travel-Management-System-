import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { destinations } from '../../data/destinations.js';
import { packages } from '../../data/packages.js';
import DestinationCard from '../../components/customer/DestinationCard.jsx';
import PackageCard from '../../components/customer/PackageCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed.js';

export default function CustomerHome() {
  useDocumentTitle('Home');
  const { customer } = useAuth();
  const { items: recentItems, clearRecent } = useRecentlyViewed();
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
          background: 'linear-gradient(180deg, rgba(15,23,42,0.6), rgba(15,23,42,0.85)), url(/images/destinations/goa.jpg) center/cover',
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

      {recentItems.length > 0 && (
        <section className="section-tight">
          <div className="container">
            <div className="flex-between" style={{ marginBottom: 16 }}>
              <h3 className="flex" style={{ gap: 8, margin: 0 }}>
                <Clock size={20} color="var(--color-blue)" /> Recently viewed
              </h3>
              <button
                type="button"
                onClick={clearRecent}
                style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>
            <div className="flex" style={{ gap: 14, overflowX: 'auto', paddingBottom: 6 }}>
              {recentItems.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  to={item.path}
                  className="card"
                  style={{ minWidth: 200, maxWidth: 200, overflow: 'hidden', flexShrink: 0 }}
                >
                  {item.image && (
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: 110, objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: 12 }}>
                    <span className="badge badge-blue" style={{ marginBottom: 6 }}>
                      {item.type === 'package' ? 'Package' : 'Destination'}
                    </span>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
    </div>
  );
}