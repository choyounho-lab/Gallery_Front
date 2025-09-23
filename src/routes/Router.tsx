// AppRoutes.tsx  ← 파일/컴포넌트명 변경 권장
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/Home';
// import Admin from "../pages/Admin"; // 필요 시 사용
import Login from '../member/Login';
import Collection from '../pages/Collection';
import ExhibitionPage from '../pages/ExhibitionPage';
import RelicDetailPage from '../pages/RelicDetailPage';
import AdminDashboard from '../pages/AdminDashboard'; // 어드민 대시보드 컴포넌트
export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* 메인 */}
                <Route index element={<Home />} />
                {/* 로그인 */}
                <Route path="member/login" element={<Login />} />
                {/* 전시/컬렉션 */}
                <Route path="exhibition/:type" element={<ExhibitionPage />} />
                <Route path="collection" element={<Collection />} />
                {/* 유물 상세 (오타 수정 + 파라미터화 + 상대경로) */}
                <Route path="detail/:id" element={<RelicDetailPage />} />
                {/* 필요 시
        <Route path="admin" element={<Admin />} />
        */}
                {/* 404(선택)
        <Route path="*" element={<NotFound />} />
        */}

                <Route path="collection" element={<Collection />} />
                {/* 어드민 */}
                <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
        </Routes>
    );
}
