import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format.js';
import StatusBadge from '../common/StatusBadge.jsx';

export default function BookingCard({ booking, onCancel }) {
  return (
    <div className="card card-pad">
      <div className="flex-between" style={{ marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <span className="muted" style={{ fontSize: '0.78rem' }}>Booking ID: {booking.id}</span>
          <h4 style={{ margin: '2px 0 0' }}>{booking.packageName}</h4>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="grid grid-3" style={{ gap: 14, marginBottom: 16 }}>
        <div className="flex" style={{ gap: 8, fontSize: '0.88rem' }}>
          <MapPin size={16} color="var(--color-blue)" /> {booking.destination}
        </div>
        <div className="flex" style={{ gap: 8, fontSize: '0.88rem' }}>
          <Calendar size={16} color="var(--color-blue)" /> {formatDate(booking.travelDate)}
        </div>
        <div className="flex" style={{ gap: 8, fontSize: '0.88rem' }}>
          <Users size={16} color="var(--color-blue)" /> {booking.travelers} Traveler{booking.travelers > 1 ? 's' : ''}
        </div>
      </div>
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>
          {formatCurrency(booking.amount)}
        </div>
        <div className="flex" style={{ gap: 10 }}>
          <Link to="/customer/booking-confirmation" state={{ booking }} className="btn btn-outline btn-sm">
            View Details
          </Link>
          {booking.status !== 'Cancelled' && onCancel && (
            <button className="btn btn-danger btn-sm" onClick={() => onCancel(booking.id)}>Cancel</button>
          )}
        </div>
      </div>
    </div>
  );
}
