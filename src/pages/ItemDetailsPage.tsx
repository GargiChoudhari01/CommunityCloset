import React, { useState } from 'react';
import { Heart, MapPin, ShieldCheck, Flag, ArrowLeft, Calendar, MessageSquare } from 'lucide-react';
import type { ResourceItem, User } from '../types';
import { BorrowRequestModal } from '../components/BorrowRequestModal';
import { ReportModal } from '../components/ReportModal';

interface ItemDetailsPageProps {
  item: ResourceItem | null;
  currentUser: User;
  isWishlisted: boolean;
  onNavigate: (path: string) => void;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
}

export const ItemDetailsPage: React.FC<ItemDetailsPageProps> = ({
  item,
  currentUser,
  isWishlisted,
  onNavigate,
  onToggleWishlist
}) => {
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">Item not found</h2>
        <button onClick={() => onNavigate('#explore')} className="text-sm font-bold text-[#900C3F] mt-2 underline">
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Back Button */}
      <button
        onClick={() => onNavigate('#explore')}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-[#900C3F] transition-all bg-white px-3.5 py-2 rounded-xl border border-[#FFC0CB]/60 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gallery */}
        <div className="space-y-4">
          <div className="h-96 w-full rounded-3xl overflow-hidden bg-gray-100 border border-[#FFC0CB]/60 relative shadow-sm">
            <img
              src={item.images[activeImageIndex] || item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => onToggleWishlist(item.id, e)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                isWishlisted ? 'bg-pink-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {item.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx ? 'border-[#900C3F] scale-105' : 'border-gray-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-[#FFF0F5] text-[#900C3F] text-xs font-bold px-3 py-1 rounded-full border border-[#FFC0CB]">
                {item.category}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                Condition: {item.condition}
              </span>
            </div>

            <h1 className="text-3xl font-black text-gray-900 leading-tight">{item.title}</h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-[#E86F88]" />
              <span>{item.locationName}</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#FFC0CB]/60 shadow-sm space-y-3">
            <h3 className="font-extrabold text-gray-900 text-sm">Item Overview</h3>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{item.description}</p>
          </div>

          {/* Pricing & Duration */}
          <div className="grid grid-cols-2 gap-4 bg-[#FFF0F5] p-5 rounded-3xl border border-[#FFC0CB]">
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase block">Security Deposit</span>
              <span className="text-xl font-black text-[#900C3F]">
                {item.depositAmount > 0 ? `₹${item.depositAmount}` : 'Free'}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase block">Max Borrow Duration</span>
              <span className="text-xl font-black text-gray-900">{item.maxDurationDays} Days</span>
            </div>
          </div>

          {/* Lender Info Card */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={item.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={item.ownerName}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#FFB6C1]"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{item.ownerName}</h4>
                <p className="text-xs text-emerald-700 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Katraj Lender ({item.ownerRating || 4.9} ★)</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('#messages')}
              className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
              title="Chat with Lender"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => setBorrowModalOpen(true)}
              className="flex-1 bg-[#900C3F] hover:bg-[#700931] text-white py-3.5 rounded-2xl font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Request to Borrow</span>
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="p-3.5 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 transition-all"
              title="Report Item"
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>

      {/* Modals */}
      {borrowModalOpen && (
        <BorrowRequestModal
          item={item}
          currentUser={currentUser}
          onClose={() => setBorrowModalOpen(false)}
          onSubmitted={() => onNavigate('#transactions')}
        />
      )}

      {reportModalOpen && (
        <ReportModal
          item={item}
          currentUser={currentUser}
          onClose={() => setReportModalOpen(false)}
          onReported={() => alert('Report submitted to Katraj admin moderators.')}
        />
      )}

    </div>
  );
};
