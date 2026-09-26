import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Star } from 'lucide-react';
import type { BorrowRequest, User } from '../types';
import { storage } from '../services/storage';
import { ReviewModal } from '../components/ReviewModal';

interface TransactionsPageProps {
  currentUser: User;
  transactions: BorrowRequest[];
  onNavigate: (path: string) => void;
  onRefresh: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  currentUser,
  transactions,
  onNavigate,
  onRefresh
}) => {
  const [selectedReviewTx, setSelectedReviewTx] = useState<BorrowRequest | null>(null);

  const handleUpdateStatus = (id: string, status: BorrowRequest['status']) => {
    storage.updateTransaction(id, status);
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Borrow & Lend Transactions</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage your active resource borrows, approve requests, and confirm item returns.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#FFC0CB]/60 shadow-sm">
          <p className="text-xs text-gray-500">No active transactions in Katraj yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => {
            const ownerId = tx.ownerId || tx.lenderId;
            const isLender = ownerId === currentUser.id;
            const borrowerName = tx.requesterName || tx.borrowerName || 'Neighbor';
            const lenderName = tx.ownerName || tx.lenderName || 'Neighbor';

            return (
              <div
                key={tx.id}
                className="bg-white p-6 rounded-3xl border border-[#FFC0CB]/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={tx.listingImage || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=300&q=80'}
                    alt={tx.listingTitle}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#FFC0CB]"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-extrabold uppercase bg-[#FFF0F5] text-[#900C3F] px-2 py-0.5 rounded-md">
                        {isLender ? 'Your Item (Lending)' : 'Borrowed Item'}
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        Status: <strong className="text-gray-900 uppercase">{tx.status}</strong>
                      </span>
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-lg mt-0.5">{tx.listingTitle}</h3>
                    <p className="text-xs text-gray-500">
                      {isLender ? `Borrower: ${borrowerName}` : `Lender: ${lenderName}`} | Dates: {tx.startDate} to {tx.endDate}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 w-full md:w-auto">
                  {tx.status === 'pending' && isLender && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(tx.id, 'accepted')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition-all"
                      >
                        Approve Request
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(tx.id, 'declined')}
                        className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {(tx.status === 'accepted' || tx.status === 'pending' || tx.status === 'active') && (
                    <button
                      onClick={() => handleUpdateStatus(tx.id, 'completed')}
                      className="bg-[#900C3F] hover:bg-[#700931] text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition-all flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Return</span>
                    </button>
                  )}

                  {tx.status === 'completed' && (
                    <button
                      onClick={() => setSelectedReviewTx(tx)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow transition-all flex items-center space-x-1"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Leave Review</span>
                    </button>
                  )}

                  <button
                    onClick={() => onNavigate('#messages')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl transition-all"
                    title="Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedReviewTx && (
        <ReviewModal
          request={selectedReviewTx}
          currentUser={currentUser}
          onClose={() => setSelectedReviewTx(null)}
          onSubmitted={() => onRefresh()}
        />
      )}
    </div>
  );
};
