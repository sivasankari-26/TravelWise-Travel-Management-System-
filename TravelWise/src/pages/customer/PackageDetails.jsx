import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, Hotel, Plane, Star } from 'lucide-react';
import { getPackageById, packages } from '../../data/packages.js';
import { getDestinationById } from '../../data/destinations.js';
import PackageCard from '../../components/customer/PackageCard.jsx';
import { formatCurrency } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pkg = getPackageById(id);
  const destination = pkg ? getDestinationById(pkg.destinationId) : null;
  const [tab, setTab] = useState('itinerary');
  const related = packages.filter((p) => p.id !== id).slice(0, 3);

  useDocumentTitle(pkg?.name || 'Package Details');

  if (!pkg) {
    return (
      <div className="container section text-center">
        <h2>Package not found</h2>
        <Link to="/customer/packages" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Packages</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ height: 320, position: 'relative' }}>
        <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.2), rgba(15,23,42,0.85))' }} />
        <div className="container" style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
          <button onClick={() => navigate(-1)} className="breadcrumb" style={{ background: 'none', border: 'none', color: '#e2e8f0' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1 style={{ color: '#fff', marginBottom: 6 }}>{pkg.name}</h1>
          <p className="flex" style={{ gap: 16, color: '#e2e8f0' }}>
            <span className="flex" style={{ gap: 5 }}><Star size={15} fill="currentColor" color="var(--color-amber)" /> {pkg.rating}</span>
            <span className="flex" style={{ gap: 5 }}><Clock size={15} /> {pkg.duration} Days</span>
            <span className="flex" style={{ gap: 5 }}><Hotel size={15} /> {pkg.hotelStars}★ Hotel</span>
            <span className="flex" style={{ gap: 5 }}><Plane size={15} /> {pkg.transport}</span>
          </p>
        </div>
      </div>

      <div className="container section-tight">
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 40 }}>
          <div>
            <p style={{ fontSize: '1rem' }}>{pkg.description}</p>

            <div className="flex" style={{ gap: 8, marginBottom: 24, borderBottom: '1px solid var(--color-border)' }}>
              {['itinerary', 'included', 'excluded'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="btn btn-ghost"
                  style={{
                    borderRadius: 0, borderBottom: tab === t ? '2.5px solid var(--color-blue)' : '2.5px solid transparent',
                    color: tab === t ? 'var(--color-blue)' : 'var(--color-slate)', textTransform: 'capitalize',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === 'itinerary' && (
              <div className="flex-col" style={{ gap: 0 }}>
                {pkg.itinerary.map((day, i) => (
                  <div key={day.day} className="flex" style={{ gap: 16, alignItems: 'flex-start' }}>
                    <div className="flex-col" style={{ alignItems: 'center', flexShrink: 0 }}>
                      <div
                        style={{
                          width: 34, height: 34, borderRadius: '50%', background: 'var(--color-blue)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem',
                        }}
                      >
                        {day.day}
                      </div>
                      {i !== pkg.itinerary.length - 1 && (
                        <div style={{ width: 2, flex: 1, minHeight: 40, background: 'var(--color-border)', margin: '4px 0' }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: 28 }}>
                      <h4 style={{ margin: '4px 0 6px' }}>{day.title}</h4>
                      <p style={{ margin: 0 }}>{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'included' && (
              <div className="flex-col" style={{ gap: 10 }}>
                {pkg.included.map((item) => (
                  <div key={item} className="flex" style={{ gap: 10 }}>
                    <Check size={18} color="var(--color-teal)" /> {item}
                  </div>
                ))}
              </div>
            )}

            {tab === 'excluded' && (
              <div className="flex-col" style={{ gap: 10 }}>
                {pkg.excluded.map((item) => (
                  <div key={item} className="flex" style={{ gap: 10 }}>
                    <X size={18} color="var(--color-red)" /> {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside>
            <div className="card card-pad" style={{ position: 'sticky', top: 100 }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Total price for this package</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-amber-dark)', marginBottom: 20 }}>
                {formatCurrency(pkg.price)}
              </div>
              <Link to="/customer/booking" state={{ pkg, destination }} className="btn btn-primary btn-block" style={{ marginBottom: 10 }}>
                Book Now
              </Link>
              <Link to="/customer/customize-package" state={{ destinationId: pkg.destinationId, basePackage: pkg }} className="btn btn-outline btn-block">
                Customize Package
              </Link>
            </div>
          </aside>
        </div>

        <div style={{ marginTop: 56 }}>
          <h3 style={{ marginBottom: 20 }}>Other packages you might like</h3>
          <div className="grid grid-3">
            {related.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .page .container .grid[style*="2fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
