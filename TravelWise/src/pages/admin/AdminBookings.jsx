import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import DataTable from '../../components/common/DataTable.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { useToast } from '../../context/ToastContext.jsx';
import { seedBookings } from '../../data/bookings.js';
import { formatCurrency, formatDate } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const STATUS_FILTERS = ['All', 'Confirmed', 'Pending', 'Cancelled'];

export default function AdminBookings() {
  useDocumentTitle('Manage Bookings');
  const [bookings, setBookings] = useLocalStorage('tw_bookings', seedBookings);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [viewing, setViewing] = useState(null);
  const { showToast } = useToast();

  const filtered = useMemo(
    () => bookings.filter((b) => {
      const matchesQuery = `${b.customerName} ${b.destination} ${b.id}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'All' || b.status === status;
      return matchesQuery && matchesStatus;
    }),
    [bookings, query, status]
  );

  const updateStatus = (id, newStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    showToast(`Booking marked as ${newStatus}.`, 'success');
    setViewing((v) => (v ? { ...v, status: newStatus } : v));
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <SearchBar value={query} onChange={setQuery} placeholder="Search by customer, destination, or ID…" className="grow-search" />
        <div className="flex" style={{ gap: 8 }}>
          {STATUS_FILTERS.map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-outline'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="card card-pad">
        <DataTable
          columns={[
            { key: 'id', label: 'Booking ID' },
            { key: 'customerName', label: 'Customer' },
            { key: 'destination', label: 'Destination' },
            { key: 'travelDate', label: 'Date', render: (r) => formatDate(r.travelDate) },
            { key: 'travelers', label: 'Travelers' },
            { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
            { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            {
              key: 'actions', label: 'Actions', render: (r) => (
                <button className="btn btn-outline btn-sm" onClick={() => setViewing(r)}><Eye size={14} /> View</button>
              ),
            },
          ]}
          rows={filtered}
          emptyMessage="No bookings match your search."
        />
      </div>

      <AdminModal open={!!viewing} onClose={() => setViewing(null)} title={`Booking ${viewing?.id || ''}`}>
        {viewing && (
          <div>
            <div className="flex-col" style={{ gap: 10, marginBottom: 20, fontSize: '0.92rem' }}>
              <div className="flex-between"><span className="muted">Customer</span><strong>{viewing.customerName}</strong></div>
              <div className="flex-between"><span className="muted">Email</span><strong>{viewing.customerEmail}</strong></div>
              <div className="flex-between"><span className="muted">Destination</span><strong>{viewing.destination}</strong></div>
              <div className="flex-between"><span className="muted">Package</span><strong>{viewing.packageName}</strong></div>
              <div className="flex-between"><span className="muted">Travel Date</span><strong>{formatDate(viewing.travelDate)}</strong></div>
              <div className="flex-between"><span className="muted">Travelers</span><strong>{viewing.travelers}</strong></div>
              <div className="flex-between"><span className="muted">Amount</span><strong>{formatCurrency(viewing.amount)}</strong></div>
              <div className="flex-between"><span className="muted">Status</span><StatusBadge status={viewing.status} /></div>
            </div>
            <Input label="Update status" as="select" value={viewing.status} onChange={(e) => updateStatus(viewing.id, e.target.value)}>
              <option>Confirmed</option><option>Pending</option><option>Cancelled</option>
            </Input>
            <Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>
          </div>
        )}
      </AdminModal>

      <style>{`.grow-search { flex: 1; min-width: 220px; }`}</style>
    </div>
  );
}
