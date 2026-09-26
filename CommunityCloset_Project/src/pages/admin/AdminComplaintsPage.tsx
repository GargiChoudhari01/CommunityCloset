import React, { useState } from 'react';
import type { Complaint } from '../../types';
import { ArrowLeft } from 'lucide-react';
import { storage } from '../../services/storage';

interface AdminComplaintsPageProps {
  complaints: Complaint[];
  onBack: () => void;
  onRefresh: () => void;
}

export const AdminComplaintsPage: React.FC<AdminComplaintsPageProps> = ({
  complaints,
  onBack,
  onRefresh
}) => {
  const [notes, setNotes] = useState<{ [id: string]: string }>({});

  const handleResolve = (id: string, status: Complaint['status']) => {
    storage.updateComplaint(id, status, notes[id]);
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <button onClick={onBack} className="inline-flex items-center space-x-1 text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      <h1 className="text-2xl font-black text-gray-900">Dispute & Complaints Resolution ({complaints.length})</h1>

      {complaints.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl text-center border border-gray-200">
          <p className="text-xs text-gray-400">No active complaints.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-gray-900">{c.subject}</h3>
                <span className="text-xs font-bold uppercase bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  {c.status}
                </span>
              </div>
              <p className="text-xs text-gray-600">Submitted by: {c.userName} | Description: {c.description}</p>

              <div className="pt-2 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Add resolution notes..."
                  value={notes[c.id] || ''}
                  onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 text-xs"
                />
                <button
                  onClick={() => handleResolve(c.id, 'resolved')}
                  className="bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow"
                >
                  Mark Resolved
                </button>
                <button
                  onClick={() => handleResolve(c.id, 'dismissed')}
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
