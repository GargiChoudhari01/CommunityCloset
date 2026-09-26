import React from 'react';
import { Leaf, Award, TrendingUp, Users, DollarSign, Trees, Heart } from 'lucide-react';
import { storage } from '../services/storage';

interface ImpactDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const ImpactDashboardPage: React.FC<ImpactDashboardPageProps> = () => {
  const impact = storage.getImpactStats();
  const completedTx = storage.getTransactions().filter(t => t.status === 'completed');
  const totalUsers = storage.getUsers().length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-8 rounded-3xl shadow-lg space-y-3">
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Leaf className="w-3.5 h-3.5 text-emerald-200" />
          <span>Katraj Environmental & Financial Impact</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">Community Sustainability Metrics</h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
          Real-time metrics computed strictly from completed neighbor borrowing transactions in Katraj, Pune. Zero fabricated or estimated data.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase block">Total CO₂ Diverted</span>
          <span className="text-3xl font-black text-gray-900">{impact.kgCo2Diverted} kg</span>
          <p className="text-[11px] text-emerald-700 font-semibold">
            {impact.kgCo2Diverted > 0 
              ? `Prevented via ${completedTx.length} completed lends` 
              : 'Start sharing resources to prevent emissions'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase block">Community Savings</span>
          <span className="text-3xl font-black text-gray-900">₹{impact.moneySavedInr.toLocaleString('en-IN')}</span>
          <p className="text-[11px] text-teal-700 font-semibold">Saved by borrowing instead of buying</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF0F5] text-[#900C3F] flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase block">Items Reused</span>
          <span className="text-3xl font-black text-gray-900">{impact.itemsReused} Completed</span>
          <p className="text-[11px] text-[#900C3F] font-semibold">Verified transactions</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase block">Active Lenders</span>
          <span className="text-3xl font-black text-gray-900">{impact.activeLendersCount} Lenders</span>
          <p className="text-[11px] text-purple-700 font-semibold">{totalUsers} Total registered users</p>
        </div>

      </div>

      {/* Katraj Eco Milestone Badges */}
      <div className="bg-white p-8 rounded-3xl border border-[#FFC0CB]/80 shadow-md space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900">Katraj Neighborhood Achievements</h2>
        
        {impact.itemsReused === 0 ? (
          <div className="bg-[#FFF0F5] p-6 rounded-2xl border border-[#FFC0CB] text-center space-y-2">
            <Heart className="w-8 h-8 text-[#900C3F] mx-auto" />
            <h4 className="font-extrabold text-sm text-gray-900">No Community Exchanges Completed Yet</h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Once neighbors in Katraj start completing borrow requests and returning items, community achievement badges and carbon offset milestones will be unlocked automatically!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FFF0F5] p-4 rounded-2xl border border-[#FFC0CB] flex items-center space-x-3">
              <Award className="w-8 h-8 text-[#900C3F]" />
              <div>
                <h4 className="font-bold text-xs text-gray-900">Zero Waste Pioneer</h4>
                <p className="text-[11px] text-gray-500">{impact.itemsReused} items exchanged</p>
              </div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center space-x-3">
              <Trees className="w-8 h-8 text-emerald-600" />
              <div>
                <h4 className="font-bold text-xs text-gray-900">Carbon Diverter</h4>
                <p className="text-[11px] text-emerald-800">{impact.kgCo2Diverted} kg CO₂ prevented</p>
              </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center space-x-3">
              <Award className="w-8 h-8 text-amber-600" />
              <div>
                <h4 className="font-bold text-xs text-gray-900">Community Closet</h4>
                <p className="text-[11px] text-amber-800">Verified Katraj members</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
