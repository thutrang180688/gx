import React, { useState } from 'react';
import { User, HeaderConfig, Role, ClassSession, SUPER_ADMIN_EMAIL, Rating, CATEGORY_COLORS } from '../../types';

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
  const [msg, setMsg] = useState('');
  const isSuperAdmin = user?.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  // Hàm thêm lịch tập mới
  const addNewSession = () => {
    const newSession: ClassSession = {
      id: Date.now().toString(),
      dayIndex: 0,
      time: "08:00",
      className: "LỚP MỚI",
      instructor: "GIÁO VIÊN",
      category: "YOGA",
      status: "NORMAL"
    };
    onUpdateSchedule([...schedule, newSession]);
  };

  return (
    <div className="fixed inset-0 bg-teal-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-[100]">
      <div className="bg-white w-full max-w-6xl h-[95vh] rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
        {/* Header Admin */}
        <div className="bg-teal-900 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="font-black uppercase tracking-widest text-lg">QUẢN TRỊ VIÊN</h2>
            <p className="text-[10px] text-teal-400 font-bold">Xin chào, {user?.name}</p>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full transition-colors font-bold">✕</button>
        </div>

        {/* Tab Menu */}
        <div className="flex bg-gray-100 p-2 gap-2">
          <button onClick={() => setActiveTab('SCH')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${activeTab === 'SCH' ? 'bg-white shadow text-teal-900' : 'text-gray-400'}`}>Lịch tập</button>
          <button onClick={() => setActiveTab('USERS')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${activeTab === 'USERS' ? 'bg-white shadow text-teal-900' : 'text-gray-400'}`}>Nhân sự ({registeredUsers.length})</button>
          <button onClick={() => setActiveTab('RATINGS')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${activeTab === 'RATINGS' ? 'bg-white shadow text-teal-900' : 'text-gray-400'}`}>Đánh giá ({ratings.length})</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Tab 1: Quản lý lịch tập */}
          {activeTab === 'SCH' && (
            <div className="space-y-6">
              <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100">
                <p className="text-[10px] font-black text-amber-900 uppercase mb-4">📢 Thông báo nhanh cho hội viên</p>
                <div className="flex gap-2">
                  <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Nhập nội dung cần thông báo..." className="flex-1 p-3 rounded-xl border-0 bg-white text-xs font-bold" />
                  <button onClick={() => { onNotify(msg, 'INFO'); setMsg(''); }} className="bg-amber-500 text-white px-6 rounded-xl font-black text-[10px] uppercase">Gửi</button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-teal-900 uppercase text-sm">Danh sách buổi tập</h3>
                <button onClick={addNewSession} className="bg-teal-900 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase">+ Thêm buổi tập</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedule.map((s, idx) => (
                  <div key={s.id} className="p-4 bg-white border rounded-2xl shadow-sm relative group">
                    <input className="w-full font-black text-teal-900 uppercase text-xs mb-2 border-b border-transparent focus:border-teal-200 outline-none" 
                           value={s.className} onChange={e => {
                             const newS = [...schedule]; newS[idx].className = e.target.value; onUpdateSchedule(newS);
                           }} />
                    <div className="flex gap-2 mb-2">
                      <input className="w-1/2 p-2 bg-slate-50 rounded-lg text-[10px] font-bold" value={s.time} onChange={e => {
                        const newS = [...schedule]; newS[idx].time = e.target.value; onUpdateSchedule(newS);
                      }} />
                      <select className="w-1/2 p-2 bg-slate-50 rounded-lg text-[10px] font-bold uppercase" value={s.category} onChange={e => {
                        const newS = [...schedule]; newS[idx].category = e.target.value as any; onUpdateSchedule(newS);
                      }}>
                        {Object.keys(CATEGORY_COLORS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <button onClick={() => { if(confirm('Xóa lớp này?')) onUpdateSchedule(schedule.filter(item => item.id !== s.id)); }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Nhân sự */}
          {activeTab === 'USERS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registeredUsers.map(u => (
                <div key={u.email} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border">
                  <img src={u.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="avt" />
                  <div className="flex-1">
                    <p className="text-xs font-black text-teal-900 uppercase">{u.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{u.email}</p>
                    <div className="mt-2 flex gap-2">
                      {['USER', 'MANAGER', 'ADMIN'].map(r => (
                        <button key={r} onClick={() => onUpdateUserRole(u.email, r as Role)}
                                className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${u.role === r ? 'bg-teal-900 text-white' : 'bg-white text-gray-400 border'}`}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Đánh giá */}
          {activeTab === 'RATINGS' && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {ratings.map(r => (
                <div key={r.id} className="break-inside-avoid p-5 bg-white border border-teal-50 rounded-[2rem] shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-amber-400 font-bold">{'★'.repeat(r.rating)}</span>
                    <span className="text-[8px] font-black text-gray-300 uppercase">{r.createdAt}</span>
                  </div>
                  <p className="text-xs text-teal-900 font-bold leading-relaxed mb-4 italic">"{r.comment}"</p>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[9px] font-black text-teal-800 uppercase">GV: {r.instructor}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase">— {r.userName}</p>
                  </div>
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