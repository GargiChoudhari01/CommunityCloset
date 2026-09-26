import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Bell,
  PlusCircle,
  MapPin,
  HelpCircle,
  BarChart2,
  Menu,
  X,
  LogOut,
  Shield,
  Layers
} from 'lucide-react';
import type { User } from '../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: User | null;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  wishlistCount: number;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  user,
  unreadNotificationsCount,
  unreadMessagesCount,
  wishlistCount,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '#home' },
    { label: 'Explore', path: '#explore' },
    { label: 'Katraj Map', path: '#map', icon: MapPin },
    { label: 'Impact', path: '#impact', icon: BarChart2 },
    { label: 'Transactions', path: '#transactions' },
    { label: 'Help / FAQ', path: '#help', icon: HelpCircle },
  ];

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#FFF0F5]/90 border-b border-[#FFC0CB]/50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('#landing')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFB6C1] to-[#E86F88] flex items-center justify-center shadow-md transform hover:scale-105 transition-all">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-gray-800">CommunityCloset</span>
                <span className="bg-[#FFD1DC] text-[#900C3F] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Katraj</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">For the people, by the people</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    active
                      ? 'bg-[#FFC0CB] text-[#900C3F] shadow-sm'
                      : 'text-gray-700 hover:bg-[#FFD1DC]/40 hover:text-[#900C3F]'
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Icons & User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Create Listing Button */}
            <button
              onClick={() => onNavigate('#create-listing')}
              className="bg-gradient-to-r from-[#E86F88] to-[#FFB6C1] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:brightness-105 transition-all flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share / Lend</span>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => onNavigate('#wishlist')}
              className="relative p-2 rounded-xl text-gray-700 hover:bg-[#FFD1DC]/40 hover:text-[#900C3F] transition-all"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E86F88] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Messages Icon */}
            <button
              onClick={() => onNavigate('#messages')}
              className="relative p-2 rounded-xl text-gray-700 hover:bg-[#FFD1DC]/40 hover:text-[#900C3F] transition-all"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E86F88] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Notifications Icon */}
            <button
              onClick={() => onNavigate('#notifications')}
              className="relative p-2 rounded-xl text-gray-700 hover:bg-[#FFD1DC]/40 hover:text-[#900C3F] transition-all"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E86F88] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Admin Portal Toggle Link */}
            <button
              onClick={() => onNavigate('#admin/dashboard')}
              className="p-2 rounded-xl text-purple-700 hover:bg-purple-100 transition-all flex items-center space-x-1"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold">Admin</span>
            </button>

            {/* User Profile / Auth Action */}
            {user ? (
              <div className="flex items-center space-x-2 border-l border-[#FFC0CB]/60 pl-3">
                <button
                  onClick={() => onNavigate('#profile')}
                  className="flex items-center space-x-2 p-1 rounded-xl hover:bg-[#FFD1DC]/30 transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-[#FFB6C1] object-cover"
                  />
                  <span className="text-sm font-semibold text-gray-800 hidden lg:inline">{user.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-gray-500 hover:text-red-600 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-[#900C3F] text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-[#700931] transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-[#FFC0CB]/50 transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFF0F5] border-b border-[#FFC0CB] px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 ${
                  currentPath === link.path ? 'bg-[#FFC0CB] text-[#900C3F]' : 'text-gray-700 hover:bg-[#FFD1DC]/40'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                <span>{link.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-[#FFC0CB]/60 pt-3 flex flex-col space-y-2">
            <button
              onClick={() => {
                onNavigate('#create-listing');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#E86F88] text-white py-2.5 rounded-xl font-bold text-sm shadow flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share / Lend Item</span>
            </button>
            <button
              onClick={() => {
                onNavigate('#admin/dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full border border-purple-300 text-purple-800 py-2 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
