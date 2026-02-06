import React, { useState } from 'react';
import { ClassSession, User, CATEGORY_COLORS, ClassStatus } from '../../types';

interface Props {
  session: ClassSession;
  user: User | null;
  onClose: () => void;
  onUpdate: (updated: ClassSession) => void;
}

const ClassModal: React.FC<Props> = ({ session, user, onClose, onUpdate }) => {
  const [status, setStatus] = useState<ClassStatus>(session.status);
  const [instructor, setInstructor] = useState(session.instructor);
  const isManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <div className="fixed inset-0 bg-teal-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className={`${CATEGORY_COLORS[session.category]} p-8 text-white text-center`}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Chi tiết lớp học</p>
          <h3 className="text-2xl font-black uppercase leading-tight">{session.className}</h3>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[8px] font-black text-slate-400 uppercase">Thời gian</p>
              <p className="text-sm font-black text-teal-900">{session.time}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[8px] font-black text-slate-400 uppercase">Giáo viên</p>
              <p className="text-sm font-black text-teal-900">{session.instructor}</p>
            </div>
          </div>

          {isManager && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <p className="text-[10px] font-black text-teal-900 uppercase">Cập nhật trạng thái</p>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value as ClassStatus)}
                className="w-full p-3 rounded-xl bg-slate-100 text-xs font-bold border-0"
              >
                <option value="NORMAL">Hoạt động bình thường</option>
                <option value="CANCELLED">Hủy lớp (Nghỉ)</option>
                <option value="SUBSTITUTE">Thay đổi giáo viên</option>
              </select>
              
              {status === 'SUBSTITUTE' && (
                <input 
                  type="text" 
                  placeholder="Tên giáo viên mới..."
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-100 text-xs font-bold border-0 shadow-inner"
                />
              )}
              
              <button 
                onClick={() => onUpdate({...session, status, instructor})}
                className="w-full bg-teal-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-teal-900/20"
              >
                Lưu thay đổi
              </button>
            </div>
          )}

          <button onClick={onClose} className="w-full py-2 text-slate-400 font-black text-[10px] uppercase">Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default ClassModal;