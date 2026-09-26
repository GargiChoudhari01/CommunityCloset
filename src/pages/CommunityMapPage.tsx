import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { ResourceItem } from '../types';
import { MapPin, Plus, PackageOpen } from 'lucide-react';
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
            <h1 className="text-2xl font-black text-gray-900">Katraj Neighborhood Interactive Map</h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real OpenStreetMap view of shared tools & leftover materials in Katraj, Pune South.
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
                  {item.images && item.images[0] && (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-24 object-cover rounded-xl border border-[#FFC0CB]"
                    />
                  )}
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

        {/* Empty Map Pin Overlay */}
        {mapItems.length === 0 && (
          <div className="absolute inset-0 z-[1000] pointer-events-none flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-[#FFC0CB] shadow-2xl text-center space-y-3 max-w-sm pointer-events-auto">
              <PackageOpen className="w-10 h-10 text-[#900C3F] mx-auto" />
              <h3 className="font-extrabold text-gray-900 text-sm">No Active Pins on Katraj Map Yet</h3>
              <p className="text-xs text-gray-500">
                Be the first neighbor in Sukhsagar Nagar or Katraj Lake area to add a pin for your tool or material listing!
              </p>
              <button
                onClick={() => onNavigate('#create-listing')}
                className="bg-[#900C3F] hover:bg-[#700931] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Map Listing</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Listings Drawer */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-gray-900">Listings on Katraj Map ({mapItems.length})</h2>
        {mapItems.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-[#FFC0CB]/60 text-center space-y-2 text-xs text-gray-500">
            No listing cards to display. Add your first resource item to make it appear on the community map!
          </div>
        ) : (
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
        )}
      </div>

    </div>
  );
};
