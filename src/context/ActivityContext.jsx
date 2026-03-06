import { createContext, useContext, useState, useCallback } from 'react';

const ActivityContext = createContext(null);

export function ActivityProvider({ children }) {
  const [events, setEvents] = useState([]);

  const trackEvent = useCallback((action, details = {}) => {
    setEvents(prev => [{
      id: Date.now(),
      action,
      target: details.target || '',
      query: details.query || '',
      userName: details.userName || 'Marie Dupont',
      hubspotId: details.hubspotId || 'HS-12345',
      timestamp: new Date().toISOString(),
    }, ...prev]);
  }, []);

  const recentNotifications = events.slice(0, 5).map(e => {
    let text = '';
    if (e.action === 'view_product') text = `Viewed product: ${e.target}`;
    else if (e.action === 'view_destination') text = `Viewed destination: ${e.target}`;
    else if (e.action === 'search') text = `Searched for "${e.query}"`;
    else if (e.action === 'download_media') text = `Downloaded: ${e.target}`;
    else if (e.action === 'copy_link') text = `Copied link: ${e.target}`;
    else if (e.action === 'open_koob') text = `Opened KOOB for: ${e.target}`;
    else text = e.action;

    const seconds = Math.round((Date.now() - new Date(e.timestamp)) / 1000);
    const time = seconds < 60 ? 'Just now' : `${Math.round(seconds / 60)}m ago`;

    return { id: e.id, text, time, unread: true };
  });

  return (
    <ActivityContext.Provider value={{ events, trackEvent, recentNotifications }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider');
  return ctx;
}
