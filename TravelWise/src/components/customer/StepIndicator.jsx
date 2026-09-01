import { Check } from 'lucide-react';

export default function StepIndicator({ steps, current }) {
  return (
    <div className="flex" style={{ width: '100%', marginBottom: 44 }}>
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <div key={label} className="flex" style={{ flex: i === steps.length - 1 ? '0 0 auto' : 1, alignItems: 'center' }}>
            <div className="flex-col" style={{ alignItems: 'center', gap: 8, minWidth: 56 }}>
              <div
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--color-teal)' : active ? 'var(--color-blue)' : '#fff',
                  color: done || active ? '#fff' : 'var(--color-slate-light)',
                  border: `2px solid ${done ? 'var(--color-teal)' : active ? 'var(--color-blue)' : 'var(--color-border)'}`,
                  fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                }}
              >
                {done ? <Check size={16} /> : stepNum}
              </div>
              <span
                style={{
                  fontSize: '0.75rem', fontWeight: 600, textAlign: 'center',
                  color: active ? 'var(--color-ink)' : 'var(--color-slate-light)',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </div>
            {i !== steps.length - 1 && <div className="route-dots" style={{ marginBottom: 20 }} />}
          </div>
        );
      })}
    </div>
  );
}
