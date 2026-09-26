import React, { useState } from 'react';
import type { Category } from '../../types';
import { ArrowLeft } from 'lucide-react';
import { storage } from '../../services/storage';

interface AdminCategoriesPageProps {
  categories: Category[];
  onBack: () => void;
  onRefresh: () => void;
}

export const AdminCategoriesPage: React.FC<AdminCategoriesPageProps> = ({
  categories,
  onBack,
  onRefresh
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'tool' | 'material'>('tool');
  const [description, setDescription] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      type,
      icon: 'Tag',
      description
    };
    storage.saveCategories([...categories, newCat]);
    setName('');
    setDescription('');
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <button onClick={onBack} className="inline-flex items-center space-x-1 text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      <h1 className="text-2xl font-black text-gray-900">Category CRUD Manager ({categories.length})</h1>

      <form onSubmit={handleAdd} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 max-w-lg">
        <h3 className="font-extrabold text-sm text-gray-900">Add New Category</h3>
        <input
          type="text"
          required
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
        />
        <select
          value={type}
          onChange={(e: any) => setType(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
        >
          <option value="tool">Resource Library Tool</option>
          <option value="material">Material Exchange Material</option>
        </select>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
        />
        <button type="submit" className="bg-purple-700 text-white font-bold py-2 px-4 rounded-xl text-xs">
          Add Category
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
              {c.type}
            </span>
            <h4 className="font-extrabold text-sm text-gray-900 mt-1">{c.name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
