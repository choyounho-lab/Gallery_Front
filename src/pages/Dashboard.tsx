// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardData, User } from '../types/Admin'; // Admin.ts에서 타입 불러오기

const API_BASE_URL = 'http://localhost:8000';

interface DashboardProps {
  setMessage: (msg: string) => void;
}

export default function Dashboard({ setMessage }: DashboardProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: 0,
    newPosts: 0,
    activeSessions: 0,
    recentLogins: [],
    users: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const usersResponse = await axios.get<User[]>(`${API_BASE_URL}/admin/users`);
      const usersFromDb = usersResponse.data;
      setDashboardData({
        totalUsers: usersFromDb.length,
        newPosts: 45, // 이 부분은 백엔드 API로 대체해야 합니다.
        activeSessions: 89, // 이 부분도 백엔드 API로 대체해야 합니다.
        recentLogins: usersFromDb.slice(0, 3),
        users: usersFromDb,
      });
      setMessage('대시보드 데이터를 성공적으로 불러왔습니다.');
    } catch (error) {
      console.error('데이터를 불러오는 데 실패했습니다.', error);
      setMessage('대시보드 데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl transition-transform hover:scale-105">
          <h3 className="text-xl font-semibold mb-2 opacity-80">총 사용자 수</h3>
          <p className="text-4xl font-bold text-[#00eaff]">{loading ? '...' : dashboardData.totalUsers}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl transition-transform hover:scale-105">
          <h3 className="text-xl font-semibold mb-2 opacity-80">신규 게시물</h3>
          <p className="text-4xl font-bold text-[#00eaff]">{loading ? '...' : dashboardData.newPosts}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl transition-transform hover:scale-105">
          <h3 className="text-xl font-semibold mb-2 opacity-80">현재 접속자</h3>
          <p className="text-4xl font-bold text-[#00eaff]">{loading ? '...' : dashboardData.activeSessions}</p>
        </div>
      </section>
      <section className="w-full">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold mb-6 opacity-80">최근 접속자</h3>
          {loading ? (
            <div className="text-center py-6 text-white/50">데이터를 불러오는 중...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData.recentLogins.map(user => (
                <div key={user.id} className="p-4 bg-white/5 rounded-lg border border-white/10 transition-transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg text-white/90">{user.name}</span>
                    <span className={`text-xs font-medium rounded-full px-2 py-1 ${user.role === 'admin' ? 'bg-[#00eaff]/20 text-[#00eaff]' : 'bg-gray-400/20 text-gray-300'}`}>
                      {user.role === 'admin' ? '관리자' : '일반유저'}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mt-2">{user.email}</p>
                  <p className="text-xs text-white/50 mt-1">최근 접속: {user.lastLogin}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}