import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import DataTable from '../../components/common/DataTable.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { seedCustomers } from '../../data/customers.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function AdminCustomers() {
  useDocumentTitle('Manage Customers');
  const [customers] = useLocalStorage('tw_admin_customers', seedCustomers);
  const [query, setQuery] = useState('');
  const [viewing, setViewing] = useState(null);

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
            { key: 'phone', label: 'Phone' },
            { key: 'bookingCount', label: 'Bookings' },
            { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            {
              key: 'actions', label: 'Actions', render: (r) => (
                <button className="btn btn-outline btn-sm" onClick={() => setViewing(r)}><Eye size={14} /> View</button>
              ),
            },
          ]}
          rows={filtered}
          emptyMessage="No customers match your search."
        />
      </div>

      <AdminModal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name} size="sm">
        {viewing && (
          <div className="flex-col" style={{ gap: 10, fontSize: '0.92rem' }}>
            <div className="flex-between"><span className="muted">Email</span><strong>{viewing.email}</strong></div>
            <div className="flex-between"><span className="muted">Phone</span><strong>{viewing.phone}</strong></div>
            <div className="flex-between"><span className="muted">Total Bookings</span><strong>{viewing.bookingCount}</strong></div>
            <div className="flex-between"><span className="muted">Status</span><StatusBadge status={viewing.status} /></div>
          </div>
        )}
      </AdminModal>

      <style>{`.grow-search { flex: 1; min-width: 220px; }`}</style>
    </div>
  );
}
