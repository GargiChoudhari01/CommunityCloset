import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Shield, Globe } from 'lucide-react';
import type { User } from '../types';
import { storage } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingUsers = storage.getUsers();
    const existing = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      storage.setCurrentUser(existing);
      onSuccess(existing);
    } else {
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: name || email.split('@')[0] || 'Katraj Neighbor',
        email: email || 'neighbor@katraj.org',
        role: 'user',
        locationAddress: 'Katraj, Pune, Maharashtra',
        lat: 18.4575,
        lng: 73.8508,
        ecoPoints: 100,
        co2SavedKg: 0,
        verified: true,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      const users = [newUser, ...existingUsers];
      storage.saveUsers(users);
      storage.setCurrentUser(newUser);
      onSuccess(newUser);
    }
    onClose();
  };

  const handleGoogleOAuth = () => {
    const googleUser: User = {
      id: `u-google-${Date.now()}`,
      name: 'Google Community User',
      email: 'user.google@gmail.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      locationAddress: 'Katraj Zoo Circle, Pune',
      lat: 18.4582,
      lng: 73.8512,
      ecoPoints: 250,
      co2SavedKg: 15,
      verified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    storage.setCurrentUser(googleUser);
    onSuccess(googleUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#FFC0CB] relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] text-[#900C3F] font-bold flex items-center justify-center mx-auto mb-2 shadow-sm border border-[#FFC0CB]">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {isSignUp ? 'Join CommunityCloset' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Katraj's hyper-local resource sharing network
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleOAuth}
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-sm shadow-sm transition-all flex items-center justify-center space-x-2 mb-4"
        >
          <Globe className="w-5 h-5 text-blue-500" />
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center mb-4">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-gray-400 font-semibold uppercase">Or Email</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@gmail.com"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#900C3F] hover:bg-[#700931] text-white font-extrabold py-3 rounded-xl text-sm shadow-md transition-all"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-[#900C3F] font-bold hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'New to Katraj community? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};
