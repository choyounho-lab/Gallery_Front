// src/types/Admin.ts

// 사용자 데이터 타입 정의
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
  postCount: number;
}

// 대시보드 데이터 타입 정의
export interface DashboardData {
  totalUsers: number;
  newPosts: number;
  activeSessions: number;
  recentLogins: User[];
  users: User[];
}