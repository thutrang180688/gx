import React, { useState } from 'react';
import { ClassSession, User, CATEGORY_COLORS, DAYS_OF_WEEK } from '../../types';
import ClassModal from '../shared/ClassModal';

interface Props {
  schedule: ClassSession[];
  user: User | null;
  onUpdate: (newSchedule: ClassSession[]) => void;
  onNotify: (msg: string, type: 'INFO' | 'ALERT') => void;
}

const ScheduleGrid: React.FC<Props> = ({ schedule, user, onUpdate, onNotify }) => {
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const isManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const timeSlots = Array.from(new Set(schedule.map(s => s.time))).sort();

  return (
    <div className="overflow-x-auto bg-white rounded-[2rem] shadow-2xl border border-teal-100">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-teal-900 text-white">
            <th className="p-6 text-left font-black uppercase tracking-widest text-xs border-r border-teal-800">Thời gian</th>
            {DAYS_OF_WEEK.map((day, index) => (
              <th key={index} className="p-6 text-center font-black uppercase tracking-widest text-xs border-r border-teal-800 last:border-0">
                {day.vn}
                <span className="block text-[8px] text-teal-400 font-medium">{day.eng}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(time => (
            <tr key={time} className="border-b border-teal-50 last:border-0">
              <td className="p-4 font-black text-teal-900 text-sm bg-teal-50/30 border-r border-teal-50 text-center">{time}</td>
              {DAYS_OF_WEEK.map((_, dayIdx) => {
                const session = schedule.find(s => s.time === time && s.dayIndex === dayIdx);
                return (
                  <td key={dayIdx} className="p-2 border-r border-teal-50 last:border-0 min-w-[150px]">
                    {session ? (
                      <div 
                        onClick={() => setSelectedClass(session)}
                        className={`${CATEGORY_COLORS[session.category]} p-3 rounded-2xl text-white shadow-lg cursor-pointer transform hover:scale-105 transition-all`}
                      >
                        <p className="text-[10px] font-black uppercase leading-tight">{session.className}</p>
                        <p className="text-[8px] font-bold opacity-80 mt-1 uppercase tracking-tighter">GV: {session.instructor}</p>
                        {session.status !== 'NORMAL' && (
                          <div className="mt-2 bg-white/20 py-0.5 px-2 rounded-full text-[7px] font-black inline-block uppercase">
                            {session.status === 'CANCELLED' ? 'Hủy lớp' : 'Thay GV'}
                          </div>
                        )}
                      </div>
                    ) : isManager ? (
                      <button className="w-full py-4 border-2 border-dashed border-teal-100 rounded-2xl text-teal-200 hover:border-teal-300 hover:text-teal-400 transition-colors">+</button>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedClass && (
        <ClassModal 
          session={selectedClass} 
          user={user} 
          onClose={() => setSelectedClass(null)} 
          onUpdate={(updated) => {
            const newSchedule = schedule.map(s => s.id === updated.id ? updated : s);
            onUpdate(newSchedule);
            if(updated.status !== 'NORMAL') onNotify(`Lớp ${updated.className} ${updated.time} có thay đổi!`, 'ALERT');
            setSelectedClass(null);
          }}
        />
      )}
    </div>
  );
};

export default ScheduleGrid;