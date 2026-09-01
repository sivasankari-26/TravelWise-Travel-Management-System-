const MAP = {
  Confirmed: 'badge-confirmed',
  Pending: 'badge-pending',
  Cancelled: 'badge-cancelled',
  Active: 'badge-confirmed',
  Inactive: 'badge-neutral',
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${MAP[status] || 'badge-neutral'}`}>{status}</span>;
}
