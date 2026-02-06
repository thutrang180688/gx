import React, { useState, useEffect } from 'react';
// Sửa lại đường dẫn import đúng cấu trúc thư mục của bạn
import Header from './components/layout/Header';
import AdminPanel from './components/admin/AdminPanel';
import ScheduleGrid from './components/schedule/ScheduleGrid';
import ScheduleList from './components/schedule/ScheduleList';
import DateStrip from './components/schedule/DateStrip';
import NotificationList from './components/notifications/NotificationList';
import { User, ClassSession, HeaderConfig, Rating, SUPER_ADMIN_EMAIL, AppNotification } from './types';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-ZHIwmy3vZ2zNWOuzXsZ6XIybiLJdqckhLN0mFexs1u7BnynWKSaHMZo6gGxtkSj3Ag/exec';

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

  useEffect(() => {
    const savedUser = localStorage.getItem('gx_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${SCRIPT_URL}?action=getData`);
      const data = await res.json();
      setSchedule(data.schedule || []);
      setAllUsers(data.users || []);
      setRatings(data.ratings || []);
      setNotifications(data.notifications || []);
    } catch (e) {
      console.error("Lỗi kết nối:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (email: string, name: string, photo: string) => {
    const existingUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    let role: any = 'USER';
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) role = 'ADMIN';
    else if (existingUser) role = existingUser.role;

    const loggedInUser: User = { id: Date.now().toString(), email, name, avatar: photo, role };
    setUser(loggedInUser);
    localStorage.setItem('gx_user', JSON.stringify(loggedInUser));

    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'syncUser', user: loggedInUser })
    });
    fetchData();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gx_user');
  };

  const updateSchedule = async (newSchedule: ClassSession[]) => {
    setSchedule(newSchedule);
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'updateSchedule', schedule: newSchedule })
    });
    fetchData(); // Tải lại để đồng bộ
  };

  const onNotify = async (msg: string, type: 'INFO' | 'ALERT') => {
    const newNoti = { id: Date.now().toString(), message: msg, type, createdAt: new Date().toLocaleString() };
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'addNotification', notification: newNoti })
    });
    fetchData();
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-900 text-white">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
      <p className="font-black text-xs uppercase tracking-widest">Đang kết nối Database...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header config={config} user={user} onGoogleLogin={handleGoogleLogin} onLogout={handleLogout} onToggleAdmin={() => setShowAdmin(true)} />
      
      <main className="max-w-[1440px] mx-auto px-4 py-8">
        <NotificationList notifications={notifications} />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-teal-900 uppercase italic">{config.scheduleTitle}</h2>
          <div className="h-1.5 w-24 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="hidden lg:block">
          <ScheduleGrid schedule={schedule} user={user} onUpdate={updateSchedule} onNotify={onNotify} />
        </div>

        <div className="lg:hidden space-y-4">
          <DateStrip activeDay={activeDay} onSelect={setActiveDay} />
          <ScheduleList dayIndex={activeDay} schedule={schedule} user={user} onUpdate={updateSchedule} />
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
            await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ action: 'updateRole', email, role }) });
            fetchData();
          }}
          onUpdateSchedule={updateSchedule}
          onNotify={onNotify}
          rootEmail={SUPER_ADMIN_EMAIL}
        />
      )}
    </div>
  );
};

export default App;