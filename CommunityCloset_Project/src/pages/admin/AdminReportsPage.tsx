import React from 'react';
import type { Report } from '../../types';
import { ArrowLeft } from 'lucide-react';
import { storage } from '../../services/storage';

interface AdminReportsPageProps {
  reports: Report[];
  onBack: () => void;
  onRefresh: () => void;
}

export const AdminReportsPage: React.FC<AdminReportsPageProps> = ({ reports, onBack, onRefresh }) => {
  const handleUpdate = (id: string, status: Report['status']) => {
    storage.updateReport(id, status);
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <button onClick={onBack} className="inline-flex items-center space-x-1 text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      <h1 className="text-2xl font-black text-gray-900">User Item Flag Queue ({reports.length})</h1>

      {reports.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl text-center border border-gray-200">
          <p className="text-xs text-gray-400">No pending reports.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                    {r.reason}
                  </span>
                  <span className="text-xs font-bold text-gray-900">Item: {r.listingTitle}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Reporter: {r.reporterName} | Details: {r.details || 'None'}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUpdate(r.id, 'action_taken')}
                  className="bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow"
                >
                  Remove Item
                </button>
                <button
                  onClick={() => handleUpdate(r.id, 'dismissed')}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
