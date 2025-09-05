import React, { useState, useEffect } from 'react';

// 사용자 데이터 타입 정의
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
  postCount: number;
}

// 대시보드 데이터 타입 정의
interface DashboardData {
  totalUsers: number;
  newPosts: number;
  activeSessions: number;
  recentLogins: User[];
  users: User[];
}

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: 0,
    newPosts: 0,
    activeSessions: 0,
    recentLogins: [],
    users: [],
  });

  // 사이드바의 열림/닫힘 상태를 관리하는 상태 변수
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<User['role']>('user');

  // 더미 데이터 로딩 함수
  const fetchDashboardData = () => {
    setTimeout(() => {
      // 더미 데이터
      const users: User[] = [
        { id: 1, name: '이중근', email: 'jg.lee@example.com', role: 'admin', status: 'active', lastLogin: '2024-08-27', postCount: 42 },
        { id: 2, name: '이규철', email: 'gc.lee@example.com', role: 'admin', status: 'active', lastLogin: '2024-08-27', postCount: 15 },
        { id: 3, name: '조윤호', email: 'yh.jo@example.com', role: 'admin', status: 'inactive', lastLogin: '2024-08-25', postCount: 8 },
        { id: 5, name: '정진영', email: 'jy.jeong@example.com', role: 'admin', status: 'active', lastLogin: '2024-08-26', postCount: 21 },
        { id: 4, name: '안기백', email: 'gb.an@example.com', role: 'admin', status: 'active', lastLogin: '2024-08-27', postCount: 55 },
        { id: 6, name: '김민지', email: 'mj.kim@example.com', role: 'user', status: 'inactive', lastLogin: '2024-08-24', postCount: 3 },
        { id: 7, name: '박서준', email: 'sj.park@example.com', role: 'user', status: 'active', lastLogin: '2024-08-27', postCount: 19 },
        { id: 8, name: '이하나', email: 'hn.lee@example.com', role: 'user', status: 'inactive', lastLogin: '2024-08-22', postCount: 7 },
        { id: 9, name: '최지훈', email: 'jh.choi@example.com', role: 'user', status: 'active', lastLogin: '2024-08-27', postCount: 30 },
        { id: 10, name: '윤아름', email: 'ar.yun@example.com', role: 'user', status: 'active', lastLogin: '2024-08-26', postCount: 12 },
        { id: 11, name: '정우성', email: 'ws.jung@example.com', role: 'user', status: 'inactive', lastLogin: '2024-08-20', postCount: 1 },
        { id: 12, name: '한소희', email: 'sh.han@example.com', role: 'user', status: 'active', lastLogin: '2024-08-27', postCount: 25 },
        { id: 13, name: '오민호', email: 'mh.oh@example.com', role: 'user', status: 'active', lastLogin: '2024-08-26', postCount: 38 },
        { id: 14, name: '강나윤', email: 'ny.kang@example.com', role: 'user', status: 'inactive', lastLogin: '2024-08-19', postCount: 5 },
        { id: 15, name: '서현우', email: 'hw.seo@example.com', role: 'user', status: 'active', lastLogin: '2024-08-27', postCount: 10 },
        { id: 16, name: '문채원', email: 'cw.moon@example.com', role: 'user', status: 'inactive', lastLogin: '2024-08-21', postCount: 2 },
        { id: 17, name: '김태현', email: 'th.kim@example.com', role: 'user', status: 'active', lastLogin: '2024-08-27', postCount: 29 },
        { id: 18, name: '배수지', email: 'sj.bae@example.com', role: 'user', status: 'active', lastLogin: '2024-08-27', postCount: 16 },
        { id: 19, name: '장동건', email: 'dg.jang@example.com', role: 'user', status: 'active', lastLogin: '2024-08-26', postCount: 50 },
        { id: 20, name: '송혜교', email: 'hk.song@example.com', role: 'user', status: 'inactive', lastLogin: '2024-08-18', postCount: 4 },
      ];

      const mockData: DashboardData = {
        totalUsers: 1258,
        newPosts: 45,
        activeSessions: 89,
        recentLogins: users.slice(0, 3), // 최근 접속자 3명
        users: users,
      };
      setDashboardData(mockData);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    setMessage('로그아웃 되었습니다.');
    setTimeout(() => setMessage(''), 3000);
  };
  
  // 사이드바 토글 핸들러
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 사용자 클릭 시 상세 정보 토글
  const handleUserClick = (user: User) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null);
      setSelectedRole('user');
    } else {
      setSelectedUser(user);
      setSelectedRole(user.role);
    }
  };

  // 권한 선택 변경 핸들러
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value as User['role']);
  };

  // 권한 업데이트 핸들러 (모의 API)
  const handleUpdateRole = () => {
    if (!selectedUser) return;
    
    setTimeout(() => {
      setDashboardData(prevData => {
        const updatedUsers = prevData.users.map(user =>
          user.id === selectedUser.id ? { ...user, role: selectedRole } : user
        );
        return { ...prevData, users: updatedUsers };
      });

      setSelectedUser(prevUser => (prevUser ? { ...prevUser, role: selectedRole } : null));

      setMessage(`${selectedUser.name}의 권한이 ${selectedRole === 'admin' ? '관리자' : '일반유저'}로 변경되었습니다.`);
      setTimeout(() => setMessage(''), 3000);

    }, 500);
  };

  // 현재 페이지 사용자 목록 계산
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = dashboardData.users.slice(indexOfFirstUser, indexOfLastUser);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(dashboardData.users.length / usersPerPage);

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedUser(null);
    }
  };

  // 이전 페이지로 이동
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedUser(null);
    }
  };

  return (
    <div className="bg-[#0b0c10] text-white font-sans min-h-screen flex flex-col sm:flex-row">
      {/* 사이드바 */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-[#1f2833] border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#66fcf1]">Admin Panel</h2>
        </div>
        <nav className="mt-8 space-y-2 px-4">
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-white/80 hover:bg-[#45a29e]/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 12H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2 2m-2-2l-2-2m2 2l2 2" />
            </svg>
            <span>통계 리포트</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-white/80 hover:bg-[#45a29e]/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>고객 소통</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-white/80 hover:bg-[#45a29e]/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm-6-7a4 4 0 00-4 4v1h8v-1a6 6 0 00-4-4z" />
            </svg>
            <span>사용자 관리</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-white/80 hover:bg-[#45a29e]/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.527.288 1.5.371 2.572 1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>설정</span>
          </a>
        </nav>
      </div>
      
      {/* 메인 콘텐츠 영역 */}
      <div className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="w-full max-w-7xl mx-auto space-y-8 p-8 sm:p-4">
          <header className="w-full flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              {/* 사이드바 열기/닫기 버튼 */}
              <button 
                onClick={handleSidebarToggle} 
                className="p-2 rounded-full text-[#66fcf1] hover:bg-white/10 transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isSidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <h1 className="text-3xl sm:text-2xl font-bold tracking-tight text-[#00eaff]">관리자 대시보드</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-xl border border-[#00eaff] bg-[#00eaff] text-[#04121a] font-semibold transition-transform hover:scale-105 hover:shadow-lg hover:shadow-[#00eaff]/30"
            >
              로그아웃
            </button>
          </header>

          {message && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-500/80 backdrop-blur-md rounded-xl shadow-lg transition-all duration-300 z-50">
              {message}
            </div>
          )}

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl transition-transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-2 opacity-80">총 사용자 수</h3>
              <p className="text-4xl font-bold text-[#00eaff]">
                {loading ? '...' : dashboardData.totalUsers}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl transition-transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-2 opacity-80">신규 게시물</h3>
              <p className="text-4xl font-bold text-[#00eaff]">
                {loading ? '...' : dashboardData.newPosts}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl transition-transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-2 opacity-80">현재 접속자</h3>
              <p className="text-4xl font-bold text-[#00eaff]">
                {loading ? '...' : dashboardData.activeSessions}
              </p>
            </div>
          </section>

          {/* 최근 접속자 섹션 추가 */}
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
                        <span className={`text-xs font-medium rounded-full px-2 py-1 ${
                          user.role === 'admin' ? 'bg-[#00eaff]/20 text-[#00eaff]' : 'bg-gray-400/20 text-gray-300'
                        }`}>
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

          <section className="w-full">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-6 opacity-80">사용자 목록</h3>
              {loading ? (
                <div className="text-center py-12 text-white/50">데이터를 불러오는 중...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="p-4 font-semibold text-white/70">번호</th>
                        <th className="p-4 font-semibold text-white/70">이름</th>
                        <th className="p-4 font-semibold text-white/70">이메일</th>
                        <th className="p-4 font-semibold text-white/70">권한</th>
                        <th className="p-4 font-semibold text-white/70">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user, index) => (
                        <React.Fragment key={user.id}>
                          <tr
                            className="border-b border-white/5 transition-all hover:bg-white/10 cursor-pointer"
                            onClick={() => handleUserClick(user)}
                          >
                            <td className="p-4 text-white/80">{indexOfFirstUser + index + 1}</td>
                            <td className="p-4 text-white/80">{user.name}</td>
                            <td className="p-4 text-white/80">{user.email}</td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  user.role === 'admin' ? 'bg-[#00eaff]/20 text-[#00eaff]' : 'bg-gray-400/20 text-gray-300'
                                }`}
                              >
                                {user.role === 'admin' ? '관리자' : '일반유저'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                }`}
                              >
                                {user.status === 'active' ? '접속중' : '비접속'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5}>
                              <div
                                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                  selectedUser && selectedUser.id === user.id ? 'max-h-96 opacity-100 p-6' : 'max-h-0 opacity-0 p-0'
                                }`}
                              >
                                {selectedUser && selectedUser.id === user.id && (
                                  <div className="bg-white/5 rounded-lg p-4 space-y-4">
                                    <h4 className="font-semibold text-white/90">상세 정보</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div><strong>ID:</strong> {selectedUser.id}</div>
                                      <div><strong>이메일:</strong> {selectedUser.email}</div>
                                      <div><strong>마지막 접속:</strong> {selectedUser.lastLogin}</div>
                                      <div><strong>게시물 수:</strong> {selectedUser.postCount}</div>
                                      <div><strong>상태:</strong> {selectedUser.status === 'active' ? '접속중' : '비접속'}</div>
                                      <div>
                                        <strong>권한:</strong>
                                        <select
                                          value={selectedRole}
                                          onChange={handleRoleChange}
                                          className="ml-2 bg-gray-700 text-white rounded-md p-1 border border-gray-600"
                                        >
                                          <option value="admin">관리자</option>
                                          <option value="user">일반유저</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="flex justify-end">
                                      <button
                                        onClick={handleUpdateRole}
                                        className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold transition-transform hover:scale-105 hover:bg-blue-600"
                                      >
                                        변경
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-6 flex justify-center items-center space-x-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-white/20"
                >
                  이전
                </button>
                <span className="text-white/80">
                  페이지 {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-white/20"
                >
                  다음
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
