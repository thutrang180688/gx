import React from 'react';
import { DAYS_OF_WEEK } from '../../types';

interface Props {
  activeDay: number;
  onSelect: (idx: number) => void;
}

const DateStrip: React.FC<Props> = ({ activeDay, onSelect }) => {
  return (
    <div className="flex justify-between bg-teal-900 p-2 rounded-2xl shadow-inner mx-1">
      {DAYS_OF_WEEK.map((day, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${activeDay === idx ? 'bg-white shadow-lg' : 'text-teal-400'}`}
        >
          <span className={`text-[8px] font-black uppercase ${activeDay === idx ? 'text-teal-900' : 'text-teal-500'}`}>{day.eng.slice(0, 3)}</span>
          <span className={`text-[10px] font-black ${activeDay === idx ? 'text-teal-900' : 'text-white'}`}>{day.vn.replace('Thứ ', 'T')}</span>
        </button>
      ))}
    </div>
  );
};

export default DateStrip;