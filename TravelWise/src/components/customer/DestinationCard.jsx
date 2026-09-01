import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';

export default function DestinationCard({ destination }) {
  return (
    <div className="card card-hover" style={{ overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
        <img
          src={destination.image}
          alt={destination.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <span className="badge badge-blue" style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.92)' }}>
          {destination.tags?.[0]}
        </span>
      </div>
      <div className="card-pad">
        <div className="flex-between" style={{ marginBottom: 4 }}>
          <h4 style={{ margin: 0 }}>{destination.name}</h4>
          <span className="stars" style={{ fontSize: '0.85rem' }}>
            <Star size={14} fill="currentColor" /> {destination.rating}
          </span>
        </div>
        <p className="flex muted" style={{ gap: 5, fontSize: '0.85rem', margin: '0 0 10px' }}>
          <MapPin size={14} /> {destination.state}
        </p>
        <p style={{ fontSize: '0.88rem', margin: '0 0 16px' }}>{destination.tagline}</p>
        <div className="flex-between">
          <div>
            <span className="muted" style={{ fontSize: '0.75rem' }}>From</span>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-amber-dark)' }}>
              {formatCurrency(destination.startingPrice)}
            </div>
          </div>
          <Link to={`/customer/destinations/${destination.id}`} className="btn btn-outline btn-sm">
            View Details <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
