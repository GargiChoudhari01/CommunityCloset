import React, { useState } from 'react';
import type { ResourceItem } from '../types';
import { Hammer, CheckCircle2, XCircle, ArrowRight, ShieldCheck, IndianRupee } from 'lucide-react';

interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  checklist: string[];
}

// Static, human-written project reference lists (No AI generation)
const STATIC_PROJECTS: ProjectTemplate[] = [
  {
    id: 'proj-1',
    name: 'Katraj Terrace Organic Garden Bed',
    category: 'Gardening & Outdoor',
    description: 'Build an eco-friendly raised vegetable & flower bed on your terrace or balcony.',
    checklist: ['Shovel', 'Hose', 'Lawn', 'Plank', 'Spade']
  },
  {
    id: 'proj-2',
    name: 'Wall Shelving & Modular Rack Setup',
    category: 'DIY Woodworking',
    description: 'Mount sturdy wooden shelves in your living room or kitchen using borrowed power tools.',
    checklist: ['Drill', 'Wood', 'Ladder', 'Screws', 'Plywood']
  },
  {
    id: 'proj-3',
    name: 'Home Interior Painting & Touchup',
    category: 'Painting & Masonry',
    description: 'Refresh your apartment walls with borrowed ladders, rollers, and paint drop cloths.',
    checklist: ['Ladder', 'Brush', 'Paint', 'Tray', 'Trowel']
  },
  {
    id: 'proj-4',
    name: 'Baby Nursery & Safety Setup',
    category: 'Baby & Nursery',
    description: 'Set up a comfortable, safe space for your newborn with shared baby gear from Katraj parents.',
    checklist: ['Crib', 'Stroller', 'Chair', 'Gate', 'Baby']
  }
];

interface ProjectModePageProps {
  items: ResourceItem[];
  onNavigate: (path: string) => void;
}

export const ProjectModePage: React.FC<ProjectModePageProps> = ({ items, onNavigate }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');

  const activeProject = STATIC_PROJECTS.find(p => p.id === selectedProjectId) || STATIC_PROJECTS[0];

  // Evaluate static checklist against live real database items
  const evaluatedChecklist = activeProject.checklist.map(keyword => {
    const matchingItem = items.find(i => 
      i.title.toLowerCase().includes(keyword.toLowerCase()) || 
      i.description.toLowerCase().includes(keyword.toLowerCase()) ||
      i.category.toLowerCase().includes(keyword.toLowerCase())
    );
    return {
      keyword,
      isAvailable: !!matchingItem,
      matchedItem: matchingItem || null
    };
  });

  const availableCount = evaluatedChecklist.filter(c => c.isAvailable).length;
  const matchingItemsWithDeposit = evaluatedChecklist.filter(c => c.matchedItem && (c.matchedItem.depositAmount || 0) > 0);
  
  const computedSavings = matchingItemsWithDeposit.reduce((acc, curr) => acc + (curr.matchedItem?.depositAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#900C3F] via-[#A8144D] to-[#700931] text-white p-8 rounded-3xl shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase w-max border border-white/20">
          <Hammer className="w-3.5 h-3.5 text-[#FFB6C1]" />
          <span className="text-[#FFF0F5]">Static Project Reference Guide</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">Build Something in Katraj</h1>
        <p className="text-xs sm:text-sm text-[#FFC0CB] max-w-2xl leading-relaxed">
          Select a home DIY or gardening project below. We check our live database of real neighbor listings in Katraj to show what tools & materials are available nearby right now.
        </p>
      </div>

      {/* Project Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATIC_PROJECTS.map((proj) => {
          const isSelected = proj.id === selectedProjectId;
          return (
            <button
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`p-5 rounded-3xl text-left border transition-all ${
                isSelected
                  ? 'bg-white border-[#900C3F] shadow-lg ring-2 ring-[#FFC0CB]'
                  : 'bg-white/80 border-gray-200 hover:border-[#FFC0CB]'
              }`}
            >
              <span className="text-[10px] font-extrabold uppercase text-[#900C3F] tracking-wider block mb-1">
                {proj.category}
              </span>
              <h3 className="font-extrabold text-sm text-gray-900 leading-snug">{proj.name}</h3>
              <p className="text-[11px] text-gray-500 mt-2 line-clamp-2">{proj.description}</p>
            </button>
          );
        })}
      </div>

      {/* Evaluated Checklist Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FFC0CB]/60 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{activeProject.name} Checklist</h2>
            <p className="text-xs text-gray-500 mt-1">Cross-referenced against live Katraj neighbor listings</p>
          </div>

          <div className="flex items-center space-x-3 bg-[#FFF0F5] px-4 py-2 rounded-2xl border border-[#FFC0CB]">
            <ShieldCheck className="w-5 h-5 text-[#900C3F]" />
            <div className="text-right">
              <span className="text-xs font-black text-[#900C3F] block">
                {availableCount} of {evaluatedChecklist.length} Items Available
              </span>
              <span className="text-[10px] text-gray-500 font-medium">Real live inventory</span>
            </div>
          </div>
        </div>

        {/* Live Matching Items List */}
        <div className="space-y-4">
          {evaluatedChecklist.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.isAvailable
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.isAvailable ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 capitalize">
                    {item.keyword} Requirement
                  </h4>
                  {item.isAvailable && item.matchedItem ? (
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                      Available: <span className="underline">{item.matchedItem.title}</span> (Lender: {item.matchedItem.ownerName || 'Katraj Resident'})
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Not available nearby in Katraj database yet. Be the first to share one!
                    </p>
                  )}
                </div>
              </div>

              {item.isAvailable && item.matchedItem ? (
                <button
                  onClick={() => onNavigate(`#item/${item.matchedItem?.id}`)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>View & Borrow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('#create-listing')}
                  className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs px-3 py-2 rounded-xl transition-all"
                >
                  + Add This Listing
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Real Savings Estimate */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-2">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-[#900C3F]" />
            <span>
              Estimated Community Savings from Live Matches:{' '}
              <strong className="text-gray-900 font-black">
                {computedSavings > 0 ? `₹${computedSavings.toLocaleString('en-IN')}` : 'No matching listings available in Katraj yet to compute savings'}
              </strong>
            </span>
          </div>
          <span className="text-[11px] text-gray-400">Zero AI generated calculations</span>
        </div>

      </div>

    </div>
  );
};
