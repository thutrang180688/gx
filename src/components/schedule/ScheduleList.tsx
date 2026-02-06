import React, { useState } from 'react';
import { ClassSession, User, CATEGORY_COLORS } from '../../types';
import ClassModal from '../shared/ClassModal';

interface Props {
  dayIndex: number;
  schedule: ClassSession[];
  user: User | null;
  onUpdate: (newSchedule: ClassSession[]) => void;
}

const ScheduleList: React.FC<Props> = ({ dayIndex, schedule, user, onUpdate }) => {
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const dayClasses = schedule
    .filter(s => s.dayIndex === dayIndex)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-3 px-1">
      {dayClasses.map(session => (
        <div 
          key={session.id}
          onClick={() => setSelectedClass(session)}
          className="bg-white p-4 rounded-[1.5rem] shadow-sm flex items-center justify-between border border-teal-50 active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="text-center min-w-[60px]">
              <p className="text-xs font-black text-teal-900 leading-none">{session.time}</p>
              <div className={`h-1 w-full mt-1 rounded-full ${CATEGORY_COLORS[session.category]}`}></div>
            </div>
            <div>
              <p className="text-xs font-black text-teal-900 uppercase">{session.className}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">GV: {session.instructor}</p>
            </div>
          </div>
          {session.status !== 'NORMAL' && (
            <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${session.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
              {session.status === 'CANCELLED' ? 'Hủy' : 'Đổi GV'}
            </span>
          )}
        </div>
      ))}
      {selectedClass && (
        <ClassModal 
          session={selectedClass} 
          user={user} 
          onClose={() => setSelectedClass(null)} 
          onUpdate={(updated) => {
            onUpdate(schedule.map(s => s.id === updated.id ? updated : s));
            setSelectedClass(null);
          }}
        />
      )}
    </div>
  );
};

export default ScheduleList;