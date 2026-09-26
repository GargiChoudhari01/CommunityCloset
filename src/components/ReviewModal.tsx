import React, { useState } from 'react';
import { X, Star, CheckCircle } from 'lucide-react';
import type { Review, User, BorrowRequest } from '../types';
import { storage } from '../services/storage';

interface ReviewModalProps {
  request: BorrowRequest | null;
  currentUser: User;
  onClose: () => void;
  onSubmitted: (review: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  request,
  currentUser,
  onClose,
  onSubmitted
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  if (!request) return null;

  const isLender = request.ownerId === currentUser.id;
  const revieweeId = isLender ? request.requesterId : request.ownerId;
  const revieweeName = isLender ? request.requesterName : request.ownerName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      listingId: request.listingId,
      listingTitle: request.listingTitle,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatar,
      revieweeId,
      revieweeName,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    storage.addReview(newReview);
    onSubmitted(newReview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#FFC0CB] relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-extrabold text-gray-900">Leave a Review</h2>
          <p className="text-xs text-gray-500 mt-1">Rate your experience with {revieweeName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Star Rating Picker */}
          <div className="flex items-center justify-center space-x-1 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Your Review Comment</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Was the tool clean? Was pickup punctual in Katraj?"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#900C3F]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#900C3F] hover:bg-[#700931] text-white font-extrabold py-3 rounded-xl text-xs shadow transition-all flex items-center justify-center space-x-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Submit Rating & Review</span>
          </button>
        </form>
      </div>
    </div>
  );
};
