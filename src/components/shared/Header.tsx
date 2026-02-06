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
    // Hàm xử lý sau khi người dùng chọn tài khoản Google
    const handleCredentialResponse = (response: any) => {
      try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        
        // Trả dữ liệu về App.tsx
        onGoogleLogin(payload.email, payload.name, payload.picture);
        setShowLoginModal(false);
      } catch (error) {
        console.error("Lỗi giải mã dữ liệu Google:", error);
      }
    };

    if (showLoginModal) {
      const initGoogle = () => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: "882743803439-1c1qoa24f5cvn0ir99i1b465qg3r8qgs.apps.googleusercontent.com",
            callback: handleCredentialResponse,
          });
          
          const btnDiv = document.getElementById("googleBtn");
          if (btnDiv) {
            window.google.accounts.id.renderButton(btnDiv, { 
              theme: "outline", 
              size: "large", 
              width: "100%" 
            });
          }
        }
      };

      // Thử khởi tạo sau 500ms để đảm bảo div 'googleBtn' đã hiện diện
      const timer = setTimeout(initGoogle, 500);
      return () => clearTimeout(timer);
    }
  }, [showLoginModal, onGoogleLogin]);

  return (
    <>
      <header className="bg-teal-900 text-white shadow-xl sticky top-0 z-40 border-b border-teal-800">
        <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={config.logo} alt="Logo" className="h-10 bg-white p-1 rounded-lg" />
            <div className="hidden sm:block">
              <h1 className="text-sm font-black uppercase">CIPUTRA CLUB</h1>
              <p className="text-[8px] text-teal-400 uppercase">{config.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!user ? (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="bg-white text-teal-900 px-4 py-2 rounded-full text-[10px] font-black"
              >
                ĐĂNG NHẬP
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right hidden xs:block">
                  <p className="text-[10px] font-black uppercase leading-none">{user.name}</p>
                  <p className="text-[7px] text-teal-400 font-bold uppercase">{user.role}</p>
                </div>
                {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                  <button 
                    onClick={onToggleAdmin} 
                    className="bg-amber-500 p-2 rounded-xl text-white hover:bg-amber-400 transition-colors"
                  >
                    ⚙️
                  </button>
                )}
                <img src={user.avatar} className="w-8 h-8 rounded-full border-2 border-teal-500" alt="avt" />
                <button onClick={onLogout} className="text-red-400 font-bold text-[10px] uppercase">Thoát</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center shadow-2xl">
            <h3 className="text-xl font-black text-teal-900 uppercase mb-6">Đăng nhập Hội viên</h3>
            <div id="googleBtn" className="flex justify-center mb-6 min-h-[44px]"></div>
            <button 
              onClick={() => setShowLoginModal(false)} 
              className="text-gray-400 text-[10px] uppercase font-bold"
            >
              Để sau
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;