import React, { useState, useEffect } from 'react';
import Header from './components/shared/Header';
import AdminPanel from './components/admin/AdminPanel';
import ScheduleGrid from './components/schedule/ScheduleGrid';
import ScheduleList from './components/schedule/ScheduleList';
import DateStrip from './components/schedule/DateStrip';
import { User, ClassSession, HeaderConfig, Rating, SUPER_ADMIN_EMAIL, AppNotification } from './types';
import { sheetAPI } from './api/sheets';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [schedule, setSchedule] = useState<ClassSession[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

  const [config] = useState<HeaderConfig>({
    logo: 'https://ciputraclub.vn/wp-content/uploads/2017/08/logo.png',
    address: 'Xuân Đỉnh, Bắc Từ Liêm, Hà Nội',
    scheduleTitle: 'LỊCH TẬP GX ONLINE',
    hotline: '0243 743 0666',
    website: 'www.ciputraclub.vn'
  });

  // Tải dữ liệu từ Google Sheets khi mở App
  const loadData = async () => {
    setLoading(true);
    const data = await sheetAPI.getAllData();
    if (data) {
      setSchedule(data.schedule || []);
      setAllUsers(data.users || []);
      setRatings(data.ratings || []);
      setNotifications(data.notifications || []);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleGoogleLogin = async (email: string, name: string, photo: string) => {
    let existingUser = allUsers.find(u => u.email === email);
    
    if (!existingUser) {
      const role = email === SUPER_ADMIN_EMAIL ? 'ADMIN' : 'USER';
      existingUser = { id: Date.now().toString(), email, name, avatar: photo, role };
      // Lưu user mới lên Sheet ngay lập tức
      await sheetAPI.updateUserRole(email, role, name, photo);
      setAllUsers([...allUsers, existingUser]);
    }
    setUser(existingUser);
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-900 text-white">
      <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black uppercase tracking-widest text-sm">Đang kết nối Database...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header config={config} user={user} onGoogleLogin={handleGoogleLogin} onLogout={() => setUser(null)} onToggleAdmin={() => setShowAdmin(true)} />
      
      <main className="max-w-[1440px] mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-4xl font-black text-teal-900 uppercase">{config.scheduleTitle}</h2>
          <div className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-[10px] font-black mt-2">DỮ LIỆU TRỰC TUYẾN</div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <ScheduleGrid schedule={schedule} user={user} onUpdate={async (newS) => { setSchedule(newS); await sheetAPI.updateSchedule(newS); }} onNotify={async (m, t) => { await sheetAPI.sendNotification(m, t); loadData(); }} />
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-4">
          <DateStrip activeDay={activeDay} onSelect={setActiveDay} />
          <ScheduleList dayIndex={activeDay} schedule={schedule} user={user} onUpdate={async (newS) => { setSchedule(newS); await sheetAPI.updateSchedule(newS); }} />
        </div>
      </main>

      {showAdmin && (
        <AdminPanel 
          user={user} 
          headerConfig={config} 
          onUpdateHeader={() => {}} 
          onClose={() => setShowAdmin(false)} 
          registeredUsers={allUsers}
          schedule={schedule}
          ratings={ratings}
          onUpdateUserRole={async (email, role) => {
            await sheetAPI.updateUserRole(email, role);
            loadData();
          }}
          onUpdateSchedule={async (newS) => {
            setSchedule(newS);
            await sheetAPI.updateSchedule(newS);
          }}
          onNotify={async (m, t) => {
            await sheetAPI.sendNotification(m, t);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default App;