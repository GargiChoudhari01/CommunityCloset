import React from 'react';
import type { ResourceItem } from '../types';
import { Sparkles } from 'lucide-react';

interface ProjectModePageProps {
  items: ResourceItem[];
  onNavigate: (path: string) => void;
}

export const ProjectModePage: React.FC<ProjectModePageProps> = ({ items, onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-8 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase w-max">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Katraj DIY Project Assistant</span>
        </div>
        <h1 className="text-3xl font-black">Build Something Together</h1>
        <p className="text-xs text-purple-200">
          Find all required tools and leftover materials for Katraj home improvement projects in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-3xl border border-purple-100 shadow-sm space-y-3">
            <img src={item.images[0]} alt={item.title} className="w-full h-36 object-cover rounded-2xl" />
            <h3 className="font-extrabold text-sm text-gray-900">{item.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
            <button
              onClick={() => onNavigate(`#item/${item.id}`)}
              className="w-full bg-purple-700 text-white text-xs font-bold py-2 rounded-xl"
            >
              Request for Project
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
