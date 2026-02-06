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
    if (!user && showLoginModal) {
      const handleResponse = (response: any) => {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        onGoogleLogin(payload.email, payload.name, payload.picture);
        setShowLoginModal(false);
      };

      const initGoogle = () => {
        if (window.google?.accounts) {
          window.google.accounts.id.initialize({
            client_id: "882743803439-1c1qoa24f5cvn0ir99i1b465qg3r8qgs.apps.googleusercontent.com",
            callback: handleResponse,
          });
          window.google.accounts.id.renderButton(document.getElementById("googleBtn"), { theme: "outline", size: "large", width: "100%" });
        }
      };
      setTimeout(initGoogle, 500);
    }
  }, [user, showLoginModal]);

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
              <button onClick={() => setShowLoginModal(true)} className="bg-white text-teal-900 px-4 py-2 rounded-full text-[10px] font-black">ĐĂNG NHẬP</button>
            ) : (
              <div className="flex items-center gap-3">
                {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                  <button onClick={onToggleAdmin} className="bg-amber-500 p-2 rounded-xl text-white">⚙️</button>
                )}
                <img src={user.avatar} className="w-8 h-8 rounded-full border-2 border-teal-500" alt="avt" />
                <button onClick={onLogout} className="text-red-400 font-bold text-xs">THOÁT</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 text-center">
            <h3 className="text-xl font-black text-teal-900 uppercase mb-6">Đăng nhập Hội viên</h3>
            <div id="googleBtn" className="flex justify-center mb-6"></div>
            <button onClick={() => setShowLoginModal(false)} className="text-gray-400 text-[10px] uppercase font-bold">Để sau</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;