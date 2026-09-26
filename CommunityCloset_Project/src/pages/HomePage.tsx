import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { ResourceItem, Category, User } from '../types';
import { ItemCard } from '../components/ItemCard';
import { aiService } from '../services/aiService';

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
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const handleAiMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await aiService.matchNeed(aiPrompt);
      setAiResult(res);
    } catch {
      //
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#FFF0F5] to-[#FFE4E1] p-6 sm:p-8 rounded-3xl border border-[#FFC0CB] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase text-[#900C3F] bg-white px-3 py-1 rounded-full border border-[#FFC0CB]">
            Katraj Community Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            You have earned <strong className="text-[#900C3F]">{user.ecoPoints} eco-points</strong> and prevented <strong>{user.co2SavedKg} kg CO₂</strong> in Katraj!
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('#create-listing')}
            className="bg-[#900C3F] hover:bg-[#700931] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow hover:shadow-md transition-all flex items-center space-x-1.5"
          >
            <span>+ Share Item</span>
          </button>
          <button
            onClick={() => onNavigate('#map')}
            className="bg-white text-[#900C3F] border border-[#FFC0CB] px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            Katraj Map
          </button>
        </div>
      </div>

      {/* AI Smart Need Matcher */}
      <div className="bg-white p-6 rounded-3xl border border-[#FFC0CB]/80 shadow-md space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-gray-900 text-lg">Smart Need Matcher AI</h2>
            <p className="text-xs text-gray-500">Describe your project (e.g. "Mounting a TV in Katraj Lake View") and get matched tools!</p>
          </div>
        </div>

        <form onSubmit={handleAiMatch} className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="What project are you building today?"
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
          />
          <button
            type="submit"
            disabled={aiLoading}
            className="bg-[#900C3F] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow hover:brightness-110 transition-all flex items-center space-x-1"
          >
            <span>{aiLoading ? 'Matching...' : 'Ask AI'}</span>
          </button>
        </form>

        {aiResult && (
          <div className="bg-[#FFF0F5] p-4 rounded-2xl border border-[#FFC0CB] space-y-3 mt-3 animate-fade-in">
            <p className="text-xs font-semibold text-gray-800">{aiResult.summary}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {aiResult.recommendedItems.map((rec: any) => (
                <div
                  key={rec.id}
                  onClick={() => onNavigate(`#item/${rec.id}`)}
                  className="bg-white p-3 rounded-xl border border-[#FFC0CB]/60 hover:shadow-md transition-all cursor-pointer"
                >
                  <p className="font-bold text-xs text-[#900C3F]">{rec.title}</p>
                  <p className="text-[11px] text-gray-500">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Chips */}
      <div>
        <h2 className="text-lg font-extrabold text-gray-900 mb-4">Popular Resource Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('#explore')}
              className="bg-white p-3.5 rounded-2xl border border-[#FFC0CB]/60 hover:border-[#900C3F] hover:shadow-md transition-all text-left group"
            >
              <span className="font-bold text-xs text-gray-800 group-hover:text-[#900C3F] block">{cat.name}</span>
              <span className="text-[10px] text-gray-400 capitalize block mt-0.5">{cat.type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Katraj Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">Recent Katraj Listings</h2>
          <button
            onClick={() => onNavigate('#explore')}
            className="text-xs font-bold text-[#900C3F] hover:underline flex items-center space-x-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

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
      </div>

    </div>
  );
};
