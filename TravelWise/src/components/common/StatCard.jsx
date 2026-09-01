export default function StatCard({ icon: Icon, label, value, trend, trendUp = true, accent = 'blue' }) {
  return (
    <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="flex-between">
        <span className="muted" style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          {label}
        </span>
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `var(--color-${accent}-tint, var(--color-blue-tint))`,
            color: `var(--color-${accent}, var(--color-blue))`,
          }}
        >
          <Icon size={18} />
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 700, color: 'var(--color-ink)' }}>
        {value}
      </div>
      {trend && (
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: trendUp ? 'var(--color-teal)' : 'var(--color-red)' }}>
          {trendUp ? '▲' : '▼'} {trend}
        </span>
      )}
    </div>
  );
}
