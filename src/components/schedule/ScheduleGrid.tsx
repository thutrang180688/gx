
import React, { useState } from 'react';
import { ClassSession, User, DAYS_OF_WEEK, CATEGORY_COLORS } from '../types';
import ClassModal from './ClassModal';

interface Props {
  schedule: ClassSession[];
  user: User | null;
  onUpdate: (newSchedule: ClassSession[]) => void;
  onNotify: (msg: string, type: 'INFO' | 'ALERT') => void;
}

const ScheduleGrid: React.FC<Props> = ({ schedule, user, onUpdate, onNotify }) => {
  const [editing, setEditing] = useState<ClassSession | null>(null);
  const isManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const handleSave = (s: ClassSession, notify: boolean) => {
    const updated = schedule.find(x => x.id === s.id) ? schedule.map(x => x.id === s.id ? s : x) : [...schedule, {...s, id: Date.now().toString()}];
    onUpdate(updated);
    
    if (notify) {
      const statusText = s.status === 'CANCELLED' ? 'đã bị HỦY' : s.status === 'SUBSTITUTE' ? 'có thay đổi giáo viên' : 'đã được cập nhật';
      onNotify(`Thông báo: Lớp ${s.className} lúc ${s.time} ${statusText}. Quý hội viên lưu ý!`, s.status === 'CANCELLED' ? 'ALERT' : 'INFO');
    }
    setEditing(null);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200">
      <div className="grid grid-cols-7 bg-teal-900 text-white border-b-4 border-teal-800">
        {DAYS_OF_WEEK.map((day, idx) => (
          <div key={idx} className="p-4 text-center border-r border-teal-800/50 last:border-0">
            <div className="text-[10px] font-light text-teal-300 uppercase">{day.eng}</div>
            <div className="text-lg font-black">{day.vn.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 divide-x divide-gray-100 bg-slate-50 min-h-[600px]">
        {DAYS_OF_WEEK.map((_, dayIdx) => (
          <div key={dayIdx} className="p-3 space-y-3">
            {schedule.filter(s => s.dayIndex === dayIdx).sort((a, b) => a.time.localeCompare(b.time)).map(session => (
              <div 
                key={session.id} 
                onClick={() => isManager && setEditing(session)}
                className={`p-3 bg-white rounded-2xl border border-gray-200 shadow-sm ${isManager ? 'cursor-pointer hover:scale-[1.03]' : ''} transition-all relative group`}
              >
                <div className="text-[9px] font-black text-gray-400 text-center mb-1">{session.time}</div>
                <div className={`text-[10px] font-black text-white text-center py-1 rounded-xl uppercase ${CATEGORY_COLORS[session.category]}`}>{session.className}</div>
                <div className="text-[10px] font-black text-teal-800 text-center mt-1 uppercase">{session.instructor}</div>
                {session.status !== 'NORMAL' && (
                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[7px] font-bold px-1 rounded uppercase shadow-sm z-10">{session.status === 'CANCELLED' ? 'HỦY' : 'THAY'}</span>
                )}
                {isManager && <div className="absolute inset-0 bg-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center"><span className="text-[8px] bg-white px-2 py-1 rounded-full font-black text-teal-900 shadow-sm">CHỈNH SỬA</span></div>}
              </div>
            ))}
          </div>
        ))}
      </div>
      {editing && <ClassModal session={editing} onClose={() => setEditing(null)} onSave={handleSave} onDelete={(id) => { onUpdate(schedule.filter(x => x.id !== id)); setEditing(null); }} />}
    </div>
  );
};

export default ScheduleGrid;
