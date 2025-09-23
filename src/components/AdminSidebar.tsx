// src/components/AdminSidebar.tsx
import React from 'react';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  onMenuClick: (menu: string) => void;
}

export default function AdminSidebar({ isSidebarOpen, onMenuClick }: AdminSidebarProps) {
  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-[#1f2833] border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#66fcf1]">Admin Panel</h2>
      </div>
      <nav className="mt-8 space-y-2 px-4">
        {/* 메뉴 항목들 */}
        <a href="#" onClick={() => onMenuClick('dashboard')} className="flex items-center space-x-3 p-3 rounded-lg text-white/80 hover:bg-[#45a29e]/20 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 12H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2 2m-2-2l-2-2m2 2l2 2" />
          </svg>
          <span>통계 리포트</span>
        </a>
        <a href="#" onClick={() => onMenuClick('communication')} className="flex items-center space-x-3 p-3 rounded-lg text-white/80 hover:bg-[#45a29e]/20 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span>고객 소통</span>
        </a>
        <a href="#" onClick={() => onMenuClick('users')} className="flex items-center space-x-3 p-3 rounded-lg text-white/80 hover:bg-[#45a29e]/20 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm-6-7a4 4 0 00-4 4v1h8v-1a6 6 0 00-4-4z" />
          </svg>
          <span>사용자 관리</span>
        </a>
        <a href="#" onClick={() => onMenuClick('settings')} className="flex items-center space-x-3 p-3 rounded-lg text-white/80 hover:bg-[#45a29e]/20 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.527.288 1.5.371 2.572 1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>설정</span>
        </a>
      </nav>
    </div>
  );
}