import { Link } from 'react-router-dom';
import { Star, Clock, Hotel } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';

export default function PackageCard({ pkg }) {
  return (
    <div className="card card-hover" style={{ overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        <span className="badge badge-blue" style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.92)' }}>
          {pkg.category}
        </span>
      </div>
      <div className="card-pad">
        <div className="flex-between" style={{ marginBottom: 8 }}>
          <h4 style={{ margin: 0 }}>{pkg.name}</h4>
          <span className="stars" style={{ fontSize: '0.85rem' }}>
            <Star size={14} fill="currentColor" /> {pkg.rating}
          </span>
        </div>
        <div className="flex muted" style={{ gap: 16, fontSize: '0.82rem', marginBottom: 12 }}>
          <span className="flex" style={{ gap: 5 }}><Clock size={14} /> {pkg.duration} Days</span>
          <span className="flex" style={{ gap: 5 }}><Hotel size={14} /> {pkg.hotelStars}★ Hotel</span>
          <span>{pkg.transport}</span>
        </div>
        <div className="flex-between">
          <div>
            <span className="muted" style={{ fontSize: '0.75rem' }}>Starting from</span>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-amber-dark)' }}>
              {formatCurrency(pkg.price)}
            </div>
          </div>
          <Link to={`/customer/packages/${pkg.id}`} className="btn btn-primary btn-sm">View Details</Link>
        </div>
      </div>
    </div>
  );
}
