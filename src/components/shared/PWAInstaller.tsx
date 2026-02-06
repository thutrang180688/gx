import React, { useState, useEffect } from 'react';

const PWAInstaller: React.FC = () => {
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setPrompt(e);
    });
  }, []);

  if (!prompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50">
      <div className="bg-teal-900 text-white p-4 rounded-3xl flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-900 font-black">GX</div>
          <div>
            <p className="text-xs font-black uppercase">Cài đặt Ứng dụng</p>
            <p className="text-[8px] opacity-70">Để truy cập nhanh hơn từ màn hình chính</p>
          </div>
        </div>
        <button 
          onClick={() => prompt.prompt()}
          className="bg-white text-teal-900 px-4 py-2 rounded-xl text-[10px] font-black"
        >
          CÀI ĐẶT
        </button>
      </div>
    </div>
  );
};

export default PWAInstaller;