import React, { useState } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import type { ResourceItem, User, Category } from '../types';
import { storage } from '../services/storage';
import { aiService } from '../services/aiService';

interface AddItemPageProps {
  currentUser: User;
  categories: Category[];
  onNavigate: (path: string) => void;
  onAdded: (newItem: ResourceItem) => void;
}

export const AddItemPage: React.FC<AddItemPageProps> = ({
  currentUser,
  categories,
  onNavigate,
  onAdded
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Power Tools');
  const [itemKind] = useState<'tool' | 'material'>('tool');
  const [type, setType] = useState<'lend' | 'giveaway' | 'exchange'>('lend');
  const [condition, setCondition] = useState<'Like New' | 'Good' | 'Fair'>('Good');
  const [depositAmount, setDepositAmount] = useState(300);
  const [maxDurationDays] = useState(5);
  const [locationName, setLocationName] = useState('Rajiv Gandhi Zoo Circle, Katraj, Pune');
  const [imageUrl, setImageUrl] = useState('');
  const [aiEnhancing, setAiEnhancing] = useState(false);

  const handleAiEnhance = async () => {
    if (!title) return;
    setAiEnhancing(true);
    try {
      const enhanced = await aiService.enhanceDescription(title, category, description);
      setDescription(enhanced);
    } catch {
      //
    } finally {
      setAiEnhancing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ResourceItem = {
      id: `item-${Date.now()}`,
      userId: currentUser.id,
      title,
      description,
      category,
      itemKind,
      type,
      status: 'available',
      condition,
      depositAmount: Number(depositAmount),
      maxDurationDays: Number(maxDurationDays),
      locationName,
      lat: 18.4575,
      lng: 73.8508,
      images: [imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
      featured: false,
      viewsCount: 0,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      ownerRating: 5.0,
      createdAt: new Date().toISOString()
    };

    storage.addItem(newItem);
    onAdded(newItem);
    onNavigate(`#item/${newItem.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      <button
        onClick={() => onNavigate('#explore')}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-[#900C3F] bg-white px-3.5 py-2 rounded-xl border border-[#FFC0CB]/60 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel</span>
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FFC0CB]/80 shadow-md space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">List an Item in Katraj Closet</h1>
          <p className="text-xs text-gray-500 mt-1">Lend a rarely used tool or offer leftover construction materials to neighbors.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Item Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bosch Cordless Impact Drill 18V"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Listing Type</label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#900C3F]"
              >
                <option value="lend">Resource Library (Lend)</option>
                <option value="giveaway">Material Exchange (Free)</option>
                <option value="exchange">Trade & Swap</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e: any) => setCondition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#900C3F]"
              >
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Deposit (₹)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#900C3F]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">Item Description</label>
              <button
                type="button"
                onClick={handleAiEnhance}
                disabled={aiEnhancing || !title}
                className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 hover:bg-purple-100 transition-all flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>{aiEnhancing ? 'Enhancing...' : 'AI Description Polish'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, included accessories, or pickup details in Katraj..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Katraj Location / Pickup Point</label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#900C3F] hover:bg-[#700931] text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-md transition-all"
          >
            Publish Listing
          </button>

        </form>
      </div>

    </div>
  );
};
