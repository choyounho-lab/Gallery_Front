// src/pages/Settings.tsx
import React, { useState } from 'react';

interface SettingsProps {
  setMessage: (msg: string) => void;
}

export default function Settings({ setMessage }: SettingsProps) {
  // 상태 관리 (백엔드 없이 프론트엔드에서만 동작)
  const [notifications, setNotifications] = useState<boolean>(true); // 기본값: 알림 켜기

  const handleSaveSettings = () => {
    // 설정 저장 로직 (실제 백엔드 연동)
    setMessage('설정이 저장되었습니다.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl space-y-8">
      
      {/* 알림 설정 */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <h3 className="text-xl font-semibold opacity-80 text-white">알림 설정</h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            value="" 
            className="sr-only peer" 
            checked={notifications} 
            onChange={() => {
              setNotifications(!notifications);
              setMessage(`알림이 ${notifications ? '비활성화' : '활성화'}되었습니다.`);
              setTimeout(() => setMessage(''), 3000);
            }} 
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-green-500 peer-focus:outline-none after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-green-500"></div>
          <span className="ml-3 text-sm font-medium text-white/80">{notifications ? '알림 켜기' : '알림 끄기'}</span>
        </label>
      </div>

      {/* 설정 저장 버튼 */}
      <div className="flex justify-end pt-4">
        <button
          className="py-2 px-6 rounded-lg bg-white/20 text-white font-bold transition-colors hover:bg-white/30"
          onClick={handleSaveSettings}
        >
          설정 저장
        </button>
      </div>

    </div>
  );
}