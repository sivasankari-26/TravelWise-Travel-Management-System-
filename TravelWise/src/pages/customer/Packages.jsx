import { useMemo, useState } from 'react';
import { PackageX } from 'lucide-react';
import { packages } from '../../data/packages.js';
import PackageCard from '../../components/customer/PackageCard.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const CATEGORIES = ['All', 'Luxury', 'Budget', 'Adventure', 'Heritage'];
const PAGE_SIZE = 6;

export default function Packages() {
  useDocumentTitle('Travel Packages');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = packages.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      const matchesPrice = p.price <= maxPrice;
      return matchesQuery && matchesCategory && matchesPrice;
    });
    if (sort === 'price-low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'duration') list = [...list].sort((a, b) => a.duration - b.duration);
    return list;
  }, [query, category, maxPrice, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page">
      <div className="page-hero-plain">
        <div className="container">
          <h1>Travel Packages</h1>
          <p>Complete trips with hotel, transport and activities bundled in.</p>
        </div>
      </div>

      <div className="container section-tight">
        <div className="grid" style={{ gridTemplateColumns: '260px 1fr', gap: 32, alignItems: 'start' }}>
          <aside className="card card-pad filters-panel">
            <h4 style={{ marginBottom: 16 }}>Filters</h4>
            <SearchBar value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search packages…" />

            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 10 }}>Category</label>
              <div className="flex-col" style={{ gap: 8 }}>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setPage(1); }}
                    className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-outline'}`}
                    style={{ justifyContent: 'flex-start' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 10 }}>
                Max Price: ₹{maxPrice.toLocaleString('en-IN')}
              </label>
              <input
                type="range"
                min={9000}
                max={50000}
                step={1000}
                value={maxPrice}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
                style={{ width: '100%', accentColor: 'var(--color-blue)' }}
              />
            </div>
          </aside>

          <div>
            <div className="flex-between" style={{ marginBottom: 20 }}>
              <span className="muted" style={{ fontSize: '0.9rem' }}>{filtered.length} packages found</span>
              <select className="input" style={{ maxWidth: 200 }} value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="popular">Sort: Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="duration">Shortest First</option>
              </select>
            </div>

            {paged.length ? (
              <>
                <div className="grid grid-3">
                  {paged.map((p) => <PackageCard key={p.id} pkg={p} />)}
                </div>
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </>
            ) : (
              <EmptyState icon={PackageX} title="No packages match your filters" message="Try widening your price range or clearing filters." />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .page .container .grid[style*="260px 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
