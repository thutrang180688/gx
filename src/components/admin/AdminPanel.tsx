import React, { useState } from 'react';
import { User, HeaderConfig, Role, ClassSession, DAYS_OF_WEEK, SUPER_ADMIN_EMAIL, Rating } from '../../types';

interface Props {
  user: User | null;
  headerConfig: HeaderConfig;
  onUpdateHeader: (c: HeaderConfig) => void;
  onClose: () => void;
  registeredUsers: User[];
  schedule: ClassSession[];
  ratings: Rating[];
  onUpdateUserRole: (email: string, role: Role) => void;
  onUpdateSchedule: (s: ClassSession[]) => void;
  onNotify: (msg: string, type: 'INFO' | 'ALERT') => void;
}

const AdminPanel: React.FC<Props> = ({ 
  user, onClose, registeredUsers, schedule, ratings, onUpdateUserRole, onUpdateSchedule, onNotify
}) => {
  const [activeTab, setActiveTab] = useState<'SCH' | 'USERS' | 'RATINGS'>('SCH');
  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  return (
    <div className="fixed inset-0 bg-teal-950/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
        <div className="bg-teal-900 text-white p-6 flex justify-between items-center">
          <h2 className="font-black uppercase tracking-widest">Hệ thống Quản trị</h2>
          <button onClick={onClose} className="bg-white/10 w-10 h-10 rounded-full">✕</button>
        </div>

        <div className="flex bg-gray-100 p-2 gap-2">
          <button onClick={() => setActiveTab('SCH')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase ${activeTab === 'SCH' ? 'bg-white shadow' : 'text-gray-400'}`}>Lịch tập</button>
          <button onClick={() => setActiveTab('RATINGS')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase ${activeTab === 'RATINGS' ? 'bg-white shadow' : 'text-gray-400'}`}>Đánh giá</button>
          {isSuperAdmin && (
            <button onClick={() => setActiveTab('USERS')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase ${activeTab === 'USERS' ? 'bg-white shadow' : 'text-gray-400'}`}>Nhân sự</button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'SCH' && (
            <div className="space-y-6">
               <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                 <p className="text-[10px] font-black uppercase text-amber-700 mb-2">Thông báo nhanh</p>
                 <div className="flex gap-2">
                   <input id="quickMsg" className="flex-1 p-3 rounded-xl text-xs border-0 shadow-inner" placeholder="Nhập tin nhắn cho hội viên..." />
                   <button onClick={() => onNotify((document.getElementById('quickMsg') as any).value, 'INFO')} className="bg-amber-600 text-white px-6 rounded-xl font-black text-[10px]">GỬI</button>
                 </div>
               </div>
               {/* Phần thêm lớp học bạn có thể giữ nguyên logic cũ hoặc nâng cấp sau */}
               <p className="text-center text-gray-400 italic text-xs py-10">Sử dụng bảng Lịch Tập bên ngoài để Chỉnh sửa/Xóa lớp trực tiếp.</p>
            </div>
          )}

          {activeTab === 'RATINGS' && (
            <div className="space-y-4">
              {ratings.map(r => (
                <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border">
                  <div className="flex justify-between mb-2">
                    <span className="font-black text-teal-800 text-xs">{r.userName}</span>
                    <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-xs text-gray-600 italic">"{r.comment}"</p>
                  <p className="text-[8px] mt-2 font-bold text-gray-400 uppercase">Giáo viên: {r.instructor} | {r.createdAt}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'USERS' && (
            <div className="space-y-3">
              {registeredUsers.map(u => (
                <div key={u.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-[10px] font-black uppercase">{u.name}</p>
                      <p className="text-[8px] text-gray-400">{u.email}</p>
                    </div>
                  </div>
                  {u.email !== SUPER_ADMIN_EMAIL && (
                    <button 
                      onClick={() => onUpdateUserRole(u.email, u.role === 'MANAGER' ? 'USER' : 'MANAGER')}
                      className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase ${u.role === 'MANAGER' ? 'bg-red-100 text-red-600' : 'bg-teal-600 text-white'}`}
                    >
                      {u.role === 'MANAGER' ? 'Hạ cấp' : 'Set Manager'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;