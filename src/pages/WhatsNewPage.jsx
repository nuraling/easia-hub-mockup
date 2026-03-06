import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, Image, MapPin, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Layout/Breadcrumbs';
import StoryTooltip from '../components/StoryTooltip';
import products from '../data/products.json';
import media from '../data/media.json';

export default function WhatsNewPage() {
  const { currentRole, isContentVisible, user } = useAuth();
  const [filterType, setFilterType] = useState('');

  const updates = useMemo(() => {
    const items = [];
    products.products.filter(isContentVisible).forEach(p => {
      items.push({
        id: p.id,
        type: 'product',
        title: p.name,
        description: p.description.slice(0, 120) + '...',
        date: p.lastUpdated,
        badges: p.badges,
        image: p.heroImage,
        category: p.category,
        link: `/products/${p.id}`,
        isHighlighted: p.badges.includes('new') || p.badges.includes('updated'),
      });
    });
    media.media.filter(isContentVisible).forEach(m => {
      items.push({
        id: m.id,
        type: 'media',
        title: m.title,
        description: `${m.format} — ${m.fileSize}`,
        date: m.lastSynced?.split('T')[0] || '',
        badges: [],
        image: m.thumbnail,
        category: 'Media Asset',
        link: '/media',
        isHighlighted: false,
      });
    });
    items.sort((a, b) => b.date.localeCompare(a.date));
    if (filterType) return items.filter(i => i.type === filterType);
    return items;
  }, [isContentVisible, filterType]);

  if (currentRole === 'public') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-easia-gray-900">Sign in to view updates</h2>
        <p className="text-easia-gray-500 mt-2">The What's New section is available to logged-in users.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Breadcrumbs items={[{ label: "What's New" }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-easia-gray-900">What's New</h1>
            <StoryTooltip id="L5-003" />
          </div>
          <p className="text-easia-gray-500 mt-1">
            Latest updates relevant to your market
            {user.market && <span className="text-easia-burgundy"> ({user.market})</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-easia-gray-300" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-easia-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none"
          >
            <option value="">All Updates</option>
            <option value="product">Products</option>
            <option value="media">Media</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 mb-12">
        {updates.map(item => (
          <Link
            key={`${item.type}-${item.id}`}
            to={item.link}
            className={`flex gap-4 p-4 rounded-xl border transition hover:shadow-sm group ${
              item.isHighlighted ? 'border-easia-burgundy/20 bg-easia-burgundy/5' : 'border-easia-gray-100 bg-white'
            }`}
          >
            <img src={item.image} alt={item.title} className="w-20 h-16 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {item.type === 'product' ? <FileText size={14} className="text-easia-burgundy" /> : <Image size={14} className="text-purple-500" />}
                <span className="text-xs text-easia-gray-300 uppercase">{item.type}</span>
                {item.badges.map(b => (
                  <span key={b} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                    b === 'new' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>{b}</span>
                ))}
                {item.isHighlighted && (
                  <span className="text-[10px] text-easia-burgundy font-medium">Highlighted</span>
                )}
                {item.isHighlighted && <StoryTooltip id="L5-004" />}
              </div>
              <h3 className="font-semibold text-easia-gray-900 group-hover:text-easia-burgundy transition truncate">{item.title}</h3>
              <p className="text-sm text-easia-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-easia-gray-300">
                <Clock size={12} /> {item.date}
                <span className="text-easia-gray-200">|</span>
                {item.category}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
