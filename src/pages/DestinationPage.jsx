import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Globe, User } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import Breadcrumbs from '../components/Layout/Breadcrumbs';
import StoryTooltip from '../components/StoryTooltip';
import destinations from '../data/destinations.json';
import products from '../data/products.json';

export default function DestinationPage() {
  const { id } = useParams();
  const { currentRole, isContentVisible, user } = useAuth();
  const { trackEvent } = useActivity();
  const destination = destinations.destinations.find(d => d.id === id);

  useEffect(() => {
    if (destination) {
      trackEvent('view_destination', { target: destination.name, userName: user.name, hubspotId: user.hubspotId });
    }
  }, [id]);

  if (!destination) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-easia-gray-500">Destination not found.</div>;
  }

  const destProducts = products.products.filter(p => p.destination === id && isContentVisible(p));
  const regions = destination.regions || [];

  return (
    <div>
      {/* Hero */}
      <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: `url(${destination.heroImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-easia-gray-900/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">{destination.name}</h1>
            <p className="text-white/70 mt-2 max-w-2xl">{destination.tagline}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumbs items={[
          { label: 'Destinations', href: '/' },
          { label: destination.name },
        ]} />

        {/* Metadata bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-easia-gray-500 mb-8 pb-4 border-b border-easia-gray-100">
          <span className="flex items-center gap-1.5"><Clock size={14} /> Updated {destination.lastUpdated} <StoryTooltip id="L3-001" /></span>
          {currentRole === 'internal' && (
            <>
              <span className="flex items-center gap-1.5"><User size={14} /> Owner: {destination.owner} <StoryTooltip id="L3-003" /></span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                destination.status === 'approved' ? 'bg-green-100 text-green-700' :
                destination.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>{destination.status}</span>
              <StoryTooltip id="L3-005" />
            </>
          )}
          <span className="flex items-center gap-1.5">
            <Globe size={14} />
            Markets: {destination.markets.filter(m => m !== 'all').join(', ') || 'All'}
            <StoryTooltip id="L4-001" />
          </span>
        </div>

        {/* Description */}
        <div className="max-w-3xl mb-12">
          <p className="text-easia-gray-700 leading-relaxed">{destination.description}</p>
        </div>

        {/* Regions */}
        {regions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-easia-gray-900 mb-6">Regions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {regions.map(region => (
                <div key={region.id} className="rounded-xl overflow-hidden border border-easia-gray-100 hover:shadow-md transition">
                  <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${region.image})` }} />
                  <div className="p-5">
                    <h3 className="font-semibold text-easia-gray-900">{region.name}</h3>
                    <p className="text-sm text-easia-gray-500 mt-2">{region.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {region.highlights.map(h => (
                        <span key={h} className="bg-easia-gray-100 text-easia-gray-700 text-xs px-2 py-0.5 rounded-full">{h}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        {destProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-easia-gray-900 mb-6">
              Products in {destination.name}
              <span className="text-easia-gray-300 font-normal text-base ml-2">({destProducts.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destProducts.map(product => (
                <Link key={product.id} to={`/products/${product.id}`} className="bg-white rounded-xl overflow-hidden border border-easia-gray-100 hover:shadow-md transition group">
                  <div className="relative h-44">
                    <img src={product.heroImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {product.badges.map(b => (
                        <span key={b} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                          b === 'new' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>{b}</span>
                      ))}
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
                    <p className="text-sm text-easia-gray-500 mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-easia-gray-300">{product.duration}</span>
                      <span className="flex items-center gap-1 text-xs text-easia-gray-300">
                        <Clock size={12} /> {product.lastUpdated}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Language versions notice */}
        <section className="mb-12 p-4 bg-easia-gray-50 rounded-lg text-sm text-easia-gray-500">
          <Globe size={16} className="inline mr-2" />
          This destination page is available in: <strong>English</strong> <StoryTooltip id="L4-002" />
          {currentRole !== 'public' && <> | <button className="text-easia-burgundy hover:underline cursor-pointer">Fran&ccedil;ais</button> | <button className="text-easia-burgundy hover:underline cursor-pointer">Deutsch</button></>}
        </section>
      </div>
    </div>
  );
}
