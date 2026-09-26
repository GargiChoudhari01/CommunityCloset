import React from 'react';
import { Layers, Heart, Shield, HelpCircle, AlertCircle, Leaf, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#FFE4E1] border-t border-[#FFC0CB] text-gray-700 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#E86F88] flex items-center justify-center text-white font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-gray-900">CommunityCloset</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            "For the people, by the people" — Katraj's premier hyper-local tool library and material exchange platform. Built to reduce waste and foster neighborhood sharing.
          </p>
          <div className="flex items-center space-x-1 text-xs text-emerald-700 font-medium">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>Over 120+ kg CO₂ offset in Katraj, Pune!</span>
          </div>
        </div>

        {/* Quick User Links */}
        <div>
          <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Explore Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNavigate('#home')} className="hover:text-[#900C3F] transition-all">Home Dashboard</button></li>
            <li><button onClick={() => onNavigate('#explore')} className="hover:text-[#900C3F] transition-all">Browse Tools & Materials</button></li>
            <li><button onClick={() => onNavigate('#map')} className="hover:text-[#900C3F] transition-all">Katraj Interactive Map</button></li>
            <li><button onClick={() => onNavigate('#impact')} className="hover:text-[#900C3F] transition-all">Eco-Impact Dashboard</button></li>
            <li><button onClick={() => onNavigate('#create-listing')} className="hover:text-[#900C3F] transition-all">Lend or Give Away Items</button></li>
          </ul>
        </div>

        {/* Support & Community Rules */}
        <div>
          <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Help & Guidelines</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNavigate('#help')} className="hover:text-[#900C3F] transition-all flex items-center space-x-1"><HelpCircle className="w-3.5 h-3.5" /><span>Help & FAQ</span></button></li>
            <li><button onClick={() => onNavigate('#complaints')} className="hover:text-[#900C3F] transition-all flex items-center space-x-1"><AlertCircle className="w-3.5 h-3.5" /><span>Submit Complaint / Dispute</span></button></li>
            <li><button onClick={() => onNavigate('#transactions')} className="hover:text-[#900C3F] transition-all">Track Active Borrows</button></li>
            <li><a href="#help" className="hover:text-[#900C3F] transition-all">Community Guidelines</a></li>
          </ul>
        </div>

        {/* Admin Portal Link & Neighborhood Zone */}
        <div>
          <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Katraj Hub</h4>
          <p className="text-xs text-gray-600 mb-3 flex items-start space-x-1.5">
            <MapPin className="w-4 h-4 text-[#E86F88] flex-shrink-0 mt-0.5" />
            <span>Serving Katraj Lake, Sukhsagar Nagar, Rajiv Gandhi Zoo circle & Pune South.</span>
          </p>
          <button
            onClick={() => onNavigate('#admin/dashboard')}
            className="w-full bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold py-2 px-3 rounded-xl border border-purple-300 transition-all flex items-center justify-center space-x-1.5"
          >
            <Shield className="w-4 h-4 text-purple-700" />
            <span>Admin Moderation Area</span>
          </button>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-[#FFC0CB]/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <p>© 2026 CommunityCloset. Crafted with care for Katraj, Pune.</p>
        <p className="flex items-center space-x-1 mt-2 sm:mt-0">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-pink-600 fill-current" />
          <span>for sustainable community sharing</span>
        </p>
      </div>
    </footer>
  );
};
