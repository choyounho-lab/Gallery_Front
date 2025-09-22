import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Login from "../member/Login";
import Collection from "../pages/Collection";
import RelicDetailPage from "../pages/RelicDetailPage";


function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* 로그인 */}
        
      </Route>
<Route path="member/login" element={<Login />} />
      <Route path="collection" element={<Collection />} />
      <Route path="/detail/:id" element={<RelicDetailPage />} />
      {/* 어드민 */}
        <Route path="admin" element={<Admin />} />
    </Routes>
  );
}
export default Router;
