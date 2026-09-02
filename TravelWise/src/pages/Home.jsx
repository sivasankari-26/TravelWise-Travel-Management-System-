import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass, Search, ShieldCheck, Sparkles, Wallet, HeadphonesIcon, Star, ArrowRight, MapPin,
} from 'lucide-react';
import { destinations } from '../data/destinations.js';
import { packages } from '../data/packages.js';
import { testimonials } from '../data/testimonials.js';
import DestinationCard from '../components/customer/DestinationCard.jsx';
import PackageCard from '../components/customer/PackageCard.jsx';
import Footer from '../components/common/Footer.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

function Reveal({ children, className = '' }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  useDocumentTitle('Explore Your Next Destination');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/customer/destinations${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <div>
      {/* Public top bar */}
      <header className="flex-between" style={{ padding: '20px 0', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}>
        <div className="container flex-between">
          <div className="flex" style={{ gap: 8, color: '#fff' }}>
            <Compass size={26} color="var(--color-amber)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem' }}>Travel Wise</span>
          </div>
          <div className="flex" style={{ gap: 12, alignItems: 'center' }}>
            <Link to="/admin/login" style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}>
              Admin
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-sm">Log In</Link>
            <Link to="/register" className="btn btn-accent btn-sm">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          position: 'relative', minHeight: '640px', display: 'flex', alignItems: 'center',
          background: 'linear-gradient(180deg, rgba(15,23,42,0.55), rgba(15,23,42,0.82)), url(https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1600&auto=format&fit=crop) center/cover',
          color: '#fff', padding: '140px 0 80px',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: 640 }}>
            <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
              <Sparkles size={13} /> Trusted by 12,000+ travellers
            </span>
            <h1 style={{ color: '#fff', marginBottom: 18 }}>Travel Wise — Explore Your Next Destination</h1>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: 32, maxWidth: 520 }}>
              Discover curated destinations, customize every detail of your trip, and book with a price you set from the start.
            </p>

            <form onSubmit={handleSearch} className="card" style={{ padding: 8, display: 'flex', gap: 8, maxWidth: 520 }}>
              <div className="input-wrap" style={{ flex: 1 }}>
                <span className="input-icon"><Search size={17} /></span>
                <input
                  className="input has-icon"
                  style={{ border: 'none' }}
                  placeholder="Search destinations — try 'Goa' or 'Ladakh'"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">Search</button>
            </form>

            {/* Signature route-line motif */}
            <div className="flex" style={{ gap: 10, marginTop: 40, color: '#e2e8f0', fontSize: '0.85rem' }}>
              <span>Mumbai</span>
              <span className="route-dots" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1.5px, transparent 1.5px)', width: 90 }} />
              <MapPin size={16} color="var(--color-amber)" />
              <span className="route-dots" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1.5px, transparent 1.5px)', width: 90 }} />
              <span>Anywhere you choose</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="eyebrow">Popular Destinations</span>
              <h2>Where travellers are headed this season</h2>
            </div>
          </Reveal>
          <div className="grid grid-4">
            {destinations.slice(0, 4).map((d) => (
              <Reveal key={d.id}><DestinationCard destination={d} /></Reveal>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 36 }}>
            <Link to="/customer/destinations" className="btn btn-outline">
              View All Destinations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured packages */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="eyebrow">Featured Packages</span>
              <h2>Complete trips, priced upfront</h2>
            </div>
          </Reveal>
          <div className="grid grid-3">
            {packages.slice(0, 3).map((p) => (
              <Reveal key={p.id}><PackageCard pkg={p} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head center">
              <span className="eyebrow">Why Travel Wise</span>
              <h2>Built to make trip planning painless</h2>
            </div>
          </Reveal>
          <div className="grid grid-4">
            {[
              { icon: Wallet, title: 'Transparent Pricing', text: 'See exactly what you pay for — no hidden fees, ever.' },
              { icon: Sparkles, title: 'Smart Travel Advisor', text: 'Get instant suggestions to fit your trip to your budget.' },
              { icon: ShieldCheck, title: 'Verified Partners', text: 'Hotels and transport vetted for quality and reliability.' },
              { icon: HeadphonesIcon, title: '24/7 Support', text: 'Help is always a message away, before and during your trip.' },
            ].map((f) => (
              <Reveal key={f.title}>
                <div className="card card-pad text-center">
                  <div style={{ color: 'var(--color-blue)', marginBottom: 14, display: 'flex', justifyContent: 'center' }}>
                    <f.icon size={28} />
                  </div>
                  <h4 style={{ marginBottom: 8 }}>{f.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Travel Advisor teaser */}
      <section className="section" style={{ background: 'var(--color-ink)', color: '#fff' }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: 48 }}>
            <Reveal>
              <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                <Sparkles size={13} /> Smart Travel Advisor
              </span>
              <h2 style={{ color: '#fff' }}>Over budget? We'll show you exactly where to trim.</h2>
              <p style={{ color: '#94a3b8', marginBottom: 24 }}>
                Set your budget while customizing any package, and Travel Wise instantly suggests swaps — a different
                hotel tier, transport mode, or trip length — each with the exact amount you'd save.
              </p>
              <Link to="/customer/customize-package" className="btn btn-accent">Try It Now</Link>
            </Reveal>
            <Reveal>
              <div className="card card-pad" style={{ background: '#fff' }}>
                <div className="flex-between" style={{ marginBottom: 16 }}>
                  <div>
                    <span className="muted" style={{ fontSize: '0.78rem' }}>Your Budget</span>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>₹20,000</div>
                  </div>
                  <div>
                    <span className="muted" style={{ fontSize: '0.78rem' }}>Selected Package</span>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-red)' }}>₹28,000</div>
                  </div>
                </div>
                <div className="flex-col" style={{ gap: 10 }}>
                  {[
                    ['Change Hotel', 5000],
                    ['Change Transport', 4000],
                    ['Reduce Duration', 3000],
                  ].map(([label, save]) => (
                    <div key={label} className="flex-between" style={{ background: 'var(--color-teal-tint)', padding: '10px 14px', borderRadius: 10 }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{label}</span>
                      <span style={{ color: 'var(--color-teal)', fontWeight: 700, fontSize: '0.85rem' }}>Save ₹{save.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <Reveal>
            <div className="section-head center">
              <span className="eyebrow">Traveller Stories</span>
              <h2>What Travel Wise customers are saying</h2>
            </div>
          </Reveal>
          <div className="grid grid-3">
            {testimonials.map((t) => (
              <Reveal key={t.id}>
                <div className="card card-pad">
                  <div className="stars" style={{ marginBottom: 12 }}>
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p style={{ fontStyle: 'italic', marginBottom: 16 }}>"{t.quote}"</p>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                  <div className="muted" style={{ fontSize: '0.8rem' }}>{t.trip}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight" style={{ background: 'var(--color-blue)', color: '#fff' }}>
        <div className="container text-center">
          <h2 style={{ color: '#fff', marginBottom: 12 }}>Ready to plan your next journey?</h2>
          <p style={{ color: '#dbeafe', marginBottom: 28 }}>Create a free account and start customizing your trip today.</p>
          <Link to="/register" className="btn btn-accent btn-lg">Get Started — It's Free</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}