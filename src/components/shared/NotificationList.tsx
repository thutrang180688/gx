import React from 'react';
import { AppNotification } from '../../types';

interface Props {
  notifications: AppNotification[];
}

const NotificationList: React.FC<Props> = ({ notifications }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="mb-8 space-y-2">
      {notifications.slice(0, 2).map(n => (
        <div key={n.id} className={`${n.type === 'ALERT' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'} p-4 rounded-2xl border flex items-center justify-between animate-pulse`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{n.type === 'ALERT' ? '🚨' : '📢'}</span>
            <div>
              <p className={`text-xs font-black uppercase ${n.type === 'ALERT' ? 'text-red-900' : 'text-amber-900'}`}>{n.message}</p>
              <p className="text-[8px] font-bold opacity-50">{n.createdAt}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;