import React from 'react';
import type { ResourceItem } from '../../types';
import { ArrowLeft, Trash2, Star } from 'lucide-react';
import { storage } from '../../services/storage';

interface AdminListingsPageProps {
  items: ResourceItem[];
  onBack: () => void;
  onRefresh: () => void;
}

export const AdminListingsPage: React.FC<AdminListingsPageProps> = ({ items, onBack, onRefresh }) => {
  const handleDelete = (id: string) => {
    storage.deleteItem(id);
    onRefresh();
  };

  const handleToggleFeatured = (item: ResourceItem) => {
    storage.updateItem(item.id, { featured: !item.featured });
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <button onClick={onBack} className="inline-flex items-center space-x-1 text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      <h1 className="text-2xl font-black text-gray-900">Listing Moderation ({items.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i) => (
          <div key={i.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex space-x-3">
            <img src={i.images[0]} alt={i.title} className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1 space-y-1">
              <span className="text-[10px] font-bold uppercase bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
                {i.category}
              </span>
              <h4 className="font-extrabold text-xs text-gray-900 line-clamp-1">{i.title}</h4>
              <p className="text-[11px] text-gray-500">Owner: {i.ownerName}</p>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => handleToggleFeatured(i)}
                  className={`p-1.5 rounded-lg border text-xs font-bold ${
                    i.featured ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-gray-50 text-gray-600'
                  }`}
                  title="Toggle Featured"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  onClick={() => handleDelete(i.id)}
                  className="p-1.5 rounded-lg border bg-red-50 text-red-600 border-red-200"
                  title="Remove Listing"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
