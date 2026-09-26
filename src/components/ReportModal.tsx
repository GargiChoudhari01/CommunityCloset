import React, { useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';
import type { ResourceItem, User, Report } from '../types';
import { storage } from '../services/storage';

interface ReportModalProps {
  item: ResourceItem | null;
  currentUser: User;
  onClose: () => void;
  onReported: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  item,
  currentUser,
  onClose,
  onReported
}) => {
  const [reason, setReason] = useState('Inappropriate Content');
  const [details, setDetails] = useState('');

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      listingId: item.id,
      listingTitle: item.title,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    storage.addReport(newReport);
    onReported();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-lg">Report Listing</h3>
            <p className="text-xs text-gray-500">Flag "{item.title}" for admin review</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Reason for Report</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
            >
              <option value="Inappropriate Content">Inappropriate Content / Spam</option>
              <option value="Duplicate Listing">Duplicate Listing</option>
              <option value="Unsafe or Illegal Item">Unsafe or Prohibited Item</option>
              <option value="Inaccurate Information">Inaccurate Information or Fake Location</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Additional Details</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the issue clearly for Katraj admin moderators..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Flag className="w-4 h-4" />
            <span>Submit Report</span>
          </button>
        </form>
      </div>
    </div>
  );
};
