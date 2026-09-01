export function Loader({ label = 'Loading…' }) {
  return (
    <div className="loader-wrap flex-col" style={{ gap: 12 }}>
      <div className="spinner" />
      <span className="muted" style={{ fontSize: '0.85rem' }}>{label}</span>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card card-pad">
      <div className="skeleton" style={{ height: 160, marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 14, width: '40%' }} />
    </div>
  );
}

export default Loader;
