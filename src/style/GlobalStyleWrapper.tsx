import React, { ReactNode } from "react";
import { createGlobalStyle } from "styled-components";
import { useSettings, themes } from "../contexts/SettingsContext";

interface Props {
  children: ReactNode;
}

interface GlobalStyleProps {
  bg: string;
  color: string;
  fontSize: string;
}

const GlobalStyle = createGlobalStyle<{
  fontSize: "small" | "medium" | "large";
  bg: string;
  color: string;
}>`
  * {
    color: inherit; /* 모든 요소에 상속 */
  }
  html, #root {
    background-color: ${({ bg }) => bg};
    color: ${({ color }) => color};
    height: 100%;
  }
  
  html {
    font-size: ${({ fontSize }) =>
      fontSize === "small"
        ? "0.75rem"
        : fontSize === "medium"
        ? "1rem"
        : "1.25rem"};
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans KR', sans-serif;
    transition: all 0.3s ease;
    background-color: transparent; /* #root에서 적용 */
    color: inherit;
    min-height: 100%;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

export const GlobalStyleWrapper: React.FC<Props> = ({ children }) => {
  const { theme, fontSize } = useSettings();
  const themeColors = themes[theme]; // themes에서 현재 theme 색상 가져오기
  console.log("테스트: " + theme);
  return (
    <>
      <GlobalStyle
        fontSize={fontSize}
        bg={themeColors.bg}
        color={themeColors.color}
      />
      {children}
    </>
  );
};
