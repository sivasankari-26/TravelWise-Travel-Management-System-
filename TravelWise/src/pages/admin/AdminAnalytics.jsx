import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend,
} from 'recharts';
import { TrendingUp, IndianRupee, MapPin, Bus } from 'lucide-react';
import AnalyticsCard from '../../components/common/AnalyticsCard.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { seedBookings } from '../../data/bookings.js';
import { formatCurrency } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const COLORS = ['#2563eb', '#0d9488', '#f5a524', '#64748b', '#1e293b', '#94a3b8'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pad = (n) => String(n).padStart(2, '0');

function lastSixMonths() {
  const now = new Date();
  const out = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`,
      month: d.toLocaleString('en-US', { month: 'short' }),
      bookings: 0,
    });
  }
  return out;
}

// Month a booking was made: createdAt if present, otherwise the departure date.
function placedMonthKey(b) {
  const candidates = [b.createdAt, b.departureDate, b.travelDate];
  for (const c of candidates) {
    const raw = String(c || '');
    if (/^\d{4}-\d{2}/.test(raw)) return raw.slice(0, 7);
  }
  return null;
}

function departureMonthIndex(b) {
  const raw = String(b.departureDate || b.travelDate || '');
  if (!/^\d{4}-\d{2}/.test(raw)) return null;
  return Number(raw.slice(5, 7)) - 1;
}

function countBy(list, getKey) {
  const map = {};
  list.forEach((item) => {
    const key = getKey(item);
    if (!key) return;
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function EmptyNote({ text }) {
  return (
    <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="muted" style={{ fontSize: '0.9rem' }}>{text}</span>
    </div>
  );
}

export default function AdminAnalytics() {
  useDocumentTitle('Analytics');
  const [storedBookings] = useLocalStorage('tw_bookings', seedBookings);
  const bookings = storedBookings || [];

  const active = useMemo(() => bookings.filter((b) => b.status !== 'Cancelled'), [bookings]);
  const totalRevenue = active.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const monthly = useMemo(() => {
    const months = lastSixMonths();
    bookings.forEach((b) => {
      const slot = months.find((m) => m.key === placedMonthKey(b));
      if (slot) slot.bookings += 1;
    });
    return months;
  }, [bookings]);

  const destinationShare = useMemo(() => countBy(active, (b) => b.destination), [active]);

  const transportShare = useMemo(
    () => countBy(active, (b) => b.transport || b.transportMode || b.transportType),
    [active]
  );

  const season = useMemo(() => {
    const months = MONTH_NAMES.map((month) => ({ month, travellers: 0 }));
    active.forEach((b) => {
      const idx = departureMonthIndex(b);
      if (idx !== null && idx >= 0 && idx < 12) months[idx].travellers += Number(b.travelers) || 0;
    });
    return months;
  }, [active]);

  const hasSeasonData = season.some((m) => m.travellers > 0);
  const topDestination = destinationShare[0]?.name || '—';
  const topTransport = transportShare[0]?.name || '—';

  return (
    <div>
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <StatCard icon={TrendingUp} label="Total Bookings" value={bookings.length} accent="blue" />
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatCurrency(totalRevenue)} accent="teal" />
        <StatCard icon={MapPin} label="Most Booked" value={topDestination} accent="amber" />
        <StatCard icon={Bus} label="Popular Transport" value={topTransport} accent="blue" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 28, alignItems: 'start' }}>
        <AnalyticsCard title="Monthly Bookings" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Most Booked Destinations" subtitle="Share of active bookings (excluding cancelled)">
          {destinationShare.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={destinationShare} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={(e) => `${e.name}`}>
                  {destinationShare.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyNote text="No bookings yet." />
          )}
        </AnalyticsCard>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <AnalyticsCard title="Transport Preference" subtitle="Customer transport choice">
          {transportShare.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={transportShare} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                  {transportShare.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyNote text="No transport data yet." />
          )}
        </AnalyticsCard>

        <AnalyticsCard title="Peak Travel Season" subtitle="Travellers per departure month (excluding cancelled)">
          {hasSeasonData ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={season}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="travellers" stroke="#f5a524" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyNote text="No travel dates yet." />
          )}
        </AnalyticsCard>
      </div>
    </div>
  );
}