import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Image, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StoryTooltip from '../components/StoryTooltip';
import destinations from '../data/destinations.json';
import products from '../data/products.json';
import media from '../data/media.json';

function StatusBadge({ status }) {
  if (status === 'new') return <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">New</span>;
  if (status === 'updated') return <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">Updated</span>;
  return null;
}

export default function HomePage() {
  const { currentRole, isContentVisible, user } = useAuth();
  const visibleProducts = products.products.filter(isContentVisible);
  const featuredMedia = media.media.filter(m => m.featured && isContentVisible(m));

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[480px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1528127269322-539801943592?w=1600)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-easia-gray-900/80 to-easia-gray-900/30" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Easia Hub
            </h1>
            <p className="text-lg text-white/80 mt-4">
              Your central platform for product discovery, destination content, and media assets across Southeast Asia.
            </p>
            {currentRole === 'public' ? (
              <p className="text-sm text-white/60 mt-4">Sign in to access exclusive agent content, media downloads, and product factsheets.</p>
            ) : (
              <p className="text-sm text-white/60 mt-4">Welcome back, {user.name}. Explore the latest products and destination updates.</p>
            )}
            <div className="flex gap-3 mt-6">
              <Link to="/destinations/vietnam" className="bg-easia-burgundy text-white px-6 py-3 rounded-lg font-medium hover:bg-easia-burgundy-dark transition inline-flex items-center gap-2">
                Explore Vietnam <ArrowRight size={18} />
              </Link>
              <Link to="/search" className="bg-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition backdrop-blur-sm">
                Browse Products
              </Link>
            </div>
            <div className="flex gap-2 mt-4">
              <StoryTooltip id="L1-004" />
              <StoryTooltip id="L1-003" />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-easia-gray-900">Our Destinations</h2>
            <StoryTooltip id="L1-005" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {destinations.destinations.map(dest => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.id}`}
              className="group relative h-48 rounded-xl overflow-hidden"
            >
              <img src={dest.heroImage} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg">{dest.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      {currentRole !== 'public' && (
        <section className="bg-easia-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-easia-gray-900">Latest Products</h2>
                  <StoryTooltip id="L1-006" />
                  <StoryTooltip id="L4-003" />
                </div>
                <p className="text-easia-gray-500 mt-1">Recently added and updated Vietnam experiences</p>
              </div>
              <Link to="/search" className="text-easia-burgundy text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleProducts.slice(0, 4).map((product, idx) => (
                <Link key={product.id} to={`/products/${product.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                  <div className="relative h-48">
                    <img src={product.heroImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {product.badges.map(b => <StatusBadge key={b} status={b} />)}
                      {idx === 0 && product.badges.length > 0 && <StoryTooltip id="L5-001" />}
                    </div>
                    {currentRole === 'internal' && product.status !== 'approved' && (
                      <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        product.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                        product.status === 'outdated' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{product.status}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-easia-burgundy font-medium">{product.category}</p>
                    <h3 className="font-semibold text-easia-gray-900 mt-1">{product.name}</h3>
                    <p className="text-sm text-easia-gray-500 mt-1">{product.duration}</p>
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-easia-gray-300">
                      <Clock size={12} />
                      Updated {product.lastUpdated}
                      {idx === 0 && <StoryTooltip id="L1-007" className="ml-1" />}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Media */}
      {currentRole !== 'public' && featuredMedia.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Image size={20} className="text-easia-burgundy" />
                <h2 className="text-2xl font-bold text-easia-gray-900">Featured Media</h2>
                <StoryTooltip id="L6-007" />
              </div>
              <p className="text-easia-gray-500 mt-1">Highlighted visuals from Canto — ready to download and share</p>
            </div>
            <Link to="/media" className="text-easia-burgundy text-sm font-medium hover:underline flex items-center gap-1">
              Media Library <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredMedia.slice(0, 5).map(m => (
              <Link key={m.id} to="/media" className="group relative h-40 rounded-lg overflow-hidden">
                <img src={m.thumbnail} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition">
                  <p className="text-white text-xs font-medium truncate">{m.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* What's New Preview */}
      {currentRole !== 'public' && (
        <section className="bg-easia-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-easia-burgundy" />
                  <h2 className="text-2xl font-bold text-easia-gray-900">What's New</h2>
                  <StoryTooltip id="L5-002" />
                  <StoryTooltip id="L1-008" />
                </div>
                <p className="text-easia-gray-500 mt-1">Latest updates relevant to your market</p>
              </div>
              <Link to="/whats-new" className="text-easia-burgundy text-sm font-medium hover:underline flex items-center gap-1">
                View all updates <ArrowRight size={16} />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { type: 'product', text: 'Ha Long Bay Luxury Cruise factsheet refreshed with 2026 pricing', date: '2 days ago', badge: 'updated' },
                { type: 'media', text: 'New Phu Quoc sunset photography collection added to Media Library', date: '3 days ago', badge: 'new' },
                { type: 'product', text: 'Mekong Delta Explorer now includes homestay option', date: '5 days ago', badge: 'updated' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-lg p-4 flex items-center gap-4 hover:shadow-sm transition">
                  <StatusBadge status={item.badge} />
                  <div className="flex-1">
                    <p className="text-sm text-easia-gray-900">{item.text}</p>
                    <p className="text-xs text-easia-gray-300 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
