import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Shield, Globe, MapPin, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import type { User } from '../types';
import { storage } from '../services/storage';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateAdmin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateAdmin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('Katraj, Pune, Maharashtra');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Gardening', 'DIY']);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

 const interestOptions = ['Books', 'Clothes', 'Furniture', 'Kitchen Items','Sports Equipment', 'Electronics', 'Study Materials'];
  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter(t => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const existingUsers = storage.getUsers();
    let existing = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!existing) {
      // Create user on login if first time
      existing = {
        id: `u-${Date.now()}`,
        name: email.split('@')[0] || 'Katraj Resident',
        email: email.toLowerCase(),
        role: 'user',
        locationAddress: neighborhood || 'Katraj, Pune, Maharashtra',
        lat: 18.4575,
        lng: 73.8508,
        ecoPoints: 100,
        co2SavedKg: 0,
        verified: true,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      storage.saveUsers([existing, ...existingUsers]);
    }

    storage.setCurrentUser(existing);
    onLoginSuccess(existing);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !email || !password) {
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }

    const existingUsers = storage.getUsers();
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'user',
      avatar: avatarUrl || undefined,
      locationAddress: neighborhood.trim() || 'Katraj, Pune, Maharashtra',
      bio: `Neighbor in ${neighborhood}. Interested in ${selectedInterests.join(', ')}.`,
      lat: 18.4575,
      lng: 73.8508,
      ecoPoints: 150,
      co2SavedKg: 0,
      verified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    storage.saveUsers([newUser, ...existingUsers]);
    storage.setCurrentUser(newUser);
    onLoginSuccess(newUser);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address to receive password reset link.');
      return;
    }
    setResetSent(true);
    setErrorMessage('');
  };

  const handleGoogleOAuth = () => {
    const googleUser: User = {
      id: `u-google-${Date.now()}`,
      name: 'Katraj Community Member',
      email: 'member.katraj@gmail.com',
      role: 'user',
      locationAddress: 'Katraj Lake Area, Pune',
      lat: 18.4582,
      lng: 73.8512,
      ecoPoints: 200,
      co2SavedKg: 0,
      verified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    const existingUsers = storage.getUsers();
    storage.saveUsers([googleUser, ...existingUsers.filter(u => u.email !== googleUser.email)]);
    storage.setCurrentUser(googleUser);
    onLoginSuccess(googleUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F5] via-[#FFE4E1]/40 to-[#FFF0F5] flex items-center justify-center p-4 py-12 animate-fade-in">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl shadow-2xl border border-[#FFC0CB] overflow-hidden">
        
        {/* Left Branding Side */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#900C3F] via-[#A8144D] to-[#700931] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <Heart className="w-3.5 h-3.5 text-[#FFB6C1] fill-current" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#FFF0F5]">For the people, by the people</span>
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">CommunityCloset</h1>
              <p className="text-xs text-[#FFC0CB] mt-1 font-medium leading-relaxed">
                Katraj, Pune hyper-local sharing platform. Lend tools, borrow garden items, exchange lumber & baby supplies safely with real neighbors.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center space-x-2 text-[#FFF0F5]">
                <CheckCircle2 className="w-4 h-4 text-[#FFB6C1]" />
                <span>100% Free neighbor-to-neighbor sharing</span>
              </div>
              <div className="flex items-center space-x-2 text-[#FFF0F5]">
                <CheckCircle2 className="w-4 h-4 text-[#FFB6C1]" />
                <span>Real verified Katraj user profiles</span>
              </div>
              <div className="flex items-center space-x-2 text-[#FFF0F5]">
                <CheckCircle2 className="w-4 h-4 text-[#FFB6C1]" />
                <span>Zero fake / AI content — genuine activity</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-[#FFC0CB]">Katraj • Sukhsagar • Lake Circle</span>
            {onNavigateAdmin && (
              <button
                onClick={onNavigateAdmin}
                className="text-[11px] font-bold text-white hover:underline flex items-center space-x-1 bg-white/10 px-2.5 py-1 rounded-lg hover:bg-white/20 transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Auth Forms Side */}
        <div className="md:col-span-7 p-6 sm:p-8 bg-white flex flex-col justify-center">
          
          {/* Tab Navigation */}
          <div className="flex items-center space-x-2 bg-[#FFF0F5] p-1.5 rounded-2xl border border-[#FFC0CB]/60 mb-6">
            <button
              onClick={() => { setActiveTab('login'); setErrorMessage(''); setResetSent(false); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-[#900C3F] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#900C3F]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setErrorMessage(''); setResetSent(false); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                activeTab === 'signup'
                  ? 'bg-[#900C3F] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#900C3F]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Google OAuth Button */}
          {activeTab !== 'forgot' && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleOAuth}
                className="w-full bg-white border-2 border-gray-200 hover:border-[#FFC0CB] text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-all flex items-center justify-center space-x-2 hover:bg-[#FFF0F5]/50"
              >
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Continue with Google</span>
              </button>
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">Or with Email</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl mb-4">
              {errorMessage}
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F] focus:ring-2 focus:ring-[#FFC0CB]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-[11px] font-bold text-[#900C3F] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F] focus:ring-2 focus:ring-[#FFC0CB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#900C3F] hover:bg-[#700931] text-white font-black py-3 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>Enter Community Closet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@gmail.com"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Katraj Neighborhood / Area</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. Sukhsagar Nagar, Katraj Lake, Zoo Circle"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#900C3F]"
                  />
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Optional Profile Photo</label>
                <div className="flex items-center space-x-3">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar Preview" className="w-8 h-8 rounded-full object-cover border border-[#FFC0CB]" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FFF0F5] border border-[#FFC0CB] flex items-center justify-center text-xs text-[#900C3F] font-bold">
                      {name ? name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#FFF0F5] file:text-[#900C3F] hover:file:bg-[#FFE4E1]"
                  />
                </div>
              </div>

              {/* Optional Interests */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Interests & Specialities</label>
                <div className="flex flex-wrap gap-1.5">
                  {interestOptions.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                        selectedInterests.includes(tag)
                          ? 'bg-[#900C3F] text-white border-[#900C3F]'
                          : 'bg-[#FFF0F5] text-gray-600 border-[#FFC0CB] hover:bg-[#FFE4E1]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#900C3F] hover:bg-[#700931] text-white font-black py-2.5 rounded-xl text-xs shadow-md transition-all mt-2"
              >
                Complete Registration & Sign In
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD FORM */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="text-left">
                <h3 className="text-base font-extrabold text-gray-900">Reset Your Password</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter your registered Katraj Community Closet email address and we'll send you a password reset link.
                </p>
              </div>

              {resetSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Password Reset Link Sent!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    We sent an email to <strong>{email}</strong>. Follow the link in the message to create your new password.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-xs font-bold text-[#900C3F] underline pt-1 block"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@gmail.com"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#900C3F] hover:bg-[#700931] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all"
                  >
                    Send Password Reset Email
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="w-full text-xs font-bold text-gray-500 hover:text-gray-800 py-1"
                  >
                    Cancel and Return to Sign In
                  </button>
                </>
              )}
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
