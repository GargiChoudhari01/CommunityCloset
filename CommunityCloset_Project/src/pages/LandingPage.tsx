import React from 'react';
import { Layers, MapPin, ArrowRight, Users } from 'lucide-react';
import type { ResourceItem } from '../types';
import { ItemCard } from '../components/ItemCard';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  featuredItems: ResourceItem[];
  wishlistIds: string[];
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  featuredItems,
  wishlistIds,
  onToggleWishlist
}) => {
  return (
    <div className="space-y-16 pb-12 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF0F5] via-[#FFE4E1]/40 to-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#FFC0CB]/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#FFC0CB] shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#900C3F] tracking-wide uppercase">Hyper-Local Katraj Sharing</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
              For the people, <br />
              <span className="bg-gradient-to-r from-[#900C3F] via-[#E86F88] to-[#FFB6C1] bg-clip-text text-transparent">
                by the people.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
              Why buy expensive tools or throw away leftover construction materials? CommunityCloset lets neighbors in Katraj, Pune lend, borrow, and exchange resources effortlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                onClick={() => onNavigate('#explore')}
                className="bg-[#900C3F] hover:bg-[#700931] text-white px-8 py-3.5 rounded-2xl font-extrabold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
              >
                <span>Browse Resource Library</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigate('#map')}
                className="bg-white border-2 border-[#FFC0CB] text-[#900C3F] hover:bg-[#FFF0F5] px-6 py-3.5 rounded-2xl font-bold text-base transition-all flex items-center justify-center space-x-2"
              >
                <MapPin className="w-5 h-5 text-[#E86F88]" />
                <span>View Katraj Map</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#FFC0CB]/50">
              <div>
                <span className="text-2xl font-black text-gray-900 block">120+</span>
                <span className="text-xs text-gray-500 font-medium">Tools & Materials</span>
              </div>
              <div>
                <span className="text-2xl font-black text-[#900C3F] block">142 kg</span>
                <span className="text-xs text-gray-500 font-medium">CO₂ Prevented</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-700 block">₹45k+</span>
                <span className="text-xs text-gray-500 font-medium">Community Savings</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card Stack */}
          <div className="relative">
            <div className="relative z-10 bg-white p-6 rounded-3xl shadow-2xl border border-[#FFC0CB] space-y-4 transform lg:rotate-1 hover:rotate-0 transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0F5] flex items-center justify-center font-bold text-[#900C3F]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm">Katraj Tool Closet</h3>
                    <p className="text-[11px] text-gray-500">Sukhsagar Nagar & Zoo Circle</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Verified Neighborhood</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FFF0F5] p-3 rounded-2xl border border-[#FFC0CB]/60">
                  <span className="text-[10px] font-bold uppercase text-[#900C3F]">Popular Tool</span>
                  <p className="font-bold text-gray-900 text-xs mt-1">Bosch Impact Drill Set</p>
                  <p className="text-[10px] text-gray-500">Lender: Aarav (Katraj)</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase text-emerald-700">Material Exchange</span>
                  <p className="font-bold text-gray-900 text-xs mt-1">Teak Plywood Sheets</p>
                  <p className="text-[10px] text-emerald-700">Free Giveaway</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center space-x-1"><Users className="w-4 h-4 text-[#E86F88]" /><span>34 Active Lenders Today</span></span>
                <span className="text-[#900C3F] font-bold">100% Free Borrowing</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Items Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Available in Katraj Right Now</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Lend tools or pick up free leftover materials near you</p>
          </div>
          <button
            onClick={() => onNavigate('#explore')}
            className="text-xs sm:text-sm font-bold text-[#900C3F] hover:underline flex items-center space-x-1"
          >
            <span>View All Items</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isWishlisted={wishlistIds.includes(item.id)}
              onToggleWishlist={onToggleWishlist}
              onClick={(id) => onNavigate(`#item/${id}`)}
              onQuickBorrow={() => onNavigate(`#item/${item.id}`)}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#FFF0F5] py-16 px-4 sm:px-6 lg:px-8 border-y border-[#FFC0CB]/60">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#900C3F] bg-white px-3 py-1 rounded-full border border-[#FFC0CB]">Simplicity</span>
            <h2 className="text-3xl font-black text-gray-900 mt-3">How CommunityCloset Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-3xl border border-[#FFC0CB]/60 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#900C3F] text-white flex items-center justify-center font-black text-lg">1</div>
              <h3 className="font-extrabold text-gray-900 text-lg">Find & Request</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Browse power tools, ladders, or leftover tiles in Katraj. Submit a date request with optional security deposit.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#FFC0CB]/60 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E86F88] text-white flex items-center justify-center font-black text-lg">2</div>
              <h3 className="font-extrabold text-gray-900 text-lg">Connect & Pickup</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Chat directly with verified Katraj neighbors. Arrange safe pickup at Rajiv Gandhi Zoo or Katraj Lake circle.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#FFC0CB]/60 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">3</div>
              <h3 className="font-extrabold text-gray-900 text-lg">Use, Return & Save</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Complete your DIY project, return items clean, earn eco-points, and prevent landfill waste!
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
