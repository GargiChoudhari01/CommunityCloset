import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import type { ResourceItem } from '../types';
import { ItemCard } from '../components/ItemCard';

interface WishlistPageProps {
  wishlistedItems: ResourceItem[];
  wishlistIds: string[];
  onNavigate: (path: string) => void;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlistedItems,
  onNavigate,
  onToggleWishlist
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center space-x-2">
          <Heart className="w-6 h-6 text-[#E86F88] fill-current" />
          <h1 className="text-3xl font-black text-gray-900">Your Saved Wishlist ({wishlistedItems.length})</h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Keep track of tools and materials in Katraj you plan to borrow for upcoming home projects.
        </p>
      </div>

      {wishlistedItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#FFC0CB]/60 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF0F5] text-[#900C3F] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-lg">Your Wishlist is Empty</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Browse the Katraj resource library and click the heart icon on any item to save it here!
          </p>
          <button
            onClick={() => onNavigate('#explore')}
            className="bg-[#900C3F] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-[#700931] transition-all inline-flex items-center space-x-1"
          >
            <span>Browse Library</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isWishlisted={true}
              onToggleWishlist={onToggleWishlist}
              onClick={(id) => onNavigate(`#item/${id}`)}
              onQuickBorrow={() => onNavigate(`#item/${item.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
