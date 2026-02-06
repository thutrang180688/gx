import React, { useState } from 'react';
import { User, HeaderConfig, Role, ClassSession, DAYS_OF_WEEK, CATEGORY_COLORS, Rating } from '../../types';

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
  rootEmail: string;
}

const AdminPanel: React.FC<Props> = ({ 
  user, onClose, registeredUsers, schedule, ratings, onUpdateUserRole, onUpdateSchedule, onNotify, rootEmail 
}) => {
  const [activeTab, setActiveTab] = useState<'SCH' | 'USERS' | 'RATINGS'>('SCH');
  const [msg, setMsg] = useState('');
  
  // State khởi tạo cho lớp học mới
  const [newClass, setNewClass] = useState<Partial<ClassSession>>({
    dayIndex: 0, 
    time: '08:00 - 09:00', 
    className: '', 
    instructor: '', 
    category: 'YOGA', 
    status: 'NORMAL'
  });

  const isSuperAdmin = user?.email.toLowerCase() === rootEmail.toLowerCase();

  const handleAddSession = () => {
    if (!newClass.className || !newClass.instructor) {
      alert("Vui lòng nhập đủ Tên môn và HLV!");
      return;
    }
    const session: ClassSession = { 
      ...newClass as ClassSession, 
      id: Date.now().toString() 
    };
    onUpdateSchedule([...schedule, session]);
    setNewClass({ ...newClass, className: '', instructor: '' });
    alert("Đã lưu lớp học mới thành công!");
  };

  const handleDeleteSession = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá lớp này khỏi lịch tập?")) {
      const updated = schedule.filter(s => s.id !== id);
      onUpdateSchedule(updated);
    }
  };

  return (
    <div className="fixed inset-0 bg-teal-950/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 z-[100]">
      <div className="bg-white w-full max-w-6xl h-[92vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
        
        {/* Header của Panel */}
        <div className="bg-teal-900 text-white p-6 flex justify-between items-center border-b border-teal-800">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 p-2 rounded-xl shadow-inner">
              <svg className="w-6 h-6 text-teal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Cài đặt Hệ Thống</h2>
              <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Đang chạy trực tuyến: Google Sheets</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white/10 hover:bg-red-500 hover:text-white rounded-full transition-all font-bold text-lg flex items-center justify-center border border-white/10">✕</button>
        </div>

        {/* Thanh Tab chuyển đổi */}
        <div className="flex bg-slate-100 p-2 gap-2 border-b">
          <button onClick={() => setActiveTab('SCH')} className={`flex-1 py-4 rounded-2xl font-black text-[11px] uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'SCH' ? 'bg-white shadow-lg text-teal-900' : 'text-gray-400 hover:text-teal-600'}`}>
            <span>📅</span> QUẢN LÝ LỊCH TẬP
          </button>
          {isSuperAdmin && (
            <button onClick={() => setActiveTab('USERS')} className={`flex-1 py-4 rounded-2xl font-black text-[11px] uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'USERS' ? 'bg-white shadow-lg text-teal-900' : 'text-gray-400 hover:text-teal-600'}`}>
              <span>👥</span> HỘI VIÊN ({registeredUsers.length})
            </button>
          )}
          <button onClick={() => setActiveTab('RATINGS')} className={`flex-1 py-4 rounded-2xl font-black text-[11px] uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'RATINGS' ? 'bg-white shadow-lg text-teal-900' : 'text-gray-400 hover:text-teal-600'}`}>
            <span>⭐</span> ĐÁNH GIÁ ({ratings.length})
          </button>
        </div>

        {/* Nội dung chi tiết các Tab */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scroll bg-slate-50">
          
          {activeTab === 'SCH' && (
            <div className="space-y-10 animate-fade">
              {/* PHẦN 1: THÔNG BÁO */}
              <section className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-200 shadow-sm">
                <h3 className="text-[11px] font-black text-amber-900 uppercase mb-4 flex items-center gap-2">
                  <span className="animate-bounce">📢</span> Gửi thông báo toàn hệ thống
                </h3>
                <div className="flex gap-4">
                  <input className="flex-1 p-4 rounded-2xl border-2 border-amber-200 text-xs font-bold outline-none focus:border-amber-500 shadow-inner bg-white" value={msg} onChange={e => setMsg(e.target.value)} placeholder="Nội dung ví dụ: Lớp Yoga sáng mai nghỉ..." />
                  <button onClick={() => { if(!msg) return; onNotify(msg, 'INFO'); setMsg(''); alert("Đã gửi thông báo!"); }} className="bg-amber-600 text-white px-10 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-amber-700 active:scale-95 transition-all">GỬI</button>
                </div>
              </section>

              {/* PHẦN 2: THÊM LỊCH TẬP */}
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-[11px] font-black text-teal-900 uppercase mb-6 flex items-center gap-2 text-center">
                  <span className="p-1 bg-teal-100 rounded">➕</span> Thêm buổi tập mới vào Google Sheets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Tên lớp học</label>
                    <input className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-xs font-bold focus:border-teal-500 outline-none" value={newClass.className} onChange={e => setNewClass({...newClass, className: e.target.value.toUpperCase()})} placeholder="VD: ZUMBA, YOGA..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Giáo viên (HLV)</label>
                    <input className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-xs font-bold focus:border-teal-500 outline-none" value={newClass.instructor} onChange={e => setNewClass({...newClass, instructor: e.target.value.toUpperCase()})} placeholder="TÊN HLV" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Khung giờ</label>
                    <input className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-xs font-bold focus:border-teal-500 outline-none" value={newClass.time} onChange={e => setNewClass({...newClass, time: e.target.value})} placeholder="08:00 - 09:00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Thứ trong tuần</label>
                    <select className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white text-xs font-bold appearance-none cursor-pointer focus:border-teal-500 outline-none" value={newClass.dayIndex} onChange={e => setNewClass({...newClass, dayIndex: Number(e.target.value)})}>
                      {DAYS_OF_WEEK.map((d, i) => <option key={i} value={i}>{d.vn} ({d.eng})</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Nhóm môn</label>
                    <select className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white text-xs font-bold appearance-none cursor-pointer focus:border-teal-500 outline-none" value={newClass.category} onChange={e => setNewClass({...newClass, category: e.target.value as any})}>
                      <option value="YOGA">YOGA</option>
                      <option value="TAICHI">TAICHI</option>
                      <option value="DANCE">DANCE / ZUMBA</option>
                      <option value="OTHER">KHÁC</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleAddSession} className="w-full mt-8 bg-teal-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black active:scale-[0.98] transition-all">
                  Lưu lớp học vào Database Online
                </button>
              </section>

              {/* PHẦN 3: DANH SÁCH LỊCH HIỆN TẠI ĐỂ XOÁ */}
              <div className="mt-10">
                <h3 className="text-[11px] font-black text-gray-400 uppercase mb-4 ml-2">Danh sách lớp đã tạo (Để xoá)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {schedule.slice().sort((a,b) => a.dayIndex - b.dayIndex).map(s => (
                    <div key={s.id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-200 shadow-sm">
                      <div>
                        <p className="text-[10px] font-black text-teal-800 uppercase">{DAYS_OF_WEEK[s.dayIndex].vn} | {s.time}</p>
                        <p className="text-xs font-black text-gray-900">{s.className} - {s.instructor}</p>
                      </div>
                      <button onClick={() => handleDeleteSession(s.id)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'USERS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade">
              {registeredUsers.map(u => (
                <div key={u.email} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-teal-500 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={u.avatar} className="w-14 h-14 rounded-full border-2 border-teal-500 p-0.5 shadow-sm" alt="avt" />
                    <div>
                      <p className="text-xs font-black text-teal-900 uppercase leading-none">{u.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1">{u.email}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[8px] font-black uppercase ${u.role === 'MANAGER' ? 'bg-amber-100 text-amber-600' : u.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>{u.role}</span>
                    </div>
                  </div>
                  {u.email.toLowerCase() !== rootEmail.toLowerCase() && (
                    <button 
                      onClick={() => onUpdateUserRole(u.email, u.role === 'MANAGER' ? 'USER' : 'MANAGER')}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${u.role === 'MANAGER' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-teal-600 text-white shadow-md hover:bg-teal-700'}`}
                    >
                      {u.role === 'MANAGER' ? 'Hạ cấp User' : 'Set Manager'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'RATINGS' && (
             <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 animate-fade">
                {ratings.length === 0 ? (
                  <div className="text-center py-20 text-gray-300 font-black uppercase text-xs tracking-widest">Chưa có đánh giá nào</div>
                ) : (
                  ratings.map(r => (
                    <div key={r.id} className="break-inside-avoid p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < r.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                        <span className="text-[8px] font-black text-gray-300 uppercase">{r.createdAt}</span>
                      </div>
                      <p className="text-xs text-teal-900 font-bold italic mb-4 leading-relaxed line-clamp-4">"{r.comment}"</p>
                      <div className="text-[9px] font-black uppercase text-teal-600 border-t pt-4 flex justify-between">
                        <span>GV: {r.instructor}</span>
                        <span className="text-gray-400">By: {r.userName}</span>
                      </div>
                    </div>
                  ))
                )}
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;