import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import Login from "../member/Login"; // ✅ 여기 추가

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* 로그인 */}
        <Route path="member/login" element={<Login />} />
      </Route>
    </Routes>
  );
}
export default Router;
