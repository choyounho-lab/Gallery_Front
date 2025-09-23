import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Login from "../member/Login";
import Collection from "../pages/Collection";
import ExhibitionPage from "../pages/ExhibitionPage";

function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* 로그인 */}
          <Route path="member/login" element={<Login />} />
          <Route path="collection" element={<Collection />} />

          {/* 전시 페이지 */}
          <Route path="exhibition/:type" element={<ExhibitionPage />} />
        </Route>
      </Routes>
    </>
  );
}
export default Router;
