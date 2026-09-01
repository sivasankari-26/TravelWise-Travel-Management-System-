import { Plane, Train, Bus, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';

const ICONS = { Flight: Plane, Train: Train, Bus: Bus };

export default function TransportCard({ type, price, selected, onSelect }) {
  const Icon = ICONS[type] || Bus;
  return (
    <button
      onClick={() => onSelect(type)}
      className="card"
      style={{
        padding: 20, textAlign: 'center', cursor: 'pointer', width: '100%',
        borderColor: selected ? 'var(--color-blue)' : 'var(--color-border-soft)',
        borderWidth: selected ? 2 : 1,
        background: selected ? 'var(--color-blue-tint)' : '#fff',
        position: 'relative',
      }}
    >
      {selected && (
        <span style={{ position: 'absolute', top: 10, right: 10, color: 'var(--color-blue)' }}>
          <Check size={16} />
        </span>
      )}
      <Icon size={28} color="var(--color-blue)" style={{ margin: '0 auto 10px' }} />
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{type}</div>
      <div className="muted" style={{ fontSize: '0.82rem' }}>from {formatCurrency(price)}</div>
    </button>
  );
}
