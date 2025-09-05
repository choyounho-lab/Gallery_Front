import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import styled from "styled-components";
import { useSettings, themes } from "../contexts/SettingsContext";

const LayoutWrapper = styled.div<{ bg: string; color: string }>`
  min-height: 100vh;
  background-color: ${({ bg }) => bg};
  color: ${({ color }) => color};
`;

const Layout = () => {
  const { theme } = useSettings();
  const themeColors = themes[theme];

  return (
    <LayoutWrapper bg={themeColors.bg} color={themeColors.color}>
      <Header />
      <main className="pt-16"></main>
      <Outlet />
    </LayoutWrapper>
  );
};

export default Layout;
