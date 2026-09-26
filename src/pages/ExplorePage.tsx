import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { ResourceItem, Category } from '../types';
import { ItemCard } from '../components/ItemCard';

interface ExplorePageProps {
  items: ResourceItem[];
  categories: Category[];
  wishlistIds: string[];
  onNavigate: (path: string) => void;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  items,
  categories,
  wishlistIds,
  onNavigate,
  onToggleWishlist
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.locationName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesType =
        selectedType === 'All' || item.type === selectedType;

      const matchesCondition =
        selectedCondition === 'All' || item.condition === selectedCondition;

      return matchesSearch && matchesCategory && matchesType && matchesCondition;
    });
  }, [items, searchTerm, selectedCategory, selectedType, selectedCondition]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Browse Katraj Community Resource Library</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Explore tools, equipment, and leftover building materials available in Katraj, Pune.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#FFC0CB]/80 shadow-sm space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tools, materials, or Katraj addresses..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#900C3F] bg-gray-50/50"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-[#900C3F]"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-[#900C3F]"
            >
              <option value="All">All Types (Lend & Giveaway)</option>
              <option value="lend">Resource Library (Lend)</option>
              <option value="giveaway">Material Exchange (Free)</option>
              <option value="exchange">Trade & Swap</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Condition</label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-[#900C3F]"
            >
              <option value="All">All Conditions</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

        </div>

      </div>

      {/* Item Catalog Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#FFC0CB]/60 p-8 space-y-3">
          <p className="text-gray-500 text-sm">No listings found matching your search filters in Katraj.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedType('All');
              setSelectedCondition('All');
            }}
            className="text-xs font-bold text-[#900C3F] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
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
  );
};
