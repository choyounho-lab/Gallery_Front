// App.tsx
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import {
  SettingsProvider,
  useSettings,
  themes,
} from "./contexts/SettingsContext";
import { GlobalStyleWrapper } from "./style/GlobalStyleWrapper";
import Router from "./routes/Router";

const AppContent: React.FC = () => {
  const { theme, fontSize, setTheme, setFontSize } = useSettings();
  const themeColors = themes[theme];

  // localStorage에서 값 불러오기 (새로고침 시 적용)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as keyof typeof themes;
    const savedFontSize = localStorage.getItem("fontSize") as
      | "small"
      | "medium"
      | "large";

    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
  }, []);

  // 테마 변경 시 localStorage 저장
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 글자 크기 변경 시 localStorage 저장
  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: themeColors.bg,
        color: themeColors.color,
        fontSize:
          fontSize === "small"
            ? "14px"
            : fontSize === "medium"
            ? "16px"
            : "18px",
        transition: "all 0.3s",
      }}
    >
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <GlobalStyleWrapper>
        <AppContent />
      </GlobalStyleWrapper>
    </SettingsProvider>
  );
}

export default App;
