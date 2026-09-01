import { Star, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';

export default function HotelCard({ hotel, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(hotel)}
      className="card"
      style={{
        padding: 18, textAlign: 'left', width: '100%', cursor: 'pointer',
        borderColor: selected ? 'var(--color-blue)' : 'var(--color-border-soft)',
        borderWidth: selected ? 2 : 1,
        background: selected ? 'var(--color-blue-tint)' : '#fff',
        position: 'relative',
      }}
    >
      {selected && (
        <span style={{ position: 'absolute', top: 12, right: 12, color: 'var(--color-blue)' }}>
          <Check size={18} />
        </span>
      )}
      <div className="flex" style={{ gap: 3, color: 'var(--color-amber)', marginBottom: 8 }}>
        {Array.from({ length: hotel.stars }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" />
        ))}
      </div>
      <h4 style={{ margin: '0 0 4px' }}>{hotel.name}</h4>
      <p className="muted" style={{ fontSize: '0.82rem', margin: '0 0 10px' }}>{hotel.availability}</p>
      <div style={{ fontWeight: 700 }}>{formatCurrency(hotel.pricePerNight)} <span className="muted" style={{ fontWeight: 400, fontSize: '0.8rem' }}>/ night</span></div>
    </button>
  );
}
