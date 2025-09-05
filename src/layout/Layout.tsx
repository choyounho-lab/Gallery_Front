import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="pt-16"></main>
      <Outlet />
    </>
  );
};
export default Layout;
