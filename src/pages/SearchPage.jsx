import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Clock, MapPin, Image, FileText, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import Breadcrumbs from '../components/Layout/Breadcrumbs';
import StoryTooltip from '../components/StoryTooltip';
import products from '../data/products.json';
import media from '../data/media.json';
import destinations from '../data/destinations.json';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({ destination: '', category: '', type: '' });
  const [showFilters, setShowFilters] = useState(false);
  const { currentRole, isContentVisible, user } = useAuth();
  const { trackEvent } = useActivity();

  const allItems = useMemo(() => {
    const items = [];
    products.products.filter(isContentVisible).forEach(p => {
      const dest = destinations.destinations.find(d => d.id === p.destination);
      items.push({
        id: p.id,
        type: 'product',
        title: p.name,
        description: p.description,
        category: p.category,
        destination: dest?.name || '',
        destinationId: p.destination,
        image: p.heroImage,
        lastUpdated: p.lastUpdated,
        badges: p.badges,
        status: p.status,
        duration: p.duration,
        link: `/products/${p.id}`,
      });
    });
    media.media.filter(isContentVisible).forEach(m => {
      const dest = destinations.destinations.find(d => d.id === m.destination);
      items.push({
        id: m.id,
        type: 'media',
        title: m.title,
        description: `${m.format} — ${m.fileSize} — ${m.rights}`,
        category: 'Media',
        destination: dest?.name || '',
        destinationId: m.destination,
        image: m.thumbnail,
        lastUpdated: m.lastSynced?.split('T')[0] || '',
        badges: [],
        status: m.status,
        link: '/media',
      });
    });
    destinations.destinations.forEach(d => {
      items.push({
        id: d.id,
        type: 'destination',
        title: d.name,
        description: d.description,
        category: 'Destination',
        destination: d.name,
        destinationId: d.id,
        image: d.heroImage,
        lastUpdated: d.lastUpdated,
        badges: [],
        status: d.status,
        link: `/destinations/${d.id}`,
      });
    });
    return items;
  }, [isContentVisible]);

  const results = useMemo(() => {
    let filtered = allItems;
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.destination.toLowerCase().includes(q)
      );
    }
    if (filters.destination) filtered = filtered.filter(i => i.destinationId === filters.destination);
    if (filters.category) filtered = filtered.filter(i => i.category === filters.category);
    if (filters.type) filtered = filtered.filter(i => i.type === filters.type);
    // Sort by freshness
    filtered.sort((a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || ''));
    return filtered;
  }, [allItems, query, filters]);

  const categories = [...new Set(products.products.map(p => p.category))];

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    if (query.trim()) {
      trackEvent('search', { query: query.trim(), userName: user.name, hubspotId: user.hubspotId });
    }
  };

  const clearFilters = () => setFilters({ destination: '', category: '', type: '' });
  const hasFilters = filters.destination || filters.category || filters.type;

  const typeIcon = (type) => {
    if (type === 'media') return <Image size={14} className="text-purple-500" />;
    if (type === 'destination') return <MapPin size={14} className="text-green-500" />;
    return <FileText size={14} className="text-easia-burgundy" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Breadcrumbs items={[{ label: 'Search' }]} />

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-easia-gray-900">Search</h1>
          <StoryTooltip id="L2-002" />
          <StoryTooltip id="L2-003" />
          <StoryTooltip id="L2-005" />
          <StoryTooltip id="L2-006" />
        </div>
        <p className="text-easia-gray-500 mt-1">Find products, destinations, and media across the Hub</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center bg-easia-gray-50 border border-easia-gray-200 rounded-xl px-4 py-3 focus-within:border-easia-burgundy transition">
          <Search size={20} className="text-easia-gray-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, destinations, media..."
            className="flex-1 bg-transparent border-none outline-none ml-3 text-easia-gray-900 placeholder-easia-gray-300"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setSearchParams({}); }} className="text-easia-gray-300 hover:text-easia-gray-500 cursor-pointer">
              <X size={18} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition cursor-pointer ${
            hasFilters ? 'bg-easia-burgundy text-white border-easia-burgundy' : 'bg-white text-easia-gray-700 border-easia-gray-200 hover:border-easia-gray-300'
          }`}
        >
          <Filter size={18} /> Filters <StoryTooltip id="L2-004" />
        </button>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="bg-easia-gray-50 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs text-easia-gray-500 uppercase tracking-wide block mb-1">Destination</label>
            <select
              value={filters.destination}
              onChange={(e) => setFilters(f => ({ ...f, destination: e.target.value }))}
              className="bg-white border border-easia-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
            >
              <option value="">All Destinations</option>
              {destinations.destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-easia-gray-500 uppercase tracking-wide block mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
              className="bg-white border border-easia-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-easia-gray-500 uppercase tracking-wide block mb-1">Content Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
              className="bg-white border border-easia-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
            >
              <option value="">All Types</option>
              <option value="product">Products</option>
              <option value="media">Media</option>
              <option value="destination">Destinations</option>
            </select>
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-easia-burgundy hover:underline cursor-pointer">Clear all</button>
          )}
        </div>
      )}

      {/* Results */}
      <div className="mb-4 text-sm text-easia-gray-500">
        {results.length} result{results.length !== 1 ? 's' : ''}
        {query && <> for "<span className="font-medium text-easia-gray-900">{query}</span>"</>}
        {hasFilters && <span className="text-easia-burgundy"> (filtered)</span>}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 bg-easia-gray-50 rounded-xl">
          <Search size={48} className="text-easia-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-easia-gray-900">No results found <StoryTooltip id="L2-008" /></h3>
          <p className="text-easia-gray-500 mt-2 max-w-md mx-auto">
            Try adjusting your search terms or filters. You can also browse by destination or category.
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <Link to="/destinations/vietnam" className="text-sm text-easia-burgundy hover:underline">Browse Vietnam</Link>
            <span className="text-easia-gray-200">|</span>
            <Link to="/media" className="text-sm text-easia-burgundy hover:underline">Media Library</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3 mb-12">
          {results.map(item => (
            <Link key={`${item.type}-${item.id}`} to={item.link} className="flex gap-4 p-4 bg-white border border-easia-gray-100 rounded-xl hover:shadow-sm transition group">
              <img src={item.image} alt={item.title} className="w-24 h-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {typeIcon(item.type)}
                  <span className="text-xs text-easia-gray-300 uppercase">{item.type}</span>
                  {item.badges?.map(b => (
                    <span key={b} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                      b === 'new' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>{b}</span>
                  ))}
                  {currentRole === 'internal' && item.status !== 'approved' && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                      item.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      item.status === 'outdated' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{item.status}</span>
                  )}
                </div>
                <h3 className="font-semibold text-easia-gray-900 group-hover:text-easia-burgundy transition truncate">{item.title} <StoryTooltip id="L2-007" /></h3>
                <p className="text-sm text-easia-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-easia-gray-300">
                  {item.destination && <span>{item.destination}</span>}
                  {item.category && <span>{item.category}</span>}
                  <span className="flex items-center gap-1"><Clock size={10} /> {item.lastUpdated}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
