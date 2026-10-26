import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import type { ResourceItem, Category, ResourceType } from '../types';
import { storage } from '../services/storage';
import { reportError } from '../services/reportError';

interface EditListingPageProps {
  itemId: string;
  categories: Category[];
  onNavigate: (path: string) => void;
  onUpdated: () => void;
}

export const EditListingPage: React.FC<EditListingPageProps> = ({
  itemId,
  categories,
  onNavigate,
  onUpdated
}) => {
  const [item, setItem] = useState<ResourceItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<ResourceType>('lend');
  const [condition, setCondition] = useState<'Like New' | 'Good' | 'Fair'>('Good');
  const [depositAmount, setDepositAmount] = useState(0);
  const [maxDurationDays, setMaxDurationDays] = useState(5);
  const [salePrice, setSalePrice] = useState('');
  const [exchangePreference, setExchangePreference] = useState('');
  const isBorrowListing = type === 'lend' || type === 'borrow';

  useEffect(() => {
    const items = storage.getItems();
    const found = items.find(i => i.id === itemId);
    if (found) {
      setItem(found);
      setTitle(found.title);
      setDescription(found.description);
      setCategory(found.category);
      setType(found.type);
      setCondition(found.condition);
      setDepositAmount(found.depositAmount);
      setMaxDurationDays(found.maxDurationDays);
      setSalePrice(found.salePrice === undefined ? '' : String(found.salePrice));
      setExchangePreference(found.exchangePreference || '');
    }
  }, [itemId]);

  if (!item) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-gray-500">Listing not found.</p>
        <button onClick={() => onNavigate('#explore')} className="text-xs font-bold text-[#900C3F] mt-2 underline">
          Back to Explore
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await storage.updateItem(item.id, {
        title,
        description,
        category,
        type,
        condition,
        depositAmount: isBorrowListing ? Number(depositAmount) : 0,
        maxDurationDays: isBorrowListing ? Number(maxDurationDays) : 0,
        salePrice: type === 'sale' ? Number(salePrice) : undefined,
        exchangePreference: type === 'exchange' ? exchangePreference.trim() : undefined,
      });
      onUpdated();
      onNavigate(`#item/${item.id}`);
    } catch (error) {
      reportError(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <button
        onClick={() => onNavigate(`#item/${item.id}`)}
        className="inline-flex items-center space-x-1 text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel</span>
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FFC0CB] shadow-sm space-y-6">
        <h1 className="text-2xl font-black text-gray-900">Edit Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Listing Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ResourceType)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            >
              <option value="lend">Lend</option>
              <option value="borrow">Borrow</option>
              <option value="giveaway">Giveaway</option>
              <option value="donate">Donate</option>
              <option value="exchange">Exchange</option>
              <option value="sale">For Sale</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            />
          </div>

          {isBorrowListing && <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as 'Like New' | 'Good' | 'Fair')}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#900C3F]"
              >
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                min="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#900C3F]"
              />
            </div>
          </div>}

          {!isBorrowListing && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as 'Like New' | 'Good' | 'Fair')}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#900C3F]"
              >
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          )}

          {isBorrowListing && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Maximum Borrow Duration (days)</label>
              <input
                type="number"
                min="1"
                required
                value={maxDurationDays}
                onChange={(e) => setMaxDurationDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#900C3F]"
              />
            </div>
          )}

          {type === 'sale' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Sale Price (₹)</label>
              <input
                type="number"
                min="0"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#900C3F]"
              />
            </div>
          )}

          {type === 'exchange' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">What would you like in exchange?</label>
              <input
                type="text"
                required
                value={exchangePreference}
                onChange={(e) => setExchangePreference(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#900C3F] hover:bg-[#700931] text-white font-extrabold py-3 rounded-xl text-sm shadow transition-all flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};
