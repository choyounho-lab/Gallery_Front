// src/pages/AdminDashboard.tsx

import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import UserManagement from './UserManagement';
import Dashboard from './Dashboard';
import Communication from './Communication';
import Settings from './Settings';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const handleLogout = () => {
    setMessage('로그아웃 되었습니다.');
    setTimeout(() => setMessage(''), 3000);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return <Dashboard setMessage={setMessage} />;
      case 'users':
        return <UserManagement setMessage={setMessage} />;
      case 'communication':
        return <Communication setMessage={setMessage} />;
      case 'settings':
        return <Settings setMessage={setMessage} />;
      default:
        return <Dashboard setMessage={setMessage} />;
    }
  };

  return (
    <div className="bg-[#0b0c10] text-white font-sans min-h-screen flex flex-col sm:flex-row">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        onMenuClick={handleMenuClick}
      />
      <div className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'sm:ml-64' : 'sm:ml-0'}`}>
        <div className="w-full max-w-7xl mx-auto space-y-8 p-8 sm:p-4">
          <header className="w-full flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button onClick={handleSidebarToggle} className="p-2 rounded-full text-[#66fcf1] hover:bg-white/10 transition-colors" aria-label="Toggle sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isSidebarOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
              <h1 className="text-3xl sm:text-2xl font-bold tracking-tight text-[#00eaff]">관리자 대시보드</h1>
            </div>
            <button onClick={handleLogout} className="px-6 py-2 rounded-xl border border-[#00eaff] bg-[#00eaff] text-[#04121a] font-semibold transition-transform hover:scale-105 hover:shadow-lg hover:shadow-[#00eaff]/30">
              로그아웃
            </button>
          </header>

          {message && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-500/80 backdrop-blur-md rounded-xl shadow-lg transition-all duration-300 z-50">
              {message}
            </div>
          )}

          {renderContent()}
        </div>
      </div>
    </div>
  );
}