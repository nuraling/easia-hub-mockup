import { useAuth } from '../../context/AuthContext';
import { Eye, UserCheck, Shield } from 'lucide-react';

const roleConfig = [
  { key: 'public', icon: Eye, label: 'Public Visitor', desc: 'See what unauthenticated visitors see' },
  { key: 'agent', icon: UserCheck, label: 'Travel Agent (Marie Dupont)', desc: 'French TO — Voyages Dupont' },
  { key: 'internal', icon: Shield, label: 'Easia Internal (Thomas Weber)', desc: 'Sales Manager — German market' },
];

export default function RoleSwitcher({ onClose }) {
  const { currentRole, switchRole } = useAuth();

  return (
    <div className="absolute top-full right-0 left-0 bg-white shadow-xl border-b border-easia-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {roleConfig.map(({ key, icon: Icon, label, desc }) => (
            <button
              key={key}
              onClick={() => { switchRole(key); onClose(); }}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 transition text-left cursor-pointer ${
                currentRole === key
                  ? 'border-easia-burgundy bg-easia-burgundy/5'
                  : 'border-easia-gray-200 hover:border-easia-gray-300'
              }`}
            >
              <Icon size={20} className={currentRole === key ? 'text-easia-burgundy' : 'text-easia-gray-500'} />
              <div>
                <div className={`font-medium text-sm ${currentRole === key ? 'text-easia-burgundy' : 'text-easia-gray-900'}`}>
                  {label}
                </div>
                <div className="text-xs text-easia-gray-500 mt-0.5">{desc}</div>
              </div>
              {currentRole === key && (
                <span className="ml-auto bg-easia-burgundy text-white text-[10px] px-2 py-0.5 rounded-full">Active</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
