import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { AdminStats } from '../../types';

interface AdminAnalyticsPageProps {
  stats: AdminStats;
  onBack: () => void;
}

export const AdminAnalyticsPage: React.FC<AdminAnalyticsPageProps> = ({ stats, onBack }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <button onClick={onBack} className="inline-flex items-center space-x-1 text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      <h1 className="text-2xl font-black text-gray-900">Analytics & Growth Metrics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase">CO₂ Offset</span>
          <span className="text-3xl font-black text-emerald-700">{stats.totalCO2SavedKg} kg</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase">Est. Community Savings</span>
          <span className="text-3xl font-black text-purple-700">₹{stats.totalMoneySavedInr}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase">Total Borrows</span>
          <span className="text-3xl font-black text-gray-900">{stats.totalTransactions}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase">Registered Neighbors</span>
          <span className="text-3xl font-black text-gray-900">{stats.totalUsers}</span>
        </div>
      </div>
    </div>
  );
};
