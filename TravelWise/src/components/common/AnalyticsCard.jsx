export default function AnalyticsCard({ title, subtitle, action, children }) {
  return (
    <div className="card card-pad">
      <div className="flex-between" style={{ marginBottom: 20, alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ marginBottom: subtitle ? 4 : 0 }}>{title}</h4>
          {subtitle && <p style={{ margin: 0, fontSize: '0.85rem' }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
