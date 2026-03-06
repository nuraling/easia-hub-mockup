import { useState, useMemo } from 'react';
import { Download, Copy, X, CheckCircle, Search, Filter, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import Breadcrumbs from '../components/Layout/Breadcrumbs';
import StoryTooltip from '../components/StoryTooltip';
import mediaData from '../data/media.json';

export default function MediaPage() {
  const { currentRole, isContentVisible, user } = useAuth();
  const { trackEvent } = useActivity();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRights, setFilterRights] = useState('');

  const visibleMedia = useMemo(() => {
    let items = mediaData.media.filter(isContentVisible);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(m => m.title.toLowerCase().includes(q) || m.tags.some(t => t.includes(q)));
    }
    if (filterType) items = items.filter(m => m.type === filterType);
    if (filterRights) items = items.filter(m => m.rights === filterRights);
    return items;
  }, [isContentVisible, searchQuery, filterType, filterRights]);

  const handleCopyLink = () => {
    if (selectedMedia) {
      navigator.clipboard?.writeText(`https://canto.easia-travel.com/asset/${selectedMedia.cantoId}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Breadcrumbs items={[{ label: 'Media Library' }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-easia-gray-900">Media Library</h1>
            <StoryTooltip id="L6-001" />
            <StoryTooltip id="L6-004" />
          </div>
          <p className="text-easia-gray-500 mt-1">Curated media assets synced from Canto — approved and ready to use</p>
        </div>
        <div className="text-xs text-easia-gray-300 bg-easia-gray-50 px-3 py-1.5 rounded-lg">
          Synced from Canto — Last sync: Feb 15, 2026
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px] flex items-center bg-easia-gray-50 border border-easia-gray-200 rounded-lg px-3 py-2">
          <Search size={16} className="text-easia-gray-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media..."
            className="flex-1 bg-transparent border-none outline-none ml-2 text-sm"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white border border-easia-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
        </select>
        <select
          value={filterRights}
          onChange={(e) => setFilterRights(e.target.value)}
          className="bg-white border border-easia-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="">All Rights</option>
          <option value="Free to share">Free to share</option>
          <option value="Requires attribution">Requires attribution</option>
          <option value="Internal only">Internal only</option>
        </select>
      </div>

      <p className="text-sm text-easia-gray-500 mb-4">{visibleMedia.length} asset{visibleMedia.length !== 1 ? 's' : ''}</p>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {visibleMedia.map(m => (
          <div
            key={m.id}
            onClick={() => setSelectedMedia(m)}
            className="group relative rounded-xl overflow-hidden cursor-pointer border border-easia-gray-100 hover:shadow-md transition"
          >
            <img src={m.thumbnail} alt={m.title} className="w-full h-44 object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute top-2 right-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                m.rights === 'Free to share' ? 'bg-green-100 text-green-700' :
                m.rights === 'Internal only' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>{m.rights}</span>
            </div>
            {currentRole === 'internal' && m.status !== 'approved' && (
              <div className="absolute top-2 left-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                  m.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                }`}>{m.status}</span>
              </div>
            )}
            <div className="p-3">
              <p className="text-sm font-medium text-easia-gray-900 truncate">{m.title}</p>
              <p className="text-xs text-easia-gray-300 mt-0.5">{m.format} — {m.fileSize}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedMedia(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden">
            <button onClick={() => setSelectedMedia(null)} className="absolute top-4 right-4 z-10 bg-white/80 p-1.5 rounded-full hover:bg-white cursor-pointer">
              <X size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-easia-gray-100">
                <img src={selectedMedia.url} alt={selectedMedia.title} className="w-full h-full object-cover max-h-[500px]" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-easia-gray-900">{selectedMedia.title}</h2>
                  <StoryTooltip id="L6-002" />
                </div>

                {/* Usage Rights Warning */}
                <div className={`p-3 rounded-lg text-sm ${
                  selectedMedia.rights === 'Free to share' ? 'bg-green-50 text-green-700 border border-green-200' :
                  selectedMedia.rights === 'Internal only' ? 'bg-red-50 text-red-700 border border-red-200' :
                  'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                  <strong>Usage Rights:</strong> {selectedMedia.rights} <StoryTooltip id="L6-005" />
                  {selectedMedia.rights === 'Free to share' && <p className="text-xs mt-1">You can share this asset with partners and clients.</p>}
                  {selectedMedia.rights === 'Internal only' && <p className="text-xs mt-1">This asset is for internal use only. Do not share externally.</p>}
                  {selectedMedia.rights === 'Requires attribution' && <p className="text-xs mt-1">You must credit the photographer when using this asset.</p>}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-easia-gray-500">Format</span><span>{selectedMedia.format}</span></div>
                  <div className="flex justify-between"><span className="text-easia-gray-500">Dimensions</span><span>{selectedMedia.dimensions}</span></div>
                  <div className="flex justify-between"><span className="text-easia-gray-500">File Size</span><span>{selectedMedia.fileSize}</span></div>
                  <div className="flex justify-between"><span className="text-easia-gray-500">Canto ID</span><span className="font-mono text-xs">{selectedMedia.cantoId}</span></div>
                  <div className="flex justify-between"><span className="text-easia-gray-500">Uploaded by</span><span>{selectedMedia.uploadedBy}</span></div>
                  <div className="flex justify-between"><span className="text-easia-gray-500">Last synced</span><span>{selectedMedia.lastSynced?.split('T')[0]}</span></div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedMedia.tags.map(t => (
                    <span key={t} className="bg-easia-gray-100 text-easia-gray-500 text-xs px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>

                {currentRole !== 'public' && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        trackEvent('download_media', { target: selectedMedia.title, userName: user.name, hubspotId: user.hubspotId });
                        const a = document.createElement('a');
                        a.href = selectedMedia.url;
                        a.target = '_blank';
                        a.download = selectedMedia.title;
                        a.click();
                      }}
                      className="flex-1 bg-easia-burgundy text-white py-2.5 rounded-lg font-medium hover:bg-easia-burgundy-dark transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download size={16} /> Download <StoryTooltip id="L6-003" />
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 bg-easia-gray-100 text-easia-gray-700 py-2.5 rounded-lg font-medium hover:bg-easia-gray-200 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {copiedLink ? <><CheckCircle size={16} className="text-green-500" /> Copied!</> : <><Copy size={16} /> Copy Link</>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
