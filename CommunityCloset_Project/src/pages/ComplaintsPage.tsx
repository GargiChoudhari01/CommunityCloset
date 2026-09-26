import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Complaint, User } from '../types';
import { storage } from '../services/storage';

interface ComplaintsPageProps {
  currentUser: User;
  complaints: Complaint[];
  onSubmitted: () => void;
}

export const ComplaintsPage: React.FC<ComplaintsPageProps> = ({
  currentUser,
  complaints,
  onSubmitted
}) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCmp: Complaint = {
      id: `cmp-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      subject,
      description,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    storage.addComplaint(newCmp);
    setSubject('');
    setDescription('');
    setShowForm(false);
    onSubmitted();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Complaints & Disputes</h1>
          <p className="text-xs text-gray-500 mt-1">Submit non-returned items, damaged goods, or community policy concerns.</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow transition-all flex items-center space-x-1"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Dispute Ticket</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-red-200 shadow-md space-y-4 animate-fade-in">
          <h3 className="font-extrabold text-gray-900 text-base">Submit Dispute to Katraj Admin</h3>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Item not returned on agreed date"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Details</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide transaction details, dates, and what assistance is required..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs shadow"
          >
            Submit Dispute
          </button>
        </form>
      )}

      {/* Complaints list */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-gray-900">Your Tickets ({complaints.length})</h2>
        {complaints.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-gray-200">
            <p className="text-xs text-gray-400">No active complaints submitted.</p>
          </div>
        ) : (
          complaints.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-gray-900">{c.subject}</h4>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                  {c.status}
                </span>
              </div>
              <p className="text-xs text-gray-600">{c.description}</p>
              {c.adminNotes && (
                <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-xs text-purple-900 font-medium">
                  <strong>Katraj Admin Note:</strong> {c.adminNotes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
