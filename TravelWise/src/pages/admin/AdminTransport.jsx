import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import ConfirmationModal from '../../components/common/ConfirmationModal.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { useToast } from '../../context/ToastContext.jsx';
import { transportOptions as seedTransport } from '../../data/transport.js';
import { formatCurrency } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const EMPTY_FORM = { type: 'Flight', from: '', to: '', price: '', duration: '' };

export default function AdminTransport() {
  useDocumentTitle('Manage Transport');
  const [items, setItems] = useLocalStorage('tw_admin_transport', seedTransport);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const filtered = useMemo(
    () => items.filter((t) => {
      const matchesQuery = `${t.from} ${t.to}`.toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === 'All' || t.type === typeFilter;
      return matchesQuery && matchesType;
    }),
    [items, query, typeFilter]
  );

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (t) => { setEditing(t); setForm({ type: t.type, from: t.from, to: t.to, price: t.price, duration: t.duration }); setModalOpen(true); };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.price) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (editing) {
      setItems((prev) => prev.map((t) => (t.id === editing.id ? { ...t, ...form, price: Number(form.price) } : t)));
      showToast('Transport option updated.', 'success');
    } else {
      setItems((prev) => [{ id: `t-${Date.now()}`, ...form, price: Number(form.price) }, ...prev]);
      showToast('Transport option added.', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    setItems((prev) => prev.filter((t) => t.id !== deleteId));
    showToast('Transport option deleted.', 'info');
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="flex" style={{ gap: 12, flex: 1, flexWrap: 'wrap' }}>
          <SearchBar value={query} onChange={setQuery} placeholder="Search by city…" className="grow-search" />
          <div className="flex" style={{ gap: 8 }}>
            {['All', 'Flight', 'Train', 'Bus'].map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)} className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-outline'}`}>{t}</button>
            ))}
          </div>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAdd}>Add Transport</Button>
      </div>

      <div className="card card-pad">
        <DataTable
          columns={[
            { key: 'type', label: 'Type' },
            { key: 'from', label: 'From' },
            { key: 'to', label: 'To' },
            { key: 'duration', label: 'Duration' },
            { key: 'price', label: 'Price', render: (r) => formatCurrency(r.price) },
            {
              key: 'actions', label: 'Actions', render: (r) => (
                <div className="flex" style={{ gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(r.id)}><Trash2 size={14} /></button>
                </div>
              ),
            },
          ]}
          rows={filtered}
          emptyMessage="No transport options match your filters."
        />
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Transport' : 'Add Transport'}>
        <form onSubmit={handleSave}>
          <Input label="Type" as="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>Flight</option><option>Train</option><option>Bus</option>
          </Input>
          <div className="grid grid-2">
            <Input label="From" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
            <Input label="To" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
          </div>
          <div className="grid grid-2">
            <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label="Duration" placeholder="e.g. 2h 30m" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div className="flex" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{editing ? 'Save Changes' : 'Add Transport'}</Button>
          </div>
        </form>
      </AdminModal>

      <ConfirmationModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete transport option?"
        message="This will remove the transport option. This action can't be undone."
        confirmLabel="Delete"
        danger
      />

      <style>{`.grow-search { flex: 1; min-width: 220px; }`}</style>
    </div>
  );
}
