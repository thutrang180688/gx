import React from 'react';
import { AppNotification } from '../../types';
import { Bell, AlertTriangle } from 'lucide-react';

interface Props {
  notifications: AppNotification[];
}

const NotificationList: React.FC<Props> = ({ notifications }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="max-w-[1440px] mx-auto px-4 mb-6">
      <div className="bg-amber-50 rounded-[2rem] p-4 border border-amber-100 space-y-2">
        {notifications.slice(0, 3).map(n => (
          <div key={n.id} className="flex items-start gap-3 p-2">
            {n.type === 'ALERT' ? <AlertTriangle size={16} className="text-red-500 mt-1" /> : <Bell size={16} className="text-amber-600 mt-1" />}
            <div>
              <p className="text-xs font-bold text-amber-900">{n.message}</p>
              <p className="text-[8px] font-black text-amber-500 uppercase">{n.createdAt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;