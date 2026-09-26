import React from 'react';
import { Bell, Calendar } from 'lucide-react';
import type { NotificationItem } from '../types';
import { storage } from '../services/storage';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onNavigate: (path: string) => void;
  onRefresh: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onNavigate,
  onRefresh
}) => {
  const handleMarkRead = (id: string) => {
    storage.markNotificationRead(id);
    onRefresh();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-6 h-6 text-[#900C3F]" />
          <h1 className="text-3xl font-black text-gray-900">Notifications</h1>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#FFC0CB] shadow-sm">
          <p className="text-xs text-gray-500">No notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                handleMarkRead(n.id);
                if (n.link) onNavigate(n.link);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                n.readStatus
                  ? 'bg-white border-gray-100 opacity-80'
                  : 'bg-[#FFF0F5] border-[#FFC0CB] shadow-sm'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#900C3F] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900">{n.title}</h4>
                  <span className="text-[10px] text-gray-400">
                    {new Date(n.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
