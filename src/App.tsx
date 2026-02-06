import React, { useState, useEffect } from 'react';
import Header from './components/shared/Header';
import AdminPanel from './components/admin/AdminPanel';
import ScheduleGrid from './components/schedule/ScheduleGrid';
import ScheduleList from './components/schedule/ScheduleList';
import DateStrip from './components/schedule/DateStrip';
import NotificationList from './components/shared/NotificationList';
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

  const loadData = async () => {
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
    const role = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ? 'ADMIN' : 'USER';
    const loggedInUser: User = { id: Date.now().toString(), email, name, avatar: photo, role };
    setUser(loggedInUser);
    await sheetAPI.updateUserRole(email, role, name, photo);
    loadData(); // Tải lại để cập nhật danh sách User mới vào bảng Admin
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-teal-900">
      <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header config={config} user={user} onGoogleLogin={handleGoogleLogin} onLogout={() => setUser(null)} onToggleAdmin={() => setShowAdmin(true)} />
      
      <main className="max-w-[1440px] mx-auto px-4 py-8">
        <NotificationList notifications={notifications} />

        <div className="text-center mb-8 uppercase">
          <h2 className="text-3xl font-black text-teal-900">{config.scheduleTitle}</h2>
          <p className="text-[10px] font-bold text-teal-600 mt-2 tracking-widest">CIPUTRA CLUB - ONLINE REALTIME</p>
        </div>

        <div className="hidden lg:block">
          <ScheduleGrid schedule={schedule} user={user} onUpdate={async (newS) => { setSchedule(newS); await sheetAPI.updateSchedule(newS); }} onNotify={async (m, t) => { await sheetAPI.sendNotification(m, t); loadData(); }} />
        </div>

        <div className="lg:hidden space-y-4">
          <DateStrip activeDay={activeDay} onSelect={setActiveDay} />
          <ScheduleList dayIndex={activeDay} schedule={schedule} user={user} onUpdate={async (newS) => { setSchedule(newS); await sheetAPI.updateSchedule(newS); }} />
        </div>
      </main>

      {showAdmin && (
        <AdminPanel 
          user={user} headerConfig={config} onUpdateHeader={() => {}} onClose={() => setShowAdmin(false)} 
          registeredUsers={allUsers} schedule={schedule} ratings={ratings}
          onUpdateUserRole={async (email, role) => { await sheetAPI.updateUserRole(email, role); loadData(); }}
          onUpdateSchedule={async (newS) => { setSchedule(newS); await sheetAPI.updateSchedule(newS); }}
          onNotify={async (m, t) => { await sheetAPI.sendNotification(m, t); loadData(); }}
        />
      )}
    </div>
  );
};

export default App;