import React, { useState, useEffect } from 'react';
import { HeaderConfig, User } from '../../types';

interface Props {
  config: HeaderConfig;
  user: User | null;
  onGoogleLogin: (email: string, name: string, photo: string) => void;
  onLogout: () => void;
  onToggleAdmin: () => void;
}

declare global { interface Window { google: any; } }

const Header: React.FC<Props> = ({ config, user, onGoogleLogin, onLogout, onToggleAdmin }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleCredentialResponse = (response: any) => {
      try {
        // Giải mã dữ liệu từ Google trả về
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        
        // Gửi dữ liệu về App.tsx để xử lý quyền Admin
        onGoogleLogin(payload.email, payload.name, payload.picture);
        setShowLoginModal(false);
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
      }
    };

    if (showLoginModal || !user) {
      const initGoogle = () => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: "DÁN_CLIENT_ID_CỦA_BẠN_VÀO_ĐÂY.apps.googleusercontent.com",
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          
          const btnDiv = document.getElementById("googleBtn");
          if (btnDiv) {
            window.google.accounts.id.renderButton(btnDiv, { 
              theme: "outline", 
              size: "large", 
              width: "250",
              text: "signin_with"
            });
          }
        }
      };

      // Đợi thư viện Google load xong
      const timer = setTimeout(initGoogle, 1000);
      return () => clearTimeout(timer);
    }
  }, [showLoginModal, user, onGoogleLogin]);

  return (
    <>
      <header className="bg-teal-900 text-white shadow-xl sticky top-0 z-40 border-b border-teal-800">
        <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={config.logo} alt="Logo" className="h-10 bg-white p-1 rounded-lg" />
            <div className="hidden sm:block">
              <h1 className="text-sm font-black uppercase tracking-tight">CIPUTRA CLUB</h1>
              <p className="text-[8px] text-teal-400 uppercase">{config.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!user ? (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="bg-white text-teal-900 px-4 py-2 rounded-full text-[10px] font-black hover:bg-teal-50 transition-colors"
              >
                ĐĂNG NHẬP
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-teal-800/50 p-1.5 pr-4 rounded-full border border-teal-700">
                <img src={user.avatar} className="w-8 h-8 rounded-full border-2 border-teal-500" alt="avt" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase leading-none">{user.name}</span>
                    <span className="text-[7px] text-teal-400 font-bold uppercase">{user.role}</span>
                </div>
                {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                  <button onClick={onToggleAdmin} className="bg-amber-500 p-1.5 rounded-lg text-white ml-2 hover:bg-amber-400 transition-colors">
                    ⚙️
                  </button>
                )}
                <button onClick={onLogout} className="ml-2 text-red-400 hover:text-red-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h3 className="text-xl font-black text-teal-900 uppercase mb-2">Xin chào!</h3>
            <p className="text-gray-500 text-xs mb-8 font-medium">Vui lòng đăng nhập để xem lịch tập và đánh giá giáo viên</p>
            
            <div className="flex justify-center mb-8 min-h-[40px]">
                <div id="googleBtn"></div>
            </div>

            <button 
              onClick={() => setShowLoginModal(false)} 
              className="text-gray-400 text-[10px] uppercase font-black hover:text-gray-600 transition-colors"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;