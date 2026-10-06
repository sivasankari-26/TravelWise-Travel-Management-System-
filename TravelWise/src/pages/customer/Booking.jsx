import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatCurrency } from '../../utils/format.js';
import { isValidEmail, isValidPhone, validateRequired } from '../../utils/validators.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

// Date helpers. Dates are handled as "YYYY-MM-DD" text to avoid timezone surprises.
const toISO = (dt) =>
  `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

const todayISO = () => toISO(new Date());

const addDays = (iso, days) => {
  const [y, m, d] = iso.split('-').map(Number);
  return toISO(new Date(y, m - 1, d + days));
};

const prettyDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function Booking() {
  useDocumentTitle('Booking');
  const location = useLocation();
  const navigate = useNavigate();
  const { customer } = useAuth();
  const { pkg, destination } = location.state || {};

  const [form, setForm] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: '',
    travelDate: '',
    travelers: 2,
    agree: false,
  });
  const [errors, setErrors] = useState({});

  if (!pkg) {
    return (
      <div className="container section text-center">
        <h2>No package selected</h2>
        <p>Choose a package first to continue with your booking.</p>
        <Link to="/customer/packages" className="btn btn-primary" style={{ marginTop: 12 }}>Browse Packages</Link>
      </div>
    );
  }

  const duration = Number(pkg.duration) || 1;
  // A package of N days starts on the travel date and ends N-1 days later.
  const returnDate = form.travelDate ? addDays(form.travelDate, duration - 1) : '';
  const totalAmount = pkg.price * (form.travelers || 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateRequired({ name: form.name, email: form.email, phone: form.phone, travelDate: form.travelDate });
    if (form.email && !isValidEmail(form.email)) errs.email = 'Enter a valid email address.';
    if (form.phone && !isValidPhone(form.phone)) errs.phone = 'Enter a valid 10-digit phone number.';
    if (form.travelDate && form.travelDate < todayISO()) errs.travelDate = 'Travel date cannot be in the past.';
    if (form.travelers < 1) errs.travelers = 'At least 1 traveler is required.';
    if (!form.agree) errs.agree = 'You must accept the terms to continue.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    navigate('/customer/payment', {
      state: {
        pkg,
        destination,
        booking: { ...form, returnDate, amount: totalAmount },
      },
    });
  };

  return (
    <div className="page">
      <div className="page-hero-plain">
        <div className="container">
          <button onClick={() => navigate(-1)} className="breadcrumb" style={{ background: 'none', border: 'none' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1>Complete Your Booking</h1>
          <p>{pkg.name}{destination ? ` — ${destination.name}` : ''}</p>
        </div>
      </div>

      <div className="container section-tight">
        <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="card card-pad" style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 18 }}>Traveler Information</h4>
              <Input label="Full name" id="name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Email address" id="email" type="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Phone number" id="phone" value={form.phone} error={errors.phone} placeholder="9876543210" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="card card-pad" style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 18 }}>Trip Details</h4>
              <div className="grid grid-2">
                <Input label="Departure date" id="travelDate" type="date" icon={Calendar} min={todayISO()} value={form.travelDate} error={errors.travelDate} onChange={(e) => setForm({ ...form, travelDate: e.target.value })} />
                <Input label="Number of travelers" id="travelers" type="number" min={1} max={10} icon={Users} value={form.travelers} error={errors.travelers} onChange={(e) => setForm({ ...form, travelers: Number(e.target.value) })} />
              </div>

              <div
                style={{
                  marginTop: 8, padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-blue-tint)', fontSize: '0.9rem',
                }}
              >
                {form.travelDate ? (
                  <>
                    <strong>Return date:</strong> {prettyDate(returnDate)}{' '}
                    <span className="muted">({duration}-day package)</span>
                  </>
                ) : (
                  <span className="muted">
                    Pick a departure date and your return date will be calculated from the {duration}-day package.
                  </span>
                )}
              </div>
            </div>

            <div className="card card-pad">
              <label className="checkbox-row" style={{ alignItems: 'flex-start' }}>
                <input type="checkbox" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} style={{ marginTop: 3 }} />
                I agree to Travel Wise's terms of service and cancellation policy.
              </label>
              {errors.agree && <div className="field-error">{errors.agree}</div>}
            </div>

            <Button type="submit" variant="primary" size="lg" block style={{ marginTop: 24 }}>Continue to Payment</Button>
          </form>

          <aside>
            <div className="card card-pad" style={{ position: 'sticky', top: 100 }}>
              <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: 16 }} />
              <h4 style={{ marginBottom: 10 }}>{pkg.name}</h4>
              {destination && <p className="flex muted" style={{ gap: 6, fontSize: '0.85rem', marginBottom: 14 }}><MapPin size={14} /> {destination.name}</p>}
              <div className="flex-col" style={{ gap: 8, fontSize: '0.9rem', marginBottom: 16 }}>
                <div className="flex-between"><span className="muted">Package price</span><span>{formatCurrency(pkg.price)}</span></div>
                <div className="flex-between"><span className="muted">Travelers</span><span>× {form.travelers || 1}</span></div>
                {form.travelDate && (
                  <>
                    <div className="flex-between"><span className="muted">Departure</span><span>{prettyDate(form.travelDate)}</span></div>
                    <div className="flex-between"><span className="muted">Return</span><span>{prettyDate(returnDate)}</span></div>
                  </>
                )}
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14 }} className="flex-between">
                <strong>Total</strong>
                <strong style={{ color: 'var(--color-amber-dark)', fontSize: '1.15rem' }}>{formatCurrency(totalAmount)}</strong>
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