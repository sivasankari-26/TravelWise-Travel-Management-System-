import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { IndianRupee, ClipboardList, Users, Package, MapPin, Plus } from 'lucide-react';
import StatCard from '../../components/common/StatCard.jsx';
import AnalyticsCard from '../../components/common/AnalyticsCard.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { seedBookings } from '../../data/bookings.js';
import { packages } from '../../data/packages.js';
import { formatCurrency, formatDate } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const pad = (n) => String(n).padStart(2, '0');

function lastSixMonths() {
  const now = new Date();
  const out = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`,
      month: d.toLocaleString('en-US', { month: 'short' }),
      revenue: 0,
      bookings: 0,
    });
  }
  return out;
}

// Month of a booking: use createdAt if present, otherwise the departure date.
function monthKey(b) {
  const candidates = [b.createdAt, b.departureDate, b.travelDate];
  for (const c of candidates) {
    const raw = String(c || '');
    if (/^\d{4}-\d{2}/.test(raw)) return raw.slice(0, 7);
  }
  return null;
}

export default function Dashboard() {
  useDocumentTitle('Admin Dashboard');
  const [storedBookings] = useLocalStorage('tw_bookings', seedBookings);
  const bookings = storedBookings || [];

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.status !== 'Cancelled' ? Number(b.amount) || 0 : 0),
    0
  );
  const customerCount = new Set(
    bookings.map((b) => b.customerEmail || b.customerName).filter(Boolean)
  ).size;
  const recent = [...bookings].slice(-5).reverse();

  const monthly = useMemo(() => {
    const months = lastSixMonths();
    bookings.forEach((b) => {
      const key = monthKey(b);
      const slot = months.find((m) => m.key === key);
      if (!slot) return;
      slot.bookings += 1;
      if (b.status !== 'Cancelled') slot.revenue += Number(b.amount) || 0;
    });
    return months;
  }, [bookings]);

  return (
    <div>
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <StatCard icon={ClipboardList} label="Total Bookings" value={bookings.length} accent="blue" />
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatCurrency(totalRevenue)} accent="teal" />
        <StatCard icon={Users} label="Customers Booked" value={customerCount} accent="amber" />
        <StatCard icon={Package} label="Total Packages" value={packages.length} accent="blue" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 28, alignItems: 'start' }}>
        <AnalyticsCard title="Revenue Overview" subtitle="Last 6 months (excluding cancelled)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Booking Trends" subtitle="Number of bookings per month">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#f5a524" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>

      <AnalyticsCard title="Quick Actions">
        <div className="flex" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Link to="/admin/destinations" className="btn btn-outline btn-sm"><Plus size={14} /> Add Destination</Link>
          <Link to="/admin/packages" className="btn btn-outline btn-sm"><Plus size={14} /> Add Package</Link>
          <Link to="/admin/hotels" className="btn btn-outline btn-sm"><Plus size={14} /> Add Hotel</Link>
          <Link to="/admin/bookings" className="btn btn-outline btn-sm"><ClipboardList size={14} /> View Bookings</Link>
        </div>
      </AnalyticsCard>

      <div style={{ marginTop: 28 }}>
        <AnalyticsCard
          title="Recent Bookings"
          subtitle="Most recently placed bookings"
          action={<Link to="/admin/bookings" className="btn btn-outline btn-sm">View All</Link>}
        >
          <DataTable
            columns={[
              { key: 'id', label: 'Booking ID' },
              { key: 'customerName', label: 'Customer' },
              { key: 'destination', label: 'Destination', render: (r) => <span className="flex" style={{ gap: 6 }}><MapPin size={14} /> {r.destination}</span> },
              {
                key: 'departureDate',
                label: 'Departure',
                render: (r) => {
                  const d = r.departureDate || r.travelDate;
                  return d ? formatDate(d) : '—';
                },
              },
              { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
              { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={recent}
            emptyMessage="No bookings yet."
          />
        </AnalyticsCard>
      </div>
    </div>
  );
}