import React, { useState } from 'react';
import type { User } from '../types';
import {
  Home,
  Compass,
  PlusCircle,
  Heart,
  MessageSquare,
  Bell,
  Clock,
  Menu,
  X,
  Shield,
  HelpCircle,
  FileQuestion,
  LogOut,
  FolderHeart,
  Briefcase
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: User | null;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
  wishlistCount?: number;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  user,
  unreadNotificationsCount = 0,
  unreadMessagesCount = 0,
  wishlistCount = 0,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '#home', icon: Home },
    { label: 'Explore', path: '#explore', icon: Compass },
    { label: 'Project Mode', path: '#project-mode', icon: Briefcase },
    { label: 'Map', path: '#map', icon: Compass },
    { label: 'Impact', path: '#impact', icon: Heart },
    { label: 'Wishlist', path: '#wishlist', icon: FolderHeart, badge: wishlistCount },
    { label: 'Transactions', path: '#transactions', icon: Clock },
    { label: 'Messages', path: '#messages', icon: MessageSquare, badge: unreadMessagesCount },
    { label: 'Notifications', path: '#notifications', icon: Bell, badge: unreadNotificationsCount },
    { label: 'Help / FAQ', path: '#help', icon: HelpCircle },
    { label: 'Complaints', path: '#complaints', icon: FileQuestion },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#FFF0F5]/90 backdrop-blur-md border-b border-[#FFC0CB] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('#home')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#900C3F] to-[#E86F88] flex items-center justify-center text-white shadow-md shadow-[#900C3F]/20">
              <span className="font-black text-xl tracking-wider">CC</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-[#900C3F]">CommunityCloset</span>
                <span className="hidden sm:inline bg-[#FFD1DC] text-[#900C3F] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FFC0CB]">
                  Katraj
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium -mt-1 hidden sm:block">
                Hyper-local resource sharing
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.slice(0, 5).map((link) => (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  currentPath === link.path
                    ? 'bg-[#FFC0CB] text-[#900C3F] shadow-sm'
                    : 'text-gray-700 hover:bg-[#FFD1DC]/40 hover:text-[#900C3F]'
                }`}
              >
                {link.icon && <link.icon className="w-3.5 h-3.5" />}
                <span>{link.label}</span>
              </button>
            ))}

            {/* Overflow/Secondary Links Menu */}
            <div className="relative group">
              <button
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                  ['#wishlist', '#transactions', '#messages', '#notifications', '#help', '#complaints'].includes(currentPath)
                    ? 'bg-[#FFC0CB] text-[#900C3F]'
                    : 'text-gray-700 hover:bg-[#FFD1DC]/40 hover:text-[#900C3F]'
                }`}
              >
                <span>More</span>
                {(unreadNotificationsCount > 0 || unreadMessagesCount > 0) && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-1" />
                )}
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#FFC0CB] p-2 hidden group-hover:block animate-fade-in z-50">
                {navLinks.slice(5).map((link) => (
                  <button
                    key={link.path}
                    onClick={() => onNavigate(link.path)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-[#FFF0F5] hover:text-[#900C3F] flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      {link.icon && <link.icon className="w-3.5 h-3.5 text-gray-500" />}
                      <span>{link.label}</span>
                    </div>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="bg-[#900C3F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Right CTA Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Create Listing Button */}
            <button
              onClick={() => onNavigate('#create-listing')}
              className="bg-gradient-to-r from-[#900C3F] to-[#A8144D] hover:from-[#700931] hover:to-[#900C3F] text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm hover:shadow transition-all flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share Item</span>
            </button>

            {/* Admin Portal Shortcut */}
            <button
              onClick={() => onNavigate('#admin/dashboard')}
              className="p-2 rounded-xl text-purple-700 hover:bg-purple-100 transition-all flex items-center space-x-1"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold">Admin</span>
            </button>

            {/* User Profile & Prominent Logout */}
            {user ? (
              <div className="flex items-center space-x-3 border-l border-[#FFC0CB]/60 pl-3">
                <button
                  onClick={() => onNavigate('#profile')}
                  className="flex items-center space-x-2 p-1 rounded-xl hover:bg-[#FFD1DC]/30 transition-all"
                  title="View Profile"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-[#FFB6C1] object-cover"
                  />
                  <span className="text-sm font-semibold text-gray-800 hidden lg:inline">{user.name.split(' ')[0]}</span>
                </button>

                {/* Highly Visible Logout Button */}
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 shadow-sm transition-all hover:scale-105 active:scale-95"
                  title="Log out of CommunityCloset"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Logout</span>
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

            {/* Mobile Prominent Logout / Sign In */}
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 py-2.5 rounded-xl font-extrabold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all mt-1"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>Log Out ({user.name.split(' ')[0]})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full bg-[#900C3F] text-white py-2.5 rounded-xl font-bold text-sm shadow flex items-center justify-center space-x-2 mt-1"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
