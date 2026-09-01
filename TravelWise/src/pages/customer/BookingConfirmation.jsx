import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, MapPin, Calendar, Users, Hash } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function BookingConfirmation() {
  useDocumentTitle('Booking Confirmed');
  const location = useLocation();
  const { booking } = location.state || {};

  if (!booking) return <Navigate to="/customer/bookings" replace />;

  return (
    <div className="page section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: 620 }}>
        <div className="card card-pad text-center" style={{ padding: 48 }}>
          <div style={{ color: 'var(--color-teal)', marginBottom: 18 }}>
            <CheckCircle2 size={56} />
          </div>
          <h2 style={{ marginBottom: 8 }}>Booking Confirmed!</h2>
          <p style={{ marginBottom: 28 }}>A confirmation has been sent to your email. We can't wait to see you there.</p>

          <div className="card card-pad" style={{ background: 'var(--color-cloud)', textAlign: 'left', marginBottom: 28 }}>
            <div className="flex-col" style={{ gap: 14 }}>
              <div className="flex-between"><span className="flex muted" style={{ gap: 8 }}><Hash size={16} /> Booking ID</span><strong>{booking.id}</strong></div>
              <div className="flex-between"><span className="flex muted" style={{ gap: 8 }}><MapPin size={16} /> Destination</span><strong>{booking.destination}</strong></div>
              <div className="flex-between"><span className="muted">Package</span><strong>{booking.packageName}</strong></div>
              <div className="flex-between"><span className="flex muted" style={{ gap: 8 }}><Calendar size={16} /> Travel Date</span><strong>{formatDate(booking.travelDate)}</strong></div>
              <div className="flex-between"><span className="flex muted" style={{ gap: 8 }}><Users size={16} /> Travelers</span><strong>{booking.travelers}</strong></div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }} className="flex-between">
                <strong>Total Paid</strong>
                <strong style={{ color: 'var(--color-amber-dark)', fontSize: '1.1rem' }}>{formatCurrency(booking.amount)}</strong>
              </div>
            </div>
          </div>

          <div className="flex" style={{ gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/customer/bookings" className="btn btn-primary">View My Booking</Link>
            <Link to="/customer/home" className="btn btn-outline">Go Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
