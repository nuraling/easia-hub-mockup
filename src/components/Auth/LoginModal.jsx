import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginModal({ onClose }) {
  const { switchRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    switchRole('agent');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1573790387438-4da905039392?w=800)' }}>
          <div className="absolute inset-0 bg-easia-gray-900/60 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold">Agent Hub</h2>
              <p className="text-sm mt-1 opacity-80">Welcome to Easia Travel</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 text-white/80 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="p-8">
          <p className="text-easia-gray-500 text-sm mb-6">Welcome back, sign in to continue</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-easia-gray-500 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full mt-1 px-0 py-2 border-b border-easia-gray-200 focus:border-easia-burgundy outline-none text-sm transition"
              />
            </div>
            <div>
              <label className="text-xs text-easia-gray-500 uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full mt-1 px-0 py-2 border-b border-easia-gray-200 focus:border-easia-burgundy outline-none text-sm transition"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-easia-gray-500 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-easia-burgundy" />
                Remember Me
              </label>
              <a href="#" className="text-easia-burgundy hover:underline">Forgot your password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-easia-burgundy text-white py-3 rounded-lg font-medium hover:bg-easia-burgundy-dark transition cursor-pointer"
            >
              Agent Login
            </button>
          </form>
          <p className="text-center text-sm text-easia-gray-500 mt-6">
            No account yet? <a href="#" className="text-easia-burgundy font-semibold hover:underline">SIGN UP HERE</a>
          </p>
          <p className="text-center text-xs text-easia-gray-300 mt-2">
            Logging in, you will have access to all the detailed factsheets of our products
          </p>
        </div>
      </div>
    </div>
  );
}
