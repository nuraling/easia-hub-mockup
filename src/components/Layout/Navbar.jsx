import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useActivity } from '../../context/ActivityContext';
import RoleSwitcher from '../Auth/RoleSwitcher';
import StoryTooltip from '../StoryTooltip';

export default function Navbar() {
  const { user, currentRole, setShowLoginModal } = useAuth();
  const { recentNotifications } = useActivity();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const staticNotifications = [
    { id: 's1', text: 'Ha Long Bay Cruise factsheet updated', time: '2 hours ago', unread: false },
    { id: 's2', text: 'New media added: Phu Quoc Sunset Beach', time: '1 day ago', unread: false },
    { id: 's3', text: 'Mekong Delta Explorer product refreshed', time: '3 days ago', unread: false },
  ];
  const notifications = currentRole !== 'public' ? [...recentNotifications, ...staticNotifications] : [];
  const unreadCount = recentNotifications.length;

  return (
    <header className="bg-easia-gray-900 text-white sticky top-0 z-50">
      {/* Role switcher banner */}
      <div className="bg-easia-burgundy text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <span className="opacity-80">Demo Mode — Switch user role to see different access levels</span>
        <button
          onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
          className="flex items-center gap-1 font-medium hover:opacity-80 cursor-pointer"
        >
          Viewing as: <span className="underline">{user.label || user.role}</span>
          <ChevronDown size={14} />
        </button>
      </div>
      {showRoleSwitcher && (
        <RoleSwitcher onClose={() => setShowRoleSwitcher(false)} />
      )}

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="text-xl font-bold tracking-wide">
              <span className="text-white">e</span>
              <span className="text-easia-burgundy-light">a</span>
              <span className="text-white">sia</span>
              <span className="text-easia-gray-300 text-sm ml-1.5 font-light italic">travel</span>
            </div>
            <div className="text-[10px] text-easia-gray-300 hidden sm:block leading-tight">
              We make Asia<br />Easy for You
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              <Link to="/destinations/vietnam" className="text-easia-gray-200 hover:text-white transition">Destinations</Link>
              <StoryTooltip id="L1-001" />
            </span>
            <span className="flex items-center gap-1.5">
              <Link to="/search" className="text-easia-gray-200 hover:text-white transition">Products</Link>
              <StoryTooltip id="L1-002" />
            </span>
            <Link to="/media" className="text-easia-gray-200 hover:text-white transition">Media</Link>
            {currentRole !== 'public' && (
              <Link to="/whats-new" className="text-easia-gray-200 hover:text-white transition">What's New</Link>
            )}
            {currentRole === 'internal' && (
              <Link to="/admin" className="text-easia-gray-200 hover:text-white transition">Admin</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-easia-gray-700/50 rounded-lg px-3 py-1.5">
            <Search size={16} className="text-easia-gray-300" />
            <StoryTooltip id="L2-001" className="ml-1" />
            <input
              type="text"
              placeholder="Search products, destinations, media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-easia-gray-300 ml-2 w-56"
            />
          </form>

          {/* Notifications */}
          {currentRole !== 'public' && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-easia-gray-200 hover:text-white transition cursor-pointer"
              >
                <Bell size={20} />
                <StoryTooltip id="L5-005" className="absolute -bottom-1 -left-1" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-easia-burgundy-light text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-easia-gray-200 py-2 text-easia-gray-900 text-sm">
                  <div className="px-4 py-2 border-b border-easia-gray-100 font-semibold">Notifications</div>
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-easia-gray-50 cursor-pointer ${n.unread ? 'bg-easia-burgundy/5' : ''}`}>
                      <div className="flex items-start gap-2">
                        {n.unread && <span className="w-2 h-2 bg-easia-burgundy rounded-full mt-1.5 shrink-0" />}
                        <div>
                          <p className={n.unread ? 'font-medium' : ''}>{n.text}</p>
                          <p className="text-easia-gray-500 text-xs mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User / Login */}
          {currentRole === 'public' ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-easia-burgundy text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-easia-burgundy-dark transition cursor-pointer"
            >
              Agent Hub
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-easia-burgundy flex items-center justify-center text-xs font-bold">
                {user.avatar}
              </div>
              <span className="hidden md:block text-easia-gray-200">{user.name}</span>
            </div>
          )}

          {/* Mobile menu */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 cursor-pointer">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-easia-gray-900 border-t border-easia-gray-700 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex items-center bg-easia-gray-700/50 rounded-lg px-3 py-2 mb-3">
            <Search size={16} className="text-easia-gray-300" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-easia-gray-300 ml-2 w-full"
            />
          </form>
          <Link to="/destinations/vietnam" className="block text-easia-gray-200 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Destinations</Link>
          <Link to="/search" className="block text-easia-gray-200 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Products</Link>
          <Link to="/media" className="block text-easia-gray-200 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Media</Link>
          {currentRole !== 'public' && (
            <Link to="/whats-new" className="block text-easia-gray-200 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>What's New</Link>
          )}
          {currentRole === 'internal' && (
            <Link to="/admin" className="block text-easia-gray-200 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
          )}
        </div>
      )}
    </header>
  );
}
