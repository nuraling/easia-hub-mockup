import { useParams } from 'react-router-dom';
import { Clock, User, Globe, Download, Copy, ExternalLink, MapPin, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import Breadcrumbs from '../components/Layout/Breadcrumbs';
import StoryTooltip from '../components/StoryTooltip';
import products from '../data/products.json';
import media from '../data/media.json';
import destinations from '../data/destinations.json';

export default function ProductPage() {
  const { id } = useParams();
  const { currentRole, isContentVisible, user } = useAuth();
  const { trackEvent } = useActivity();
  const [showKoobModal, setShowKoobModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);
  const product = products.products.find(p => p.id === id);

  useEffect(() => {
    if (product) {
      trackEvent('view_product', { target: product.name, userName: user.name, hubspotId: user.hubspotId });
    }
  }, [id]);

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-easia-gray-500">Product not found.</div>;
  }

  const dest = destinations.destinations.find(d => d.id === product.destination);
  const productMedia = media.media.filter(m => m.products.includes(id) && isContentVisible(m));

  const handleCopyLink = (mediaId) => {
    navigator.clipboard?.writeText(`https://canto.easia-travel.com/asset/${mediaId}`);
    setCopiedLink(mediaId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 bg-cover bg-center" style={{ backgroundImage: `url(${product.heroImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-easia-gray-900/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
          <div>
            <p className="text-easia-burgundy-light text-sm font-medium mb-1">{product.category}</p>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-white/60 text-sm">
              <span className="flex items-center gap-1"><MapPin size={14} /> {dest?.name}</span>
              <span>{product.duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumbs items={[
          { label: 'Destinations', href: '/' },
          { label: dest?.name || 'Vietnam', href: `/destinations/${product.destination}` },
          { label: product.name },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Governance bar */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-easia-gray-500 mb-6 pb-4 border-b border-easia-gray-100">
              <span className="flex items-center gap-1.5"><Clock size={14} /> Updated {product.lastUpdated} <StoryTooltip id="L3-001" /></span>
              {currentRole === 'internal' && (
                <>
                  <span className="flex items-center gap-1.5"><User size={14} /> {product.owner} <StoryTooltip id="L3-003" /></span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                    product.status === 'approved' ? 'bg-green-100 text-green-700' :
                    product.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                    product.status === 'outdated' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{product.status}</span>
                  <StoryTooltip id="L3-005" />
                  {product.status === 'outdated' && (
                    <span className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertTriangle size={12} /> Content needs review <StoryTooltip id="L3-002" />
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-easia-gray-900 mb-3">Overview</h2>
              <p className="text-easia-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Highlights */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-easia-gray-900 mb-3">Highlights</h2>
              <ul className="space-y-2">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-easia-gray-700">
                    <CheckCircle size={16} className="text-easia-burgundy mt-0.5 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Included */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-easia-gray-900 mb-3">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.included.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-easia-gray-700 bg-easia-gray-50 rounded-lg px-3 py-2">
                    <CheckCircle size={14} className="text-green-500" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Media gallery */}
            {productMedia.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-bold text-easia-gray-900">Media</h2>
                  <StoryTooltip id="L6-008" />
                  <StoryTooltip id="L6-006" />
                </div>
                <p className="text-xs text-easia-gray-300 mb-3">Synced from Canto — Last sync: Feb 15, 2026</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {productMedia.map(m => (
                    <div key={m.id} className="group relative rounded-lg overflow-hidden">
                      <img src={m.thumbnail} alt={m.title} className="w-full h-32 object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        {currentRole !== 'public' && (
                          <>
                            <button className="bg-white text-easia-gray-900 p-2 rounded-full hover:bg-easia-gray-100 cursor-pointer" title="Download">
                              <Download size={14} />
                            </button>
                            <button
                              onClick={() => handleCopyLink(m.cantoId)}
                              className="bg-white text-easia-gray-900 p-2 rounded-full hover:bg-easia-gray-100 cursor-pointer"
                              title="Copy Canto link"
                            >
                              {copiedLink === m.cantoId ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                          </>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-white text-[10px] truncate">{m.title}</p>
                        <span className="flex items-center gap-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                            m.rights === 'Free to share' ? 'bg-green-500/80 text-white' :
                            m.rights === 'Internal only' ? 'bg-red-500/80 text-white' :
                            'bg-yellow-500/80 text-white'
                          }`}>{m.rights}</span>
                          <StoryTooltip id="L6-010" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* KOOB Button */}
            {currentRole !== 'public' && (
              <div className="bg-easia-burgundy/5 border border-easia-burgundy/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-easia-gray-900">Build an Itinerary</h3>
                  <StoryTooltip id="L7-006" />
                </div>
                <p className="text-sm text-easia-gray-500 mb-4">Open this product in KOOB to start building a trip for your clients.</p>
                <button
                  onClick={() => { setShowKoobModal(true); trackEvent('open_koob', { target: product.name, userName: user.name, hubspotId: user.hubspotId }); }}
                  className="w-full bg-easia-burgundy text-white py-3 rounded-lg font-medium hover:bg-easia-burgundy-dark transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink size={16} /> Open in KOOB
                </button>
                <p className="text-[10px] text-easia-gray-300 text-center mt-2">Product ID: {product.koobId}</p>
              </div>
            )}

            {/* Product specs */}
            <div className="bg-easia-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-easia-gray-900 mb-4">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-easia-gray-500">Duration</span>
                  <span className="font-medium">{product.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-easia-gray-500">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-easia-gray-500">Segment</span>
                  <span className="font-medium">{product.productionSpecs.segment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-easia-gray-500">Level</span>
                  <span className="font-medium">{product.productionSpecs.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-easia-gray-500">Group size</span>
                  <span className="font-medium flex items-center gap-1">
                    <Users size={14} /> {product.productionSpecs.minPax}–{product.productionSpecs.maxPax}
                  </span>
                </div>
              </div>
            </div>

            {/* Markets */}
            <div className="bg-easia-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-easia-gray-900">Market Availability</h3>
                <StoryTooltip id="L4-004" />
              </div>
              <div className="flex flex-wrap gap-2">
                {product.markets.filter(m => m !== 'all').map(m => (
                  <span key={m} className="bg-white border border-easia-gray-200 text-easia-gray-700 text-xs px-3 py-1 rounded-full capitalize">{m}</span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-easia-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-easia-gray-900">Available Languages</h3>
                <StoryTooltip id="L4-002" />
              </div>
              <div className="flex gap-2">
                {product.languages.map(l => (
                  <button key={l} className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${
                    l === 'en' ? 'bg-easia-burgundy text-white border-easia-burgundy' : 'bg-white text-easia-gray-700 border-easia-gray-200 hover:border-easia-burgundy'
                  }`}>
                    {l === 'en' ? 'English' : l === 'fr' ? 'Français' : l === 'de' ? 'Deutsch' : l}
                  </button>
                ))}
              </div>
            </div>

            {/* HubSpot link (internal) */}
            {currentRole === 'internal' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-blue-900">HubSpot Integration</h3>
                  <StoryTooltip id="L7-002" />
                </div>
                <p className="text-blue-700 text-xs">Partner activity for this product is tracked and synced to HubSpot for engagement scoring.</p>
                <div className="mt-3 text-xs text-blue-500">
                  <p>Views this week: 34</p>
                  <p>Downloads this week: 12</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KOOB Modal */}
      {showKoobModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowKoobModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 text-center">
            <ExternalLink size={48} className="text-easia-burgundy mx-auto mb-4" />
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-bold text-easia-gray-900">Opening KOOB</h2>
              <StoryTooltip id="L7-007" />
            </div>
            <p className="text-easia-gray-500 mt-2">Passing product context to KOOB itinerary builder...</p>
            <div className="bg-easia-gray-50 rounded-lg p-4 mt-4 text-left text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-easia-gray-500">Product</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-easia-gray-500">KOOB ID</span>
                <span className="font-mono text-easia-burgundy">{product.koobId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-easia-gray-500">Destination</span>
                <span className="font-medium">{dest?.name}</span>
              </div>
            </div>
            <p className="text-xs text-easia-gray-300 mt-3">In production, this would open KOOB with the product pre-loaded.</p>
            <button
              onClick={() => setShowKoobModal(false)}
              className="mt-6 bg-easia-burgundy text-white px-6 py-2 rounded-lg font-medium hover:bg-easia-burgundy-dark transition cursor-pointer"
            >
              Close Demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
