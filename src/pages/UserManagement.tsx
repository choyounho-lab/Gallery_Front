// src/pages/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, DashboardData } from '../types/Admin'; // 타입을 별도의 파일로 분리하는 것이 좋습니다.

const API_BASE_URL = 'http://localhost:8000';

interface UserManagementProps {
  setMessage: (msg: string) => void;
}

export default function UserManagement({ setMessage }: UserManagementProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<User['role']>('user');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<User[]>(`${API_BASE_URL}/admin/users`);
      setUsers(response.data);
      setMessage('사용자 데이터를 성공적으로 불러왔습니다.');
    } catch (error) {
      console.error('데이터를 불러오는 데 실패했습니다.', error);
      setMessage('데이터를 불러오는 데 실패했습니다. 서버를 확인해주세요.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (user: User) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
      setSelectedRole(user.role);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value as User['role']);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    try {
      await axios.put(`${API_BASE_URL}/admin/users/${selectedUser.id}/role`, { role: selectedRole });
      setUsers(users.map(user =>
        user.id === selectedUser.id ? { ...user, role: selectedRole } : user
      ));
      setSelectedUser(prevUser => (prevUser ? { ...prevUser, role: selectedRole } : null));
      setMessage(`${selectedUser.name}의 권한이 ${selectedRole === 'admin' ? '관리자' : '일반유저'}로 변경되었습니다.`);
    } catch (error) {
      console.error('권한 업데이트 실패:', error);
      setMessage('권한 업데이트에 실패했습니다.');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedUser(null);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedUser(null);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold mb-6 opacity-80">사용자 목록</h3>
      {loading ? (
        <div className="text-center py-12 text-white/50">데이터를 불러오는 중...</div>
      ) : (
        <div className="overflow-x-auto">
          {/* 테이블 JSX */}
          <table className="min-w-full text-left">
            <thead>
              {/*...*/}
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <React.Fragment key={user.id}>
                  <tr onClick={() => handleUserClick(user)} className="border-b border-white/5 transition-all hover:bg-white/10 cursor-pointer">
                    <td className="p-4 text-white/80">{indexOfFirstUser + index + 1}</td>
                    <td className="p-4 text-white/80">{user.name}</td>
                    <td className="p-4 text-white/80">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-[#00eaff]/20 text-[#00eaff]' : 'bg-gray-400/20 text-gray-300'}`}>
                        {user.role === 'admin' ? '관리자' : '일반유저'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {user.status === 'active' ? '접속중' : '비접속'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5}>
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${selectedUser && selectedUser.id === user.id ? 'max-h-96 opacity-100 p-6' : 'max-h-0 opacity-0 p-0'}`}>
                        {selectedUser && selectedUser.id === user.id && (
                          <div className="bg-white/5 rounded-lg p-4 space-y-4">
                            <h4 className="font-semibold text-white/90">상세 정보</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div><strong>ID:</strong> {selectedUser.id}</div>
                              <div><strong>이메일:</strong> {selectedUser.email}</div>
                              <div><strong>마지막 접속:</strong> {selectedUser.lastLogin}</div>
                              <div><strong>게시물 수:</strong> {selectedUser.postCount}</div>
                              <div>
                                <strong>권한:</strong>
                                <select value={selectedRole} onChange={handleRoleChange} className="ml-2 bg-gray-700 text-white rounded-md p-1 border border-gray-600">
                                  <option value="admin">관리자</option>
                                  <option value="user">일반유저</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button onClick={handleUpdateRole} className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold transition-transform hover:scale-105 hover:bg-blue-600">
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
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-4 py-2 rounded-lg bg-white/10 text-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-white/20">
          이전
        </button>
        <span className="text-white/80">
          페이지 {currentPage} / {Math.ceil(users.length / usersPerPage)}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg bg-white/10 text-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-white/20">
          다음
        </button>
      </div>
    </div>
  );
}