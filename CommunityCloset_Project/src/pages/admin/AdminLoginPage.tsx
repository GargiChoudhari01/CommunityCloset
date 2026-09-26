import React, { useState } from 'react';
import { Shield, Key, ArrowLeft } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === 'admin123' || adminKey === 'admin') {
      onLoginSuccess();
    } else {
      setError('Invalid Admin Authorization Key. Default key is "admin123".');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl border border-purple-200 shadow-2xl max-w-md w-full relative">
        <button
          onClick={() => onNavigate('#home')}
          className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto font-bold shadow-sm">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Admin Protected Area</h1>
          <p className="text-xs text-gray-500">Katraj & Pune South Community Moderation Suite</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Admin Passkey</label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key (default: admin123)"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-purple-600"
              />
            </div>
            {error && <p className="text-xs text-red-600 mt-1 font-semibold">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 rounded-xl text-sm shadow transition-all"
          >
            Authenticate Admin Session
          </button>
        </form>
      </div>
    </div>
  );
};
