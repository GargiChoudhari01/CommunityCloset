import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import type { User } from '../../types';

interface AdminLoginPageProps {
  currentUser: User | null;
  onLoginSuccess: () => void;
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ currentUser, onLoginSuccess, onNavigate }) => {
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
          <p className="text-xs text-gray-500">CommunityCloset Moderation</p>
        </div>

        {currentUser?.role === 'admin' ? (
          <button
            onClick={onLoginSuccess}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 rounded-xl text-sm shadow transition-all"
          >
            Continue to Admin Portal
          </button>
        ) : (
          <p role="alert" className="rounded-xl bg-purple-50 p-4 text-center text-sm text-purple-900">
            Sign in with an account that has the trusted admin role in Supabase to access this area.
          </p>
        )}
      </div>
    </div>
  );
};
