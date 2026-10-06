import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Lock } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { formatCurrency, generateBookingId } from '../../utils/format.js';
import { validateRequired } from '../../utils/validators.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

// Turns "2026-10-14" into "Tue, 14 Oct 2026".
const prettyDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function Payment() {
  useDocumentTitle('Payment');
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { pkg, destination, booking } = location.state || {};
  const [bookings, setBookings] = useLocalStorage('tw_bookings', null);

  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upi, setUpi] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!pkg || !booking) {
    return (
      <div className="container section text-center">
        <h2>Nothing to pay for yet</h2>
        <Link to="/customer/packages" className="btn btn-primary" style={{ marginTop: 12 }}>Browse Packages</Link>
      </div>
    );
  }

  const handlePay = (e) => {
    e.preventDefault();
    let errs = {};
    if (method === 'card') {
      errs = validateRequired({ number: card.number, name: card.name, expiry: card.expiry, cvv: card.cvv });
      if (card.number && card.number.replace(/\s/g, '').length < 12) errs.number = 'Enter a valid card number.';
      if (card.cvv && card.cvv.length < 3) errs.cvv = 'Enter a valid CVV.';
    } else {
      if (!upi || !upi.includes('@')) errs.upi = 'Enter a valid UPI ID (e.g. name@bank).';
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setTimeout(() => {
      const newBooking = {
        id: generateBookingId(),
        customerName: booking.name,
        customerEmail: booking.email,
        destination: destination?.name || pkg.name,
        packageName: pkg.name,
        travelDate: booking.travelDate,
        returnDate: booking.returnDate,
        travelers: booking.travelers,
        amount: booking.amount,
        status: 'Confirmed',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setBookings([...(bookings || []), newBooking]);
      setLoading(false);
      showToast('Payment successful!', 'success');
      navigate('/customer/booking-confirmation', { state: { booking: newBooking } });
    }, 900);
  };

  return (
    <div className="page">
      <div className="page-hero-plain">
        <div className="container">
          <button onClick={() => navigate(-1)} className="breadcrumb" style={{ background: 'none', border: 'none' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1>Payment</h1>
          <p>This is a simulated payment — no real transaction will occur.</p>
        </div>
      </div>

      <div className="container section-tight">
        <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
          <div>
            <div className="flex" style={{ gap: 12, marginBottom: 24 }}>
              <button className={`btn ${method === 'card' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setMethod('card')}>
                <CreditCard size={16} /> Card
              </button>
              <button className={`btn ${method === 'upi' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setMethod('upi')}>
                <Smartphone size={16} /> UPI
              </button>
            </div>

            <form onSubmit={handlePay} noValidate className="card card-pad">
              {method === 'card' ? (
                <>
                  <Input label="Card number" id="cardNumber" placeholder="1234 5678 9012 3456" value={card.number} error={errors.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
                  <Input label="Name on card" id="cardName" placeholder="Jane Doe" value={card.name} error={errors.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                  <div className="grid grid-2">
                    <Input label="Expiry (MM/YY)" id="expiry" placeholder="12/28" value={card.expiry} error={errors.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
                    <Input label="CVV" id="cvv" type="password" placeholder="123" value={card.cvv} error={errors.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
                  </div>
                </>
              ) : (
                <Input label="UPI ID" id="upi" placeholder="yourname@bank" value={upi} error={errors.upi} onChange={(e) => setUpi(e.target.value)} />
              )}
              <p className="flex muted" style={{ gap: 6, fontSize: '0.8rem', marginTop: 8 }}>
                <Lock size={13} /> Simulated payment for academic demonstration only.
              </p>
              <Button type="submit" variant="primary" size="lg" block loading={loading} style={{ marginTop: 16 }}>
                Pay {formatCurrency(booking.amount)}
              </Button>
            </form>
          </div>

          <aside>
            <div className="card card-pad" style={{ position: 'sticky', top: 100 }}>
              <h4 style={{ marginBottom: 14 }}>Order Summary</h4>
              <div className="flex-col" style={{ gap: 8, fontSize: '0.9rem', marginBottom: 16 }}>
                <div className="flex-between"><span className="muted">Package</span><span>{pkg.name}</span></div>
                <div className="flex-between"><span className="muted">Travelers</span><span>{booking.travelers}</span></div>
                <div className="flex-between"><span className="muted">Departure</span><span>{prettyDate(booking.travelDate)}</span></div>
                {booking.returnDate && (
                  <div className="flex-between"><span className="muted">Return</span><span>{prettyDate(booking.returnDate)}</span></div>
                )}
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14 }} className="flex-between">
                <strong>Total</strong>
                <strong style={{ color: 'var(--color-amber-dark)', fontSize: '1.15rem' }}>{formatCurrency(booking.amount)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .page .container .grid[style*="1.4fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}