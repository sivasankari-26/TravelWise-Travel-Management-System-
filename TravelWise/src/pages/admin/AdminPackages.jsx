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
import { packages as seedPackages } from '../../data/packages.js';
import { destinations } from '../../data/destinations.js';
import { formatCurrency } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const EMPTY_FORM = { name: '', destinationId: destinations[0].id, transport: 'Flight', hotelStars: 4, duration: 5, price: '', category: 'Luxury' };

export default function AdminPackages() {
  useDocumentTitle('Manage Packages');
  const [items, setItems] = useLocalStorage('tw_admin_packages', seedPackages);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const destName = (id) => destinations.find((d) => d.id === id)?.name || id;

  const filtered = useMemo(
    () => items.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, destinationId: p.destinationId, transport: p.transport, hotelStars: p.hotelStars, duration: p.duration, price: p.price, category: p.category }); setModalOpen(true); };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (editing) {
      setItems((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form, price: Number(form.price), duration: Number(form.duration), hotelStars: Number(form.hotelStars) } : p)));
      showToast('Package updated successfully.', 'success');
    } else {
      const newItem = {
        id: `pkg-${Date.now()}`, ...form, price: Number(form.price), duration: Number(form.duration), hotelStars: Number(form.hotelStars),
        image: destinations.find((d) => d.id === form.destinationId)?.image, rating: 4.5,
        description: 'A newly added Travel Wise package.', included: [], excluded: [], itinerary: [],
      };
      setItems((prev) => [newItem, ...prev]);
      showToast('Package added successfully.', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    setItems((prev) => prev.filter((p) => p.id !== deleteId));
    showToast('Package deleted.', 'info');
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <SearchBar value={query} onChange={setQuery} placeholder="Search packages…" className="grow-search" />
        <Button variant="primary" icon={Plus} onClick={openAdd}>Add Package</Button>
      </div>

      <div className="card card-pad">
        <DataTable
          columns={[
            { key: 'name', label: 'Package' },
            { key: 'destinationId', label: 'Destination', render: (r) => destName(r.destinationId) },
            { key: 'duration', label: 'Duration', render: (r) => `${r.duration} Days` },
            { key: 'category', label: 'Category' },
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
          emptyMessage="No packages match your search."
        />
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Package' : 'Add Package'} size="lg">
        <form onSubmit={handleSave}>
          <Input label="Package name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-2">
            <Input label="Destination" as="select" value={form.destinationId} onChange={(e) => setForm({ ...form, destinationId: e.target.value })}>
              {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Input>
            <Input label="Category" as="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Luxury</option><option>Budget</option><option>Adventure</option><option>Heritage</option>
            </Input>
          </div>
          <div className="grid grid-3">
            <Input label="Transport" as="select" value={form.transport} onChange={(e) => setForm({ ...form, transport: e.target.value })}>
              <option>Flight</option><option>Train</option><option>Bus</option>
            </Input>
            <Input label="Hotel stars" as="select" value={form.hotelStars} onChange={(e) => setForm({ ...form, hotelStars: e.target.value })}>
              {[3, 4, 5].map((s) => <option key={s} value={s}>{s}★</option>)}
            </Input>
            <Input label="Duration (days)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <div className="flex" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{editing ? 'Save Changes' : 'Add Package'}</Button>
          </div>
        </form>
      </AdminModal>

      <ConfirmationModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete package?"
        message="This will remove the package from Travel Wise. This action can't be undone."
        confirmLabel="Delete"
        danger
      />

      <style>{`.grow-search { flex: 1; min-width: 220px; }`}</style>
    </div>
  );
}
