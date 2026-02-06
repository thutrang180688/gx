
import React from 'react';
import { ClassSession, User, CATEGORY_COLORS } from '../types';

interface Props {
  dayIndex: number;
  schedule: ClassSession[];
  user: User | null;
  onUpdate: (newSchedule: ClassSession[]) => void;
}

const ScheduleList: React.FC<Props> = ({ dayIndex, schedule, user, onUpdate }) => {
  const classes = schedule.filter(s => s.dayIndex === dayIndex).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="px-4 space-y-4 pb-8">
      {classes.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200 text-gray-400 font-bold uppercase text-sm">Nghỉ ngơi thôi!</div>
      ) : (
        classes.map(session => (
          <div key={session.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 flex overflow-hidden animate-fade">
            <div className={`w-3 ${CATEGORY_COLORS[session.category]}`} />
            <div className="flex-1 p-5">
              <div className="flex justify-between items-center mb-1">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{session.time}</span>
                 {session.status !== 'NORMAL' && <span className="bg-red-100 text-red-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">{session.status === 'CANCELLED' ? 'HỦY LỚP' : 'DẠY THAY'}</span>}
              </div>
              <h3 className="text-xl font-black text-teal-900 leading-tight uppercase">{session.className}</h3>
              <p className="text-gray-500 font-bold text-sm uppercase mt-1">HLV: {session.instructor}</p>
              <button className="mt-4 w-full bg-teal-50 text-teal-700 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider">🔔 Nhắc Tôi</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ScheduleList;
