import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { IndianRupee, ClipboardList, Users, Package, MapPin, Plus } from 'lucide-react';
import StatCard from '../../components/common/StatCard.jsx';
import AnalyticsCard from '../../components/common/AnalyticsCard.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { seedBookings } from '../../data/bookings.js';
import { seedCustomers } from '../../data/customers.js';
import { packages } from '../../data/packages.js';
import { formatCurrency, formatDate } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const REVENUE_TREND = [
  { month: 'Mar', revenue: 320000 },
  { month: 'Apr', revenue: 410000 },
  { month: 'May', revenue: 380000 },
  { month: 'Jun', revenue: 512000 },
  { month: 'Jul', revenue: 468000 },
  { month: 'Aug', revenue: 590000 },
];

const BOOKING_TRENDS = [
  { month: 'Mar', bookings: 24 },
  { month: 'Apr', bookings: 31 },
  { month: 'May', bookings: 27 },
  { month: 'Jun', bookings: 38 },
  { month: 'Jul', bookings: 35 },
  { month: 'Aug', bookings: 44 },
];

export default function Dashboard() {
  useDocumentTitle('Admin Dashboard');
  const [bookings] = useLocalStorage('tw_bookings', seedBookings);
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.status !== 'Cancelled' ? b.amount : 0), 0);
  const recent = [...bookings].slice(-5).reverse();

  return (
    <div>
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <StatCard icon={ClipboardList} label="Total Bookings" value={bookings.length} trend="8% vs last month" accent="blue" />
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatCurrency(totalRevenue)} trend="12% vs last month" accent="teal" />
        <StatCard icon={Users} label="Total Customers" value={seedCustomers.length} trend="4 new this week" accent="amber" />
        <StatCard icon={Package} label="Total Packages" value={packages.length} trend="2 added recently" accent="blue" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 28, alignItems: 'start' }}>
        <AnalyticsCard title="Revenue Overview" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={REVENUE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Booking Trends" subtitle="Number of bookings per month">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={BOOKING_TRENDS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#f5a524" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>

      <AnalyticsCard title="Quick Actions" >
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
              { key: 'travelDate', label: 'Travel Date', render: (r) => formatDate(r.travelDate) },
              { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
              { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={recent}
          />
        </AnalyticsCard>
      </div>
    </div>
  );
}
