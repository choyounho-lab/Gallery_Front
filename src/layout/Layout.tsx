import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import styled from "styled-components";
import { useSettings, themes } from "../contexts/SettingsContext";

// DOM으로 안 내려가게 $ 접두어 사용
const LayoutWrapper = styled.div<{ $bg: string; $fg: string }>`
  min-height: 100vh;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
`;

const Layout = () => {
  const { theme } = useSettings();
  const themeColors = themes[theme];

  return (
    <LayoutWrapper $bg={themeColors.bg} $fg={themeColors.color}>
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
    </LayoutWrapper>
  );
};

export default Layout;
