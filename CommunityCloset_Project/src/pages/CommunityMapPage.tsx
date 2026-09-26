import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { ResourceItem } from '../types';
import { MapPin } from 'lucide-react';
import { ItemCard } from '../components/ItemCard';

interface CommunityMapPageProps {
  items: ResourceItem[];
  wishlistIds: string[];
  onNavigate: (path: string) => void;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
}

export const CommunityMapPage: React.FC<CommunityMapPageProps> = ({
  items,
  wishlistIds,
  onNavigate,
  onToggleWishlist
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'tool' | 'material'>('All');
  const katrajCenter: [number, number] = [18.4575, 73.8508];

  const mapItems = items.filter(
    (i) => selectedFilter === 'All' || i.itemKind === selectedFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#FFC0CB]/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#E86F88]" />
            <h1 className="text-2xl font-black text-gray-900">Katraj Neighborhood Map</h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Interactive map of shared tools & leftover materials in Katraj, Pune South.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#FFF0F5] p-1.5 rounded-2xl border border-[#FFC0CB]">
          {(['All', 'tool', 'material'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === filter
                  ? 'bg-[#900C3F] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-[#FFD1DC]/50'
              }`}
            >
              {filter === 'All' ? 'All Pins' : filter === 'tool' ? 'Tools Only' : 'Materials Only'}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="h-[550px] w-full rounded-3xl overflow-hidden border-2 border-[#FFC0CB] shadow-lg relative bg-pink-50">
        <MapContainer
          center={katrajCenter}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mapItems.map((item) => (
            <Marker key={item.id} position={[item.lat || 18.4575, item.lng || 73.8508]}>
              <Popup>
                <div className="p-2 max-w-[200px] space-y-2">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-24 object-cover rounded-xl border border-[#FFC0CB]"
                  />
                  <span className="text-[10px] font-extrabold text-[#900C3F] uppercase bg-[#FFF0F5] px-2 py-0.5 rounded-md block">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{item.locationName}</p>
                  <button
                    onClick={() => onNavigate(`#item/${item.id}`)}
                    className="w-full bg-[#900C3F] text-white text-[11px] font-bold py-1.5 rounded-lg shadow hover:bg-[#700931] transition-all"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map Listings Drawer */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-gray-900">Listings on this Map ({mapItems.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mapItems.map((item) => (
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
