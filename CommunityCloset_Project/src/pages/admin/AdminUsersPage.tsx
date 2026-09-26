import React from 'react';
import type { User } from '../../types';
import { ArrowLeft } from 'lucide-react';
import { storage } from '../../services/storage';

interface AdminUsersPageProps {
  users: User[];
  onBack: () => void;
  onRefresh: () => void;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ users, onBack, onRefresh }) => {
  const toggleBanStatus = (user: User) => {
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, status: u.status === 'banned' ? 'active' : 'banned' } as User;
      }
      return u;
    });
    storage.saveUsers(updatedUsers);
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <button onClick={onBack} className="inline-flex items-center space-x-1 text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      <h1 className="text-2xl font-black text-gray-900">User Management ({users.length})</h1>

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Eco-Points</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-900 flex items-center space-x-2">
                  <img src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} className="w-7 h-7 rounded-full object-cover" />
                  <span>{u.name}</span>
                </td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4 font-bold text-purple-700 uppercase">{u.role}</td>
                <td className="p-4 font-bold">{u.ecoPoints} pts</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${u.status === 'banned' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleBanStatus(u)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                      u.status === 'banned' ? 'bg-emerald-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {u.status === 'banned' ? 'Unban User' : 'Ban User'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
