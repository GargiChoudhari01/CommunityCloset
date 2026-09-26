import React, { useState } from 'react';
import type { User, ResourceItem } from '../types';
import { Edit3, MapPin, PlusCircle } from 'lucide-react';
import { EditProfileModal } from '../components/EditProfileModal';
import { ItemCard } from '../components/ItemCard';

interface ProfilePageProps {
  user: User;
  userListings: ResourceItem[];
  wishlistIds: string[];
  onNavigate: (path: string) => void;
  onUpdateUser: (updated: User) => void;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  userListings,
  wishlistIds,
  onNavigate,
  onUpdateUser,
  onToggleWishlist
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FFC0CB]/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-[#FFB6C1] shadow"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
              <span className="bg-[#FFF0F5] text-[#900C3F] text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-[#FFC0CB]">
                Katraj Resident
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#E86F88]" />
              <span>{user.locationAddress}</span>
            </p>
            <p className="text-xs text-gray-600 mt-2 max-w-md">{user.bio || 'Sharing tools & building community in Katraj!'}</p>
          </div>
        </div>

        <button
          onClick={() => setEditModalOpen(true)}
          className="bg-white border border-[#FFC0CB] text-[#900C3F] hover:bg-[#FFF0F5] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFF0F5] p-5 rounded-3xl border border-[#FFC0CB]">
          <span className="text-[11px] font-bold text-[#900C3F] uppercase block">Eco-Points Earned</span>
          <span className="text-3xl font-black text-gray-900">{user.ecoPoints}</span>
        </div>
        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-800 uppercase block">CO₂ Offset</span>
          <span className="text-3xl font-black text-emerald-900">{user.co2SavedKg} kg</span>
        </div>
        <div className="bg-purple-50 p-5 rounded-3xl border border-purple-200">
          <span className="text-[11px] font-bold text-purple-800 uppercase block">Active Listings</span>
          <span className="text-3xl font-black text-purple-900">{userListings.length}</span>
        </div>
      </div>

      {/* User's Active Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">Your Shared Listings ({userListings.length})</h2>
          <button
            onClick={() => onNavigate('#create-listing')}
            className="bg-[#900C3F] text-white text-xs font-bold px-4 py-2 rounded-xl shadow hover:bg-[#700931] transition-all flex items-center space-x-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Item</span>
          </button>
        </div>

        {userListings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#FFC0CB]/60">
            <p className="text-xs text-gray-500">You haven't listed any items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userListings.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isWishlisted={wishlistIds.includes(item.id)}
                onToggleWishlist={onToggleWishlist}
                onClick={(id) => onNavigate(`#item/${id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <EditProfileModal
        user={user}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={onUpdateUser}
      />
    </div>
  );
};
