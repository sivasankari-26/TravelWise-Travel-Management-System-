import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import DataTable from '../../components/common/DataTable.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import ConfirmationModal from '../../components/common/ConfirmationModal.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { useToast } from '../../context/ToastContext.jsx';
import { destinations as seedDestinations } from '../../data/destinations.js';
import { formatCurrency } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const EMPTY_FORM = { name: '', state: '', startingPrice: '', rating: '', tagline: '' };

export default function AdminDestinations() {
  useDocumentTitle('Manage Destinations');
  const [items, setItems] = useLocalStorage('tw_admin_destinations', seedDestinations);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const filtered = useMemo(
    () => items.filter((d) => `${d.name} ${d.state}`.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (d) => { setEditing(d); setForm({ name: d.name, state: d.state, startingPrice: d.startingPrice, rating: d.rating, tagline: d.tagline }); setModalOpen(true); };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.state || !form.startingPrice) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (editing) {
      setItems((prev) => prev.map((d) => (d.id === editing.id ? { ...d, ...form, startingPrice: Number(form.startingPrice), rating: Number(form.rating) || d.rating } : d)));
      showToast('Destination updated successfully.', 'success');
    } else {
      const newItem = {
        id: `d-${Date.now()}`,
        name: form.name, state: form.state, tagline: form.tagline,
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop'],
        description: form.tagline || 'A new destination on Travel Wise.',
        startingPrice: Number(form.startingPrice), rating: Number(form.rating) || 4.5, reviews: 0,
        tags: ['New'], highlights: [], activities: [],
      };
      setItems((prev) => [newItem, ...prev]);
      showToast('Destination added successfully.', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    setItems((prev) => prev.filter((d) => d.id !== deleteId));
    showToast('Destination deleted.', 'info');
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <SearchBar value={query} onChange={setQuery} placeholder="Search destinations…" className="grow-search" />
        <Button variant="primary" icon={Plus} onClick={openAdd}>Add Destination</Button>
      </div>

      <div className="card card-pad">
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'state', label: 'State' },
            { key: 'startingPrice', label: 'Starting Price', render: (r) => formatCurrency(r.startingPrice) },
            { key: 'rating', label: 'Rating', render: (r) => <span className="flex stars" style={{ gap: 4 }}><Star size={13} fill="currentColor" /> {r.rating}</span> },
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
          emptyMessage="No destinations match your search."
        />
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Destination' : 'Add Destination'}>
        <form onSubmit={handleSave}>
          <Input label="Destination name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          <div className="grid grid-2">
            <Input label="Starting price (₹)" type="number" value={form.startingPrice} onChange={(e) => setForm({ ...form, startingPrice: e.target.value })} />
            <Input label="Rating (out of 5)" type="number" step="0.1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          </div>
          <div className="flex" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{editing ? 'Save Changes' : 'Add Destination'}</Button>
          </div>
        </form>
      </AdminModal>

      <ConfirmationModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete destination?"
        message="This will remove the destination from Travel Wise. This action can't be undone."
        confirmLabel="Delete"
        danger
      />

      <style>{`.grow-search { flex: 1; min-width: 220px; }`}</style>
    </div>
  );
}
