import React from 'react';
import { Heart, MapPin, Eye, ArrowRight } from 'lucide-react';
import type { ResourceItem } from '../types';

interface ItemCardProps {
  item: ResourceItem;
  isWishlisted: boolean;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
  onClick: (id: string) => void;
  onQuickBorrow?: (item: ResourceItem, e: React.MouseEvent) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isWishlisted,
  onToggleWishlist,
  onClick,
  onQuickBorrow
}) => {
  return (
    <div
      onClick={() => onClick(item.id)}
      className="group bg-white rounded-2xl border border-[#FFC0CB]/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col overflow-hidden relative"
    >
      {/* Item Image & Badge overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={item.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
        />

        {/* Wishlist Heart */}
        <button
          onClick={(e) => onToggleWishlist(item.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
            isWishlisted ? 'bg-pink-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white hover:text-pink-500'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Item Type Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1">
          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm text-white ${
            item.type === 'lend' ? 'bg-[#900C3F]' : item.type === 'giveaway' ? 'bg-emerald-600' : 'bg-indigo-600'
          }`}>
            {item.type === 'lend' ? 'Resource Library' : item.type === 'giveaway' ? 'Free Material' : 'Exchange'}
          </span>
        </div>

        {/* Condition Tag */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[11px] font-semibold text-gray-700 shadow-sm border border-white/50">
          {item.condition}
        </div>
      </div>

      {/* Item Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-[#900C3F] bg-[#FFF0F5] px-2 py-0.5 rounded-md">{item.category}</span>
            <span className="flex items-center text-gray-500 space-x-1"><Eye className="w-3 h-3" /><span>{item.viewsCount} views</span></span>
          </div>

          <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-[#900C3F] transition-colors">
            {item.title}
          </h3>

          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
            {item.description}
          </p>
        </div>

        {/* Owner & Location info */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={item.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={item.ownerName}
              className="w-6 h-6 rounded-full object-cover border border-[#FFB6C1]"
            />
            <span className="text-xs font-medium text-gray-700 truncate max-w-[110px]">{item.ownerName}</span>
          </div>

          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-[#E86F88]" />
            <span className="truncate max-w-[100px]">Katraj</span>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Deposit</span>
            <span className="text-sm font-extrabold text-gray-900">
              {item.depositAmount > 0 ? `₹${item.depositAmount}` : 'Free'}
            </span>
          </div>

          {onQuickBorrow && (
            <button
              onClick={(e) => onQuickBorrow(item, e)}
              className="bg-[#FFF0F5] hover:bg-[#FFD1DC] text-[#900C3F] px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
            >
              <span>Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
