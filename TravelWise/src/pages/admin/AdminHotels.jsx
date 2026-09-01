import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import ConfirmationModal from '../../components/common/ConfirmationModal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { useToast } from '../../context/ToastContext.jsx';
import { hotels as seedHotels } from '../../data/hotels.js';
import { destinations } from '../../data/destinations.js';
import { formatCurrency } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const EMPTY_FORM = { name: '', destinationId: destinations[0].id, stars: 3, pricePerNight: '', availability: 'Available' };

export default function AdminHotels() {
  useDocumentTitle('Manage Hotels');
  const [items, setItems] = useLocalStorage('tw_admin_hotels', seedHotels);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const destName = (id) => destinations.find((d) => d.id === id)?.name || id;

  const filtered = useMemo(
    () => items.filter((h) => `${h.name} ${destName(h.destinationId)}`.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (h) => { setEditing(h); setForm({ name: h.name, destinationId: h.destinationId, stars: h.stars, pricePerNight: h.pricePerNight, availability: h.availability }); setModalOpen(true); };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.pricePerNight) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (editing) {
      setItems((prev) => prev.map((h) => (h.id === editing.id ? { ...h, ...form, stars: Number(form.stars), pricePerNight: Number(form.pricePerNight) } : h)));
      showToast('Hotel updated successfully.', 'success');
    } else {
      setItems((prev) => [{ id: `h-${Date.now()}`, ...form, stars: Number(form.stars), pricePerNight: Number(form.pricePerNight) }, ...prev]);
      showToast('Hotel added successfully.', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    setItems((prev) => prev.filter((h) => h.id !== deleteId));
    showToast('Hotel deleted.', 'info');
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <SearchBar value={query} onChange={setQuery} placeholder="Search hotels…" className="grow-search" />
        <Button variant="primary" icon={Plus} onClick={openAdd}>Add Hotel</Button>
      </div>

      <div className="card card-pad">
        <DataTable
          columns={[
            { key: 'name', label: 'Hotel Name' },
            { key: 'destinationId', label: 'Destination', render: (r) => destName(r.destinationId) },
            { key: 'stars', label: 'Rating', render: (r) => `${r.stars}★` },
            { key: 'pricePerNight', label: 'Price / Night', render: (r) => formatCurrency(r.pricePerNight) },
            { key: 'availability', label: 'Availability', render: (r) => <StatusBadge status={r.availability === 'Available' ? 'Active' : 'Pending'} /> },
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
          emptyMessage="No hotels match your search."
        />
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Hotel' : 'Add Hotel'}>
        <form onSubmit={handleSave}>
          <Input label="Hotel name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Destination" as="select" value={form.destinationId} onChange={(e) => setForm({ ...form, destinationId: e.target.value })}>
            {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Input>
          <div className="grid grid-2">
            <Input label="Star rating" as="select" value={form.stars} onChange={(e) => setForm({ ...form, stars: e.target.value })}>
              {[3, 4, 5].map((s) => <option key={s} value={s}>{s}★</option>)}
            </Input>
            <Input label="Price per night (₹)" type="number" value={form.pricePerNight} onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })} />
          </div>
          <Input label="Availability" as="select" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
            <option>Available</option>
            <option>Limited</option>
            <option>Unavailable</option>
          </Input>
          <div className="flex" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{editing ? 'Save Changes' : 'Add Hotel'}</Button>
          </div>
        </form>
      </AdminModal>

      <ConfirmationModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete hotel?"
        message="This will remove the hotel listing. This action can't be undone."
        confirmLabel="Delete"
        danger
      />

      <style>{`.grow-search { flex: 1; min-width: 220px; }`}</style>
    </div>
  );
}
