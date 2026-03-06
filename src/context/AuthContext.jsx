import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const ROLES = {
  public: {
    id: 'public',
    name: 'Visitor',
    role: 'public',
    label: 'Public View',
    market: null,
    company: null,
    language: 'en',
  },
  agent: {
    id: 'agent-marie',
    name: 'Marie Dupont',
    role: 'agent',
    label: 'Travel Agent',
    email: 'marie@voyages-dupont.fr',
    market: 'french',
    company: 'Voyages Dupont',
    hubspotId: 'HS-12345',
    language: 'fr',
    avatar: 'MD',
  },
  internal: {
    id: 'internal-thomas',
    name: 'Thomas Weber',
    role: 'internal',
    label: 'Easia Internal',
    email: 'thomas@easia-travel.com',
    market: 'german',
    company: 'Easia Travel',
    department: 'Sales',
    avatar: 'TW',
  },
};

export function AuthProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('easia-role');
    return saved && ['public', 'agent', 'internal'].includes(saved) ? saved : 'agent';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const user = ROLES[currentRole];

  const switchRole = useCallback((role) => {
    setCurrentRole(role);
    localStorage.setItem('easia-role', role);
  }, []);

  const canView = useCallback((audienceList) => {
    if (!audienceList || audienceList.length === 0) return true;
    if (currentRole === 'internal') return true;
    if (currentRole === 'agent') return audienceList.includes('agent') || audienceList.includes('public');
    return audienceList.includes('public');
  }, [currentRole]);

  const canViewByMarket = useCallback((marketList) => {
    if (!marketList || marketList.length === 0) return true;
    if (marketList.includes('all')) return true;
    if (!user.market) return true;
    return marketList.includes(user.market);
  }, [user.market]);

  const isContentVisible = useCallback((item) => {
    if (currentRole === 'internal') return true;
    if (item.status === 'draft' || item.status === 'outdated' || item.status === 'archived') return false;
    if (!canView(item.audience)) return false;
    if (!canViewByMarket(item.markets)) return false;
    return true;
  }, [currentRole, canView, canViewByMarket]);

  return (
    <AuthContext.Provider value={{
      user,
      currentRole,
      switchRole,
      canView,
      canViewByMarket,
      isContentVisible,
      showLoginModal,
      setShowLoginModal,
      roles: ROLES,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
