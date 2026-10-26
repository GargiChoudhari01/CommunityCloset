import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import type { ResourceItem, User, BorrowRequest } from '../types';
import { storage } from '../services/storage';
import { reportError } from '../services/reportError';

interface BorrowRequestModalProps {
  item: ResourceItem | null;
  currentUser: User;
  onClose: () => void;
  onSubmitted: (tx: BorrowRequest) => void;
}

export const BorrowRequestModal: React.FC<BorrowRequestModalProps> = ({
  item,
  currentUser,
  onClose,
  onSubmitted
}) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + Math.max(0, Math.min(3, item?.maxDurationDays ?? 3)) * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (item.userId === currentUser.id) {
      reportError(new Error('You cannot borrow your own listing.'));
      return;
    }
    if ((item.type !== 'lend' && item.type !== 'borrow') || item.status !== 'available') {
      reportError(new Error('This listing is not currently available to borrow.'));
      return;
    }
    const requestedDays = (Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86400000;
    if (!Number.isFinite(requestedDays) || requestedDays < 0 || requestedDays > item.maxDurationDays) {
      reportError(new Error(`Choose a borrowing period of no more than ${item.maxDurationDays} days.`));
      return;
    }

    const newTx: BorrowRequest = {
      id: `req-${Date.now()}`,
      listingId: item.id,
      listingTitle: item.title,
      listingImage: item.images[0],
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      ownerId: item.userId,
      ownerName: item.ownerName,
      borrowerId: currentUser.id,
      borrowerName: currentUser.name,
      lenderId: item.userId,
      lenderName: item.ownerName,
      type: 'borrow',
      status: 'pending',
      startDate,
      endDate,
      depositPaid: item.depositAmount,
      notes,
      createdAt: new Date().toISOString()
    };

    try {
      await storage.addTransaction(newTx);
      await storage.addNotification({
        id: `notif-${Date.now()}`,
        userId: item.userId,
        type: 'request',
        title: 'New Borrow Request',
        message: `${currentUser.name} requested to borrow "${item.title}"`,
        link: '#transactions',
        readStatus: false,
        timestamp: new Date().toISOString()
      });
      onSubmitted(newTx);
      onClose();
    } catch (error) {
      reportError(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#FFC0CB] relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-all text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-16 h-16 rounded-2xl object-cover border border-[#FFC0CB]"
          />
          <div>
            <span className="text-[10px] font-bold uppercase bg-[#FFF0F5] text-[#900C3F] px-2 py-0.5 rounded-md">
              {item.type === 'lend' || item.type === 'borrow' ? 'Borrow Listing' : 'Material Exchange'}
            </span>
            <h3 className="font-extrabold text-gray-900 text-lg line-clamp-1">{item.title}</h3>
            <p className="text-xs text-gray-500">Lender: {item.ownerName} ({item.locationName})</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                required
                min={startDate}
                max={startDate
                  ? new Date(Date.parse(`${startDate}T00:00:00Z`) + item.maxDurationDays * 86400000).toISOString().split('T')[0]
                  : undefined}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Note for Lender</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Need this tool for drilling wall curtain rods in Katraj..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            />
          </div>

          <div className="bg-[#FFF0F5] p-3 rounded-2xl border border-[#FFC0CB]/60 flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">
              Security Deposit · Up to {item.maxDurationDays} days
            </span>
            <span className="font-extrabold text-[#900C3F] text-sm">
              {item.depositAmount > 0 ? `₹${item.depositAmount}` : 'No Deposit (Free)'}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#900C3F] hover:bg-[#700931] text-white font-extrabold py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Request</span>
          </button>
        </form>
      </div>
    </div>
  );
};
