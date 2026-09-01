import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarX } from 'lucide-react';
import BookingCard from '../../components/customer/BookingCard.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ConfirmationModal from '../../components/common/ConfirmationModal.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { useToast } from '../../context/ToastContext.jsx';
import { seedBookings } from '../../data/bookings.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const STATUS_FILTERS = ['All', 'Confirmed', 'Pending', 'Cancelled'];

export default function MyBookings() {
  useDocumentTitle('My Bookings');
  const [bookings, setBookings] = useLocalStorage('tw_bookings', seedBookings);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [cancelId, setCancelId] = useState(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    return (bookings || []).filter((b) => {
      const matchesQuery = `${b.destination} ${b.packageName} ${b.id}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'All' || b.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [bookings, query, status]);

  const confirmCancel = () => {
    setBookings((prev) => prev.map((b) => (b.id === cancelId ? { ...b, status: 'Cancelled' } : b)));
    showToast('Booking cancelled.', 'info');
    setCancelId(null);
  };

  return (
    <div className="page">
      <div className="page-hero-plain">
        <div className="container">
          <h1>My Bookings</h1>
          <p>Manage and review all your Travel Wise trips.</p>
        </div>
      </div>

      <div className="container section-tight">
        <div className="flex" style={{ gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <SearchBar value={query} onChange={setQuery} placeholder="Search by destination, package, or booking ID…" className="grow-search" />
          <div className="flex" style={{ gap: 8 }}>
            {STATUS_FILTERS.map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-outline'}`}>{s}</button>
            ))}
          </div>
        </div>

        {filtered.length ? (
          <div className="flex-col" style={{ gap: 18 }}>
            {filtered.map((b) => (
              <BookingCard key={b.id} booking={b} onCancel={(id) => setCancelId(id)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarX}
            title="No bookings found"
            message="You haven't booked a trip yet, or none match your filters."
            action={<Link to="/customer/packages" className="btn btn-primary">Browse Packages</Link>}
          />
        )}
      </div>

      <ConfirmationModal
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={confirmCancel}
        title="Cancel this booking?"
        message="This will mark your booking as cancelled. This action can't be undone in this demo."
        confirmLabel="Cancel Booking"
        danger
      />

      <style>{`.grow-search { flex: 1; min-width: 220px; }`}</style>
    </div>
  );
}
