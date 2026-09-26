import React, { useState } from 'react';
import { Search, ArrowRight, PackageOpen, MapPin, Plus } from 'lucide-react';
import type { ResourceItem, Category, User } from '../types';
import { ItemCard } from '../components/ItemCard';

interface HomePageProps {
  user: User;
  items: ResourceItem[];
  categories: Category[];
  wishlistIds: string[];
  onNavigate: (path: string) => void;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  items,
  categories,
  wishlistIds,
  onNavigate,
  onToggleWishlist
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Live database keyword matching (NO AI/LLM)
  const matchedListings = searchQuery.trim()
    ? items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.locationName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setHasSearched(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#FFF0F5] via-[#FFE4E1] to-[#FFF0F5] p-6 sm:p-8 rounded-3xl border border-[#FFC0CB] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-extrabold uppercase text-[#900C3F] bg-white px-3 py-1 rounded-full border border-[#FFC0CB]">
            Katraj Community Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Neighbourhood: <strong className="text-gray-900">{user.locationAddress || 'Katraj, Pune'}</strong> • Member since {new Date(user.createdAt || Date.now()).getFullYear()}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('#create-listing')}
            className="bg-[#900C3F] hover:bg-[#700931] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow hover:shadow-md transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post Listing</span>
          </button>
          <button
            onClick={() => onNavigate('#map')}
            className="bg-white text-[#900C3F] border border-[#FFC0CB] px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-[#FFF0F5] transition-all flex items-center space-x-1.5"
          >
            <MapPin className="w-4 h-4 text-[#E86F88]" />
            <span>Katraj Map</span>
          </button>
        </div>
      </div>

      {/* "I Need..." Search Widget (Real DB Keyword Search - No AI/LLM) */}
      <div className="bg-white p-6 rounded-3xl border border-[#FFC0CB]/80 shadow-md space-y-4">
        <div>
          <h2 className="font-extrabold text-gray-900 text-lg">"I Need..." Resource Finder</h2>
          <p className="text-xs text-gray-500">
            Search live Katraj database listings by keyword (e.g., "drill", "ladder", "plywood", "gardening").
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHasSearched(false);
              }}
              placeholder="What tool or material do you need today?"
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#900C3F] hover:bg-[#700931] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow transition-all flex items-center justify-center space-x-1"
          >
            <span>Search Live DB</span>
          </button>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {matchedListings.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-700">
                  Found {matchedListings.length} matching live listing(s) in Katraj:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedListings.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      isWishlisted={wishlistIds.includes(item.id)}
                      onToggleWishlist={onToggleWishlist}
                      onClick={(id) => onNavigate(`#item/${id}`)}
                      onQuickBorrow={() => onNavigate(`#item/${item.id}`)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#FFF0F5] p-6 rounded-2xl border border-[#FFC0CB] text-center space-y-2">
                <PackageOpen className="w-8 h-8 text-[#900C3F] mx-auto" />
                <h4 className="font-extrabold text-sm text-gray-900">
                  No matching real listings found for "{searchQuery}"
                </h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Be the first member in Katraj to list this resource, or ask neighbors in the community!
                </p>
                <button
                  onClick={() => onNavigate('#create-listing')}
                  className="bg-[#900C3F] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:brightness-110 transition-all inline-block mt-1"
                >
                  + Create First Listing
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Chips */}
      <div>
        <h2 className="text-lg font-extrabold text-gray-900 mb-4">Resource Taxonomy Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('#explore')}
              className="bg-white p-3 rounded-2xl border border-[#FFC0CB]/60 hover:border-[#900C3F] hover:shadow-md transition-all text-center group"
            >
              <span className="font-extrabold text-xs text-gray-800 group-hover:text-[#900C3F] block">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Katraj Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">Recent Katraj Real Listings</h2>
          <button
            onClick={() => onNavigate('#explore')}
            className="text-xs font-bold text-[#900C3F] hover:underline flex items-center space-x-1"
          >
            <span>View All ({items.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#FFC0CB]/60 text-center space-y-3">
            <PackageOpen className="w-10 h-10 text-[#900C3F] mx-auto opacity-70" />
            <h3 className="text-base font-extrabold text-gray-900">No Listings Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Your Katraj closet is clean and ready. Click below to share the first resource with your neighbors!
            </p>
            <button
              onClick={() => onNavigate('#create-listing')}
              className="bg-[#900C3F] hover:bg-[#700931] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
            >
              + Post First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.slice(0, 4).map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isWishlisted={wishlistIds.includes(item.id)}
                onToggleWishlist={onToggleWishlist}
                onClick={(id) => onNavigate(`#item/${id}`)}
                onQuickBorrow={() => onNavigate(`#item/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
