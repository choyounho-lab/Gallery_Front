// AppRoutes.tsx  ← 파일/컴포넌트명 변경 권장
import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
// import Admin from "../pages/Admin"; // 필요 시 사용
import Login from "../member/Login";
import Collection from "../pages/Collection";
import RelicDetailPage from "../pages/RelicDetailPage";

import ExhibitionPage from "../pages/ExhibitionPage";

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

          {/* 전시 페이지 */}
          <Route path="exhibition/:type" element={<ExhibitionPage />} />
        </Route>
      </Routes>
    </>
  );
}
