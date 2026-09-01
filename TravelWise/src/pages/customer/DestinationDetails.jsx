import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, ArrowLeft, Check } from 'lucide-react';
import { getDestinationById, destinations } from '../../data/destinations.js';
import { getPackagesByDestination } from '../../data/packages.js';
import { getHotelsByDestination } from '../../data/hotels.js';
import PackageCard from '../../components/customer/PackageCard.jsx';
import DestinationCard from '../../components/customer/DestinationCard.jsx';
import { formatCurrency } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const destination = getDestinationById(id);
  const relatedPackages = getPackagesByDestination(id);
  const hotels = getHotelsByDestination(id);
  const related = destinations.filter((d) => d.id !== id).slice(0, 3);
  const [activeImg, setActiveImg] = useState(0);

  useDocumentTitle(destination?.name || 'Destination');

  if (!destination) {
    return (
      <div className="container section text-center">
        <h2>Destination not found</h2>
        <Link to="/customer/destinations" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Destinations</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-hero-plain" style={{ paddingBottom: 0 }}>
        <div className="container">
          <button onClick={() => navigate(-1)} className="breadcrumb" style={{ background: 'none', border: 'none' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1 style={{ marginBottom: 6 }}>{destination.name}</h1>
          <p className="flex" style={{ gap: 16, color: '#cbd5e1', marginBottom: 24 }}>
            <span className="flex" style={{ gap: 5 }}><MapPin size={15} /> {destination.state}</span>
            <span className="flex stars" style={{ gap: 5 }}><Star size={15} fill="currentColor" /> {destination.rating} ({destination.reviews} reviews)</span>
          </p>
        </div>
      </div>

      <div className="container section-tight">
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 40 }}>
          <div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 12, height: 380 }}>
              <img src={destination.gallery[activeImg]} alt={destination.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="flex" style={{ gap: 10, marginBottom: 32 }}>
              {destination.gallery.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 80, height: 60, borderRadius: 10, overflow: 'hidden', padding: 0, border: activeImg === i ? '2.5px solid var(--color-blue)' : '2.5px solid transparent',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>

            <h3>About {destination.name}</h3>
            <p>{destination.description}</p>

            <h3 style={{ marginTop: 32 }}>Highlights</h3>
            <div className="grid grid-2" style={{ gap: 10 }}>
              {destination.highlights.map((h) => (
                <div key={h} className="flex" style={{ gap: 8, fontSize: '0.92rem' }}>
                  <Check size={16} color="var(--color-teal)" /> {h}
                </div>
              ))}
            </div>

            <h3 style={{ marginTop: 32 }}>Popular Activities</h3>
            <div className="flex" style={{ gap: 8, flexWrap: 'wrap' }}>
              {destination.activities.map((a) => <span key={a} className="badge badge-blue">{a}</span>)}
            </div>

            {hotels.length > 0 && (
              <>
                <h3 style={{ marginTop: 32 }}>Hotels in {destination.name}</h3>
                <div className="grid grid-3">
                  {hotels.slice(0, 3).map((h) => (
                    <div key={h.id} className="card card-pad">
                      <div className="flex" style={{ gap: 2, color: 'var(--color-amber)', marginBottom: 8 }}>
                        {Array.from({ length: h.stars }).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                      </div>
                      <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem' }}>{h.name}</h4>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatCurrency(h.pricePerNight)} <span className="muted" style={{ fontWeight: 400, fontSize: '0.78rem' }}>/night</span></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside>
            <div className="card card-pad" style={{ position: 'sticky', top: 100 }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Starting from</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-amber-dark)', marginBottom: 20 }}>
                {formatCurrency(destination.startingPrice)}
              </div>
              <Link to="/customer/customize-package" state={{ destinationId: destination.id }} className="btn btn-primary btn-block" style={{ marginBottom: 10 }}>
                Customize Trip
              </Link>
              {relatedPackages[0] && (
                <Link to={`/customer/packages/${relatedPackages[0].id}`} className="btn btn-outline btn-block">
                  View Ready-Made Package
                </Link>
              )}
            </div>
          </aside>
        </div>

        {relatedPackages.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <h3 style={{ marginBottom: 20 }}>Packages for {destination.name}</h3>
            <div className="grid grid-3">
              {relatedPackages.map((p) => <PackageCard key={p.id} pkg={p} />)}
            </div>
          </div>
        )}

        <div style={{ marginTop: 56 }}>
          <h3 style={{ marginBottom: 20 }}>You might also like</h3>
          <div className="grid grid-3">
            {related.map((d) => <DestinationCard key={d.id} destination={d} />)}
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
