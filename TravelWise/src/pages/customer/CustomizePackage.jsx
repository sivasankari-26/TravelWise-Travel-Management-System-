import { useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { destinations, getDestinationById } from '../../data/destinations.js';
import { getHotelsByDestination } from '../../data/hotels.js';
import { transportBasePrices } from '../../data/transport.js';
import StepIndicator from '../../components/customer/StepIndicator.jsx';
import TransportCard from '../../components/customer/TransportCard.jsx';
import HotelCard from '../../components/customer/HotelCard.jsx';
import TravelBudgetCard from '../../components/customer/TravelBudgetCard.jsx';
import RecommendationCard from '../../components/customer/RecommendationCard.jsx';
import Button from '../../components/common/Button.jsx';
import { formatCurrency } from '../../utils/format.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const STEPS = ['Destination', 'Transport', 'Hotel', 'Duration', 'Activities', 'Summary'];
const DURATIONS = [3, 5, 7];
const ACTIVITIES = [
  { name: 'Water Sports', price: 1500 },
  { name: 'Sightseeing', price: 800 },
  { name: 'Adventure', price: 2000 },
  { name: 'Cultural Experience', price: 1000 },
  { name: 'Local Food Experience', price: 700 },
];
const OTHER_CHARGES = 2000;

export default function CustomizePackage() {
  useDocumentTitle('Customize Package');
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [destinationId, setDestinationId] = useState(location.state?.destinationId || destinations[0].id);
  const [transport, setTransport] = useState('Flight');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [duration, setDuration] = useState(5);
  const [activities, setActivities] = useState(['Sightseeing']);
  const [budget, setBudget] = useState(20000);
  const [appliedSuggestions, setAppliedSuggestions] = useState([]);

  const destination = getDestinationById(destinationId);
  const hotels = getHotelsByDestination(destinationId);

  const activeHotel = selectedHotel || hotels[1] || hotels[0];

  const transportCost = transportBasePrices[transport] || 5000;
  const hotelCost = (activeHotel?.pricePerNight || 3000) * duration;
  const activitiesCost = activities.reduce((sum, a) => sum + (ACTIVITIES.find((x) => x.name === a)?.price || 0), 0);
  const totalCost = transportCost + hotelCost + activitiesCost + OTHER_CHARGES;

  const toggleActivity = (name) => {
    setActivities((prev) => (prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]));
  };

  const suggestions = useMemo(() => {
    const opts = [];
    if (transport === 'Flight') {
      opts.push({ id: 'transport', title: 'Switch to Train', description: 'Swap flights for train travel on this route.', savings: transportBasePrices.Flight - transportBasePrices.Train, action: () => setTransport('Train') });
    }
    if (activeHotel && activeHotel.stars > 3) {
      const cheaper = hotels.find((h) => h.stars === activeHotel.stars - 1);
      if (cheaper) {
        opts.push({ id: 'hotel', title: 'Change Hotel Tier', description: `Move to ${cheaper.name} (${cheaper.stars}★).`, savings: (activeHotel.pricePerNight - cheaper.pricePerNight) * duration, action: () => setSelectedHotel(cheaper) });
      }
    }
    if (duration > 3) {
      opts.push({ id: 'duration', title: 'Reduce Duration', description: `Shorten your trip to ${duration - 2} days.`, savings: (activeHotel?.pricePerNight || 3000) * 2, action: () => setDuration(duration - 2) });
    }
    return opts;
  }, [transport, activeHotel, hotels, duration]);

  const applySuggestion = (s) => {
    s.action();
    setAppliedSuggestions((prev) => [...prev, s.id]);
  };

  const goNext = () => setStep((s) => Math.min(STEPS.length, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const handleContinue = () => {
    const customPkg = {
      id: `custom-${destinationId}-${Date.now()}`,
      name: `Custom ${destination.name} Trip`,
      image: destination.image,
      transport,
      hotelStars: activeHotel?.stars,
      duration,
      price: totalCost,
      category: 'Custom',
      description: `A custom-built trip to ${destination.name} with ${transport.toLowerCase()} travel, a ${activeHotel?.stars}★ stay, and ${activities.length} selected activities.`,
      included: [`${transport} travel`, `${activeHotel?.stars}★ hotel (${activeHotel?.name})`, ...activities],
      excluded: ['Personal expenses', 'Travel insurance'],
      itinerary: [{ day: 1, title: 'Arrival', description: `Arrive in ${destination.name} and check in.` }],
    };
    navigate('/customer/booking', { state: { pkg: customPkg, destination } });
  };

  return (
    <div className="page">
      <div className="page-hero-plain">
        <div className="container">
          <h1>Customize Your Trip</h1>
          <p>Build a package around your budget — Travel Wise will help you optimize as you go.</p>
        </div>
      </div>

      <div className="container section-tight">
        <StepIndicator steps={STEPS} current={step} />

        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: 20 }}>Choose a destination</h3>
            <div className="grid grid-4">
              {destinations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDestinationId(d.id)}
                  className="card"
                  style={{
                    padding: 0, overflow: 'hidden', textAlign: 'left', cursor: 'pointer',
                    borderColor: destinationId === d.id ? 'var(--color-blue)' : 'var(--color-border-soft)',
                    borderWidth: destinationId === d.id ? 2 : 1,
                  }}
                >
                  <img src={d.image} alt={d.name} style={{ width: '100%', height: 110, objectFit: 'cover' }} />
                  <div style={{ padding: 12 }}>
                    <strong style={{ fontSize: '0.9rem' }}>{d.name}</strong>
                    <div className="muted" style={{ fontSize: '0.78rem' }}>{d.state}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: 20 }}>Choose transport</h3>
            <div className="grid grid-3">
              {Object.entries(transportBasePrices).map(([type, price]) => (
                <TransportCard key={type} type={type} price={price} selected={transport === type} onSelect={setTransport} />
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: 20 }}>Choose your hotel</h3>
            <div className="grid grid-3">
              {hotels.map((h) => (
                <HotelCard key={h.id} hotel={h} selected={activeHotel?.id === h.id} onSelect={setSelectedHotel} />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ marginBottom: 20 }}>Choose trip duration</h3>
            <div className="grid grid-3">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className="card card-pad text-center"
                  style={{
                    cursor: 'pointer',
                    borderColor: duration === d ? 'var(--color-blue)' : 'var(--color-border-soft)',
                    borderWidth: duration === d ? 2 : 1,
                    background: duration === d ? 'var(--color-blue-tint)' : '#fff',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700 }}>{d}</div>
                  <div className="muted" style={{ fontSize: '0.85rem' }}>Days</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 style={{ marginBottom: 20 }}>Choose activities</h3>
            <div className="grid grid-3">
              {ACTIVITIES.map((a) => (
                <button
                  key={a.name}
                  onClick={() => toggleActivity(a.name)}
                  className="card card-pad"
                  style={{
                    cursor: 'pointer', textAlign: 'left',
                    borderColor: activities.includes(a.name) ? 'var(--color-blue)' : 'var(--color-border-soft)',
                    borderWidth: activities.includes(a.name) ? 2 : 1,
                    background: activities.includes(a.name) ? 'var(--color-blue-tint)' : '#fff',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>{a.name}</div>
                  <div className="muted" style={{ fontSize: '0.82rem' }}>+{formatCurrency(a.price)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
            <div>
              <h3 style={{ marginBottom: 20 }}>Price Summary</h3>
              <div className="card card-pad" style={{ marginBottom: 24 }}>
                <div className="flex-col" style={{ gap: 12 }}>
                  <div className="flex-between"><span className="muted">Destination</span><strong>{destination.name}</strong></div>
                  <div className="flex-between"><span className="muted">Transport ({transport})</span><strong>{formatCurrency(transportCost)}</strong></div>
                  <div className="flex-between"><span className="muted">Hotel ({activeHotel?.stars}★ × {duration} nights)</span><strong>{formatCurrency(hotelCost)}</strong></div>
                  <div className="flex-between"><span className="muted">Activities</span><strong>{formatCurrency(activitiesCost)}</strong></div>
                  <div className="flex-between"><span className="muted">Other charges</span><strong>{formatCurrency(OTHER_CHARGES)}</strong></div>
                  <div style={{ borderTop: '1px solid var(--color-border)', margin: '4px 0' }} />
                  <div className="flex-between" style={{ fontSize: '1.15rem' }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-amber-dark)' }}>{formatCurrency(totalCost)}</span>
                  </div>
                </div>
              </div>

              <h3 className="flex" style={{ gap: 8, marginBottom: 16 }}>
                <Sparkles size={20} color="var(--color-amber-dark)" /> Smart Travel Advisor
              </h3>
              <div className="field" style={{ maxWidth: 260, marginBottom: 16 }}>
                <label>Your budget</label>
                <input type="number" className="input" value={budget} onChange={(e) => setBudget(Number(e.target.value) || 0)} />
              </div>
              <TravelBudgetCard budget={budget} selectedCost={totalCost} />

              {totalCost > budget && suggestions.length > 0 && (
                <div className="grid grid-2" style={{ marginTop: 20 }}>
                  {suggestions.map((s) => (
                    <RecommendationCard key={s.id} suggestion={s} applied={appliedSuggestions.includes(s.id)} onApply={applySuggestion} />
                  ))}
                </div>
              )}
            </div>

            <aside>
              <div className="card card-pad" style={{ position: 'sticky', top: 100 }}>
                <h4 style={{ marginBottom: 14 }}>Ready to book?</h4>
                <p style={{ fontSize: '0.88rem', marginBottom: 20 }}>Review your selections, then continue to booking details.</p>
                <Button variant="primary" block onClick={handleContinue}>
                  Continue Booking <ArrowRight size={16} />
                </Button>
              </div>
            </aside>
          </div>
        )}

        <div className="flex-between" style={{ marginTop: 40, maxWidth: 700 }}>
          {step > 1 ? (
            <Button variant="outline" onClick={goBack}><ArrowLeft size={16} /> Back</Button>
          ) : <span />}
          {step < STEPS.length && (
            <Button variant="primary" onClick={goNext}>Next <ArrowRight size={16} /></Button>
          )}
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
