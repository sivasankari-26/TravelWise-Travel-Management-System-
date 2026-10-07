import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import DataTable from '../../components/common/DataTable.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { seedBookings } from '../../data/bookings.js';
import { formatCurrency } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function AdminCustomers() {
  useDocumentTitle('Manage Customers');
  const [storedBookings] = useLocalStorage('tw_bookings', seedBookings);
  const [query, setQuery] = useState('');
  const [viewing, setViewing] = useState(null);

  // Customers are built from real bookings: one row per customer who has booked.
  const customers = useMemo(() => {
    const map = {};
    (storedBookings || []).forEach((b) => {
      const key = b.customerEmail || b.customerName;
      if (!key) return;
      if (!map[key]) {
        map[key] = {
          id: key,
          name: b.customerName || '—',
          email: b.customerEmail || '—',
          bookingCount: 0,
          cancelledCount: 0,
          totalSpent: 0,
        };
      }
      map[key].bookingCount += 1;
      if (b.status === 'Cancelled') {
        map[key].cancelledCount += 1;
      } else {
        map[key].totalSpent += Number(b.amount) || 0;
      }
    });
    return Object.values(map).sort((a, b) => b.bookingCount - a.bookingCount);
  }, [storedBookings]);

  const filtered = useMemo(
    () => customers.filter((c) => `${c.name} ${c.email}`.toLowerCase().includes(query.toLowerCase())),
    [customers, query]
  );

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <SearchBar value={query} onChange={setQuery} placeholder="Search customers…" className="grow-search" />
      </div>

      <div className="card card-pad">
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'bookingCount', label: 'Bookings' },
            { key: 'totalSpent', label: 'Total Spent', render: (r) => formatCurrency(r.totalSpent) },
            {
              key: 'actions', label: 'Actions', render: (r) => (
                <button className="btn btn-outline btn-sm" onClick={() => setViewing(r)}><Eye size={14} /> View</button>
              ),
            },
          ]}
          rows={filtered}
          emptyMessage="No customers yet. Customers appear here after they make a booking."
        />
      </div>

      <AdminModal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name} size="sm">
        {viewing && (
          <div className="flex-col" style={{ gap: 10, fontSize: '0.92rem' }}>
            <div className="flex-between"><span className="muted">Email</span><strong>{viewing.email}</strong></div>
            <div className="flex-between"><span className="muted">Total Bookings</span><strong>{viewing.bookingCount}</strong></div>
            <div className="flex-between"><span className="muted">Cancelled</span><strong>{viewing.cancelledCount}</strong></div>
            <div className="flex-between"><span className="muted">Total Spent</span><strong>{formatCurrency(viewing.totalSpent)}</strong></div>
          </div>
        )}
      </AdminModal>

      <style>{`.grow-search { flex: 1; min-width: 220px; }`}</style>
    </div>
  );
}