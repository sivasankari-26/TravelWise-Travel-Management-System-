import { formatCurrency } from '../../utils/format.js';

export default function TravelBudgetCard({ budget, selectedCost }) {
  const diff = selectedCost - budget;
  const overBudget = diff > 0;
  const pct = Math.min(100, Math.round((selectedCost / (budget || 1)) * 100));

  return (
    <div className="card card-pad">
      <div className="grid grid-2" style={{ marginBottom: 18 }}>
        <div>
          <span className="muted" style={{ fontSize: '0.8rem' }}>Your Budget</span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>
            {formatCurrency(budget)}
          </div>
        </div>
        <div>
          <span className="muted" style={{ fontSize: '0.8rem' }}>Selected Package</span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: overBudget ? 'var(--color-red)' : 'var(--color-teal)' }}>
            {formatCurrency(selectedCost)}
          </div>
        </div>
      </div>

      <div style={{ height: 10, background: 'var(--color-border-soft)', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: overBudget ? 'var(--color-red)' : 'var(--color-teal)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: overBudget ? 'var(--color-red)' : 'var(--color-teal)' }}>
        {overBudget
          ? `You are ${formatCurrency(diff)} over budget.`
          : `You are within budget, with ${formatCurrency(Math.abs(diff))} to spare.`}
      </p>
    </div>
  );
}
