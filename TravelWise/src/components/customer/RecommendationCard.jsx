import { Sparkles, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';

export default function RecommendationCard({ suggestion, onApply, applied }) {
  return (
    <div
      className="card card-pad"
      style={{
        borderColor: applied ? 'var(--color-teal)' : 'var(--color-border-soft)',
        background: applied ? 'var(--color-teal-tint)' : '#fff',
      }}
    >
      <div className="flex" style={{ gap: 10, marginBottom: 10 }}>
        <span style={{ color: 'var(--color-amber-dark)' }}>
          <Sparkles size={18} />
        </span>
        <h4 style={{ margin: 0 }}>{suggestion.title}</h4>
      </div>
      <p style={{ fontSize: '0.88rem', margin: '0 0 14px' }}>{suggestion.description}</p>
      <div className="flex-between">
        <span style={{ fontWeight: 700, color: 'var(--color-teal)' }}>Save {formatCurrency(suggestion.savings)}</span>
        <button
          className={`btn btn-sm ${applied ? 'btn-outline' : 'btn-accent'}`}
          onClick={() => onApply(suggestion)}
          disabled={applied}
        >
          {applied ? 'Applied' : 'Apply'} {!applied && <ArrowRight size={14} />}
        </button>
      </div>
    </div>
  );
}
