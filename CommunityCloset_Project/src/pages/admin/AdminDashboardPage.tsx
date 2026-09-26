import React from 'react';
import {
  Users,
  Layers,
  Repeat,
  AlertTriangle,
  Flag,
  Tag,
  BarChart2,
  Shield,
  ArrowRight
} from 'lucide-react';
import type { AdminStats } from '../../types';

interface AdminDashboardPageProps {
  stats: AdminStats;
  onNavigateAdmin: (subPath: string) => void;
  onExitAdmin: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  stats,
  onNavigateAdmin,
  onExitAdmin
}) => {
  const adminModules = [
    { title: 'User Management', desc: 'Ban, verify, or edit user roles', icon: Users, path: 'users', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'Listing Management', desc: 'Approve, feature, or remove items', icon: Layers, path: 'listings', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { title: 'Item Reports Queue', desc: 'Review user-flagged listings', icon: Flag, path: 'reports', color: 'bg-amber-50 text-amber-700 border-amber-200', count: stats.pendingReports },
    { title: 'Disputes & Complaints', desc: 'Resolve active user conflicts', icon: AlertTriangle, path: 'complaints', color: 'bg-red-50 text-red-700 border-red-200', count: stats.pendingComplaints },
    { title: 'All Transactions', desc: 'Full platform borrow audit log', icon: Repeat, path: 'transactions', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { title: 'Category CRUD Manager', desc: 'Add/edit tool & material types', icon: Tag, path: 'categories', color: 'bg-pink-50 text-pink-700 border-pink-200' },
    { title: 'Analytics & Growth', desc: 'CO₂ offset & borrow velocity', icon: BarChart2, path: 'analytics', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-max">
            <Shield className="w-3.5 h-3.5 text-purple-300" />
            <span>Katraj Admin Control Suite</span>
          </div>
          <h1 className="text-3xl font-black mt-2">CommunityCloset Admin Center</h1>
          <p className="text-xs text-purple-200 mt-1">
            Supervise user activities, listing quality, disputes, and carbon metrics.
          </p>
        </div>

        <button
          onClick={onExitAdmin}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
        >
          Exit Admin Mode
        </button>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase block">Total Users</span>
          <span className="text-2xl font-black text-gray-900">{stats.totalUsers}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase block">Total Listings</span>
          <span className="text-2xl font-black text-gray-900">{stats.totalListings}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase block">Active Borrows</span>
          <span className="text-2xl font-black text-purple-700">{stats.totalTransactions}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase block">Pending Complaints</span>
          <span className="text-2xl font-black text-red-600">{stats.pendingComplaints}</span>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-4">Admin Moderation Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {adminModules.map((mod) => (
            <div
              key={mod.path}
              onClick={() => onNavigateAdmin(mod.path)}
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border ${mod.color}`}>
                  <mod.icon className="w-6 h-6" />
                </div>
                {mod.count !== undefined && mod.count > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    {mod.count} Action
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-gray-900 text-base group-hover:text-purple-700 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{mod.desc}</p>
              </div>

              <div className="flex items-center text-xs font-bold text-purple-700 group-hover:translate-x-1 transition-all">
                <span>Manage Module</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
