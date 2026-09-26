import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { User } from '../types';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: User) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [bio, setBio] = useState(user.bio || '');
  const [locationAddress, setLocationAddress] = useState(user.locationAddress);
  const [avatar, setAvatar] = useState(user.avatar || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      name,
      phone,
      bio,
      locationAddress,
      avatar
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#FFC0CB] relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-extrabold text-gray-900">Edit Profile</h2>
          <p className="text-xs text-gray-500">Update your Katraj community profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Avatar Image URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98230 11223"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Katraj Address</label>
            <input
              type="text"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell neighbors what tools or skills you love sharing..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#900C3F]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#900C3F] hover:bg-[#700931] text-white font-extrabold py-3 rounded-xl text-sm shadow-md transition-all"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
