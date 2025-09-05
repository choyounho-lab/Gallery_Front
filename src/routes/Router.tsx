import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import Login from "../member/Login";
import Collection from "../pages/Collection";
import Home2 from "../pages/Home2";

function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home2 />} />

          {/* 로그인 */}
          <Route path="member/login" element={<Login />} />
          <Route path="collection" element={<Collection />} />
        </Route>
      </Routes>
    </>
  );
}
export default Router;
