import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye, Download, Search, TrendingUp, Users, FileText, AlertTriangle, Clock, User, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import Breadcrumbs from '../components/Layout/Breadcrumbs';
import StoryTooltip from '../components/StoryTooltip';
import products from '../data/products.json';
import usersData from '../data/users.json';

const COLORS = ['#8B1A4A', '#C4973B', '#6B7280', '#059669', '#7C3AED'];

export default function AdminPage() {
  const { currentRole } = useAuth();
  const { events: liveEvents } = useActivity();
  const [activeTab, setActiveTab] = useState('overview');
  const analytics = usersData.analyticsData;

  if (currentRole !== 'internal') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-easia-gray-900">Access Restricted</h2>
        <p className="text-easia-gray-500 mt-2">The admin dashboard is only available to Easia internal users.</p>
      </div>
    );
  }

  const contentByStatus = [
    { name: 'Approved', value: products.products.filter(p => p.status === 'approved').length, color: '#059669' },
    { name: 'Draft', value: products.products.filter(p => p.status === 'draft').length, color: '#D97706' },
    { name: 'Outdated', value: products.products.filter(p => p.status === 'outdated').length, color: '#DC2626' },
  ];

  const marketData = Object.entries(analytics.marketBreakdown).map(([market, data]) => ({
    market: market.charAt(0).toUpperCase() + market.slice(1),
    views: data.views,
    downloads: data.downloads,
    searches: data.searches,
  }));

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'content', label: 'Content Status' },
    { id: 'activity', label: 'Partner Activity' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Breadcrumbs items={[{ label: 'Admin Dashboard' }]} />

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-easia-gray-900">Admin Dashboard</h1>
          <StoryTooltip id="L8-001" />
          <StoryTooltip id="L8-002" />
        </div>
        <p className="text-easia-gray-500 mt-1">Hub analytics, content governance, and partner activity</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-easia-gray-100 rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
              activeTab === tab.id ? 'bg-white text-easia-burgundy shadow-sm' : 'text-easia-gray-500 hover:text-easia-gray-700'
            }`}
          >{tab.label}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 mb-12">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Views', value: analytics.totalViews.toLocaleString(), icon: Eye, color: 'text-blue-500' },
              { label: 'Downloads', value: analytics.totalDownloads.toLocaleString(), icon: Download, color: 'text-green-500' },
              { label: 'Searches', value: analytics.totalSearches.toLocaleString(), icon: Search, color: 'text-purple-500' },
              { label: 'Active Markets', value: '3', icon: Users, color: 'text-easia-burgundy' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white border border-easia-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon size={18} className={kpi.color} />
                  <span className="text-xs text-easia-gray-500 uppercase tracking-wide">{kpi.label}</span>
                </div>
                <p className="text-2xl font-bold text-easia-gray-900">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Weekly Trend */}
          <div className="bg-white border border-easia-gray-100 rounded-xl p-6">
            <h3 className="font-semibold text-easia-gray-900 mb-4">Weekly Engagement Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={analytics.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8B1A4A" strokeWidth={2} dot={{ fill: '#8B1A4A' }} />
                <Line type="monotone" dataKey="downloads" stroke="#C4973B" strokeWidth={2} dot={{ fill: '#C4973B' }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-2 text-xs text-easia-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-easia-burgundy inline-block" /> Views</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-easia-gold inline-block" /> Downloads</span>
            </div>
          </div>

          {/* Market Breakdown */}
          <div className="bg-white border border-easia-gray-100 rounded-xl p-6">
            <h3 className="font-semibold text-easia-gray-900 mb-4">Usage by Market</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="market" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="views" fill="#8B1A4A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="downloads" fill="#C4973B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="searches" fill="#6B7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-2 text-xs text-easia-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-easia-burgundy rounded-sm inline-block" /> Views</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-easia-gold rounded-sm inline-block" /> Downloads</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-easia-gray-500 rounded-sm inline-block" /> Searches</span>
            </div>
          </div>

          {/* Top search terms & zero results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-easia-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-easia-gray-900 mb-4">Top Search Terms</h3>
              <div className="space-y-2">
                {analytics.topSearchTerms.map((term, i) => (
                  <div key={term} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 bg-easia-gray-100 rounded-full flex items-center justify-center text-xs text-easia-gray-500">{i + 1}</span>
                    <span className="text-easia-gray-700">{term}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-easia-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-easia-gray-900 mb-4">Zero-Result Searches</h3>
              <p className="text-xs text-easia-gray-500 mb-3">Users searched for these but found nothing — content gap opportunity</p>
              <div className="space-y-2">
                {analytics.zeroResultTerms.map(term => (
                  <div key={term} className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    <AlertTriangle size={14} /> "{term}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-8 mb-12">
          {/* Status overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-easia-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-easia-gray-900">Content by Status</h3>
              <StoryTooltip id="L3-006" />
              <StoryTooltip id="L3-004" />
            </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={contentByStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {contentByStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white border border-easia-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-easia-gray-900 mb-4">Top Products by Views</h3>
              <div className="space-y-3">
                {analytics.topProducts.map((p, i) => {
                  const product = products.products.find(pr => pr.id === p.id);
                  const maxViews = analytics.topProducts[0].views;
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className="text-xs text-easia-gray-300 w-4">{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-easia-gray-900">{product?.name || p.id}</p>
                        <div className="w-full bg-easia-gray-100 rounded-full h-1.5 mt-1">
                          <div className="bg-easia-burgundy h-1.5 rounded-full" style={{ width: `${(p.views / maxViews) * 100}%` }} />
                        </div>
                      </div>
                      <span className="text-xs text-easia-gray-500">{p.views} views</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content list with governance */}
          <div className="bg-white border border-easia-gray-100 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-easia-gray-100">
              <h3 className="font-semibold text-easia-gray-900">All Content Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-easia-gray-50 text-easia-gray-500 text-left">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Owner</th>
                    <th className="px-6 py-3 font-medium">Last Updated</th>
                    <th className="px-6 py-3 font-medium">Markets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-easia-gray-50">
                  {products.products.map(p => (
                    <tr key={p.id} className="hover:bg-easia-gray-50">
                      <td className="px-6 py-3 font-medium text-easia-gray-900">{p.name}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${
                          p.status === 'approved' ? 'bg-green-100 text-green-700' :
                          p.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                          p.status === 'outdated' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-6 py-3 text-easia-gray-500">{p.owner}</td>
                      <td className="px-6 py-3 text-easia-gray-500 flex items-center gap-1"><Clock size={12} /> {p.lastUpdated}</td>
                      <td className="px-6 py-3 text-easia-gray-500">{p.markets.filter(m => m !== 'all').join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-8 mb-12">
          {/* HubSpot integration info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2"><ExternalLink size={18} /> HubSpot Integration <StoryTooltip id="L7-001" /></h3>
            <p className="text-sm text-blue-700 mt-2">Partner activity is tracked and synced to HubSpot. The following log shows simulated Hub activity events that would be sent to HubSpot contacts/companies.</p>
          </div>

          {/* Activity log */}
          <div className="bg-white border border-easia-gray-100 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-easia-gray-100">
              <h3 className="font-semibold text-easia-gray-900">Recent Partner Activity</h3>
              <p className="text-xs text-easia-gray-500 mt-1">Events tracked for HubSpot sync</p>
            </div>
            <div className="divide-y divide-easia-gray-50">
              {/* Live tracked events */}
              {liveEvents.map((event) => (
                <div key={event.id} className="px-6 py-3 flex items-center gap-4 text-sm bg-green-50/50">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <User size={14} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-easia-gray-900">{event.userName}</span>
                    <span className="text-easia-gray-500 ml-1">
                      {event.action === 'view_product' && `viewed product: ${event.target}`}
                      {event.action === 'download_media' && `downloaded media asset: ${event.target}`}
                      {event.action === 'search' && `searched for "${event.query}"`}
                      {event.action === 'open_koob' && `opened KOOB for: ${event.target}`}
                      {event.action === 'view_destination' && `viewed destination: ${event.target}`}
                      {event.action === 'copy_link' && `copied link: ${event.target}`}
                    </span>
                  </div>
                  <span className="text-xs text-easia-gray-300 shrink-0">{new Date(event.timestamp).toLocaleTimeString()}</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">LIVE</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">HubSpot: {event.hubspotId}</span>
                </div>
              ))}
              {liveEvents.length > 0 && usersData.activityLog.length > 0 && (
                <div className="px-6 py-2 bg-easia-gray-50 text-xs text-easia-gray-400 text-center">Previous session activity (static demo data)</div>
              )}
              {/* Static historical events */}
              {usersData.activityLog.map((event, i) => (
                <div key={`static-${i}`} className="px-6 py-3 flex items-center gap-4 text-sm">
                  <div className="w-8 h-8 bg-easia-burgundy/10 rounded-full flex items-center justify-center shrink-0">
                    <User size={14} className="text-easia-burgundy" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-easia-gray-900">Marie Dupont</span>
                    <span className="text-easia-gray-500 ml-1">
                      {event.action === 'login' && 'logged in to the Hub'}
                      {event.action === 'view_product' && `viewed product: ${event.target}`}
                      {event.action === 'download_media' && `downloaded media asset: ${event.target}`}
                      {event.action === 'search' && `searched for "${event.query}"`}
                      {event.action === 'open_koob' && `opened KOOB for: ${event.target}`}
                      {event.action === 'view_destination' && `viewed destination: ${event.target}`}
                    </span>
                  </div>
                  <span className="text-xs text-easia-gray-300 shrink-0">{new Date(event.timestamp).toLocaleString()}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">HubSpot: HS-12345</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
