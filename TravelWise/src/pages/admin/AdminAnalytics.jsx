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

const MONTHLY_BOOKINGS = [
  { month: 'Mar', bookings: 24 }, { month: 'Apr', bookings: 31 }, { month: 'May', bookings: 27 },
  { month: 'Jun', bookings: 38 }, { month: 'Jul', bookings: 35 }, { month: 'Aug', bookings: 44 },
];

const DESTINATION_SHARE = [
  { name: 'Goa', value: 28 }, { name: 'Kerala', value: 22 }, { name: 'Manali', value: 18 },
  { name: 'Ladakh', value: 14 }, { name: 'Jaipur', value: 10 }, { name: 'Others', value: 8 },
];
const COLORS = ['#2563eb', '#0d9488', '#f5a524', '#64748b', '#1e293b', '#94a3b8'];

const TRANSPORT_SHARE = [
  { name: 'Flight', value: 52 }, { name: 'Train', value: 28 }, { name: 'Bus', value: 20 },
];

const SEASON_DATA = [
  { month: 'Jan', travellers: 40 }, { month: 'Mar', travellers: 65 }, { month: 'May', travellers: 50 },
  { month: 'Jul', travellers: 42 }, { month: 'Sep', travellers: 58 }, { month: 'Nov', travellers: 88 },
];

export default function AdminAnalytics() {
  useDocumentTitle('Analytics');
  const [bookings] = useLocalStorage('tw_bookings', seedBookings);
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.status !== 'Cancelled' ? b.amount : 0), 0);

  return (
    <div>
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <StatCard icon={TrendingUp} label="Total Bookings" value={bookings.length} accent="blue" />
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatCurrency(totalRevenue)} accent="teal" />
        <StatCard icon={MapPin} label="Most Booked" value="Goa" accent="amber" />
        <StatCard icon={Bus} label="Popular Transport" value="Flight" accent="blue" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 28, alignItems: 'start' }}>
        <AnalyticsCard title="Monthly Bookings" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={MONTHLY_BOOKINGS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Most Booked Destinations" subtitle="Share of total bookings">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={DESTINATION_SHARE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={(e) => `${e.name}`}>
                {DESTINATION_SHARE.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <AnalyticsCard title="Transport Preference" subtitle="Customer transport choice">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={TRANSPORT_SHARE} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                {TRANSPORT_SHARE.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Peak Travel Season" subtitle="Traveller volume across the year">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={SEASON_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="travellers" stroke="#f5a524" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>
    </div>
  );
}
