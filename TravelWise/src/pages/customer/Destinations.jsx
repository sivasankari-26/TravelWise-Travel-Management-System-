import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { destinations } from '../../data/destinations.js';
import DestinationCard from '../../components/customer/DestinationCard.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const TAGS = ['All', 'Beach', 'Mountains', 'Heritage', 'Adventure', 'Backwaters', 'Relaxation', 'Culture', 'Romantic', 'Nightlife', 'Popular'];
const PAGE_SIZE = 6;

export default function Destinations() {
  useDocumentTitle('Destinations');
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [tag, setTag] = useState('All');
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = destinations.filter((d) => {
      const matchesQuery = `${d.name} ${d.state}`.toLowerCase().includes(query.toLowerCase());
      const matchesTag = tag === 'All' || d.tags.includes(tag);
      return matchesQuery && matchesTag;
    });
    if (sort === 'price-low') list = [...list].sort((a, b) => a.startingPrice - b.startingPrice);
    if (sort === 'price-high') list = [...list].sort((a, b) => b.startingPrice - a.startingPrice);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, tag, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page">
      <div className="page-hero-plain">
        <div className="container">
          <h1>Destinations</h1>
          <p>Explore {destinations.length} handpicked places across India.</p>
        </div>
      </div>

      <div className="container section-tight">
        <div className="flex" style={{ gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <SearchBar value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search by name or state…" className="grow-search" />
          <select className="input" style={{ maxWidth: 200 }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">Sort: Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="flex" style={{ gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => { setTag(t); setPage(1); }}
              className={`btn btn-sm ${tag === t ? 'btn-primary' : 'btn-outline'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {paged.length ? (
          <>
            <div className="grid grid-3">
              {paged.map((d) => <DestinationCard key={d.id} destination={d} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <EmptyState
            icon={Compass}
            title="No destinations found"
            message="Try a different search term or clear your filters."
          />
        )}
      </div>

      <style>{`
        .grow-search { flex: 1; min-width: 220px; }
      `}</style>
    </div>
  );
}
