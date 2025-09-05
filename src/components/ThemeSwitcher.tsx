import React from "react";
import styled from "styled-components";
import { useSettings } from "../contexts/SettingsContext";

const SwitcherContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ThemeButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ $active }) => ($active ? "#000" : "#ccc")};
  background-color: ${({ $active }) => ($active ? "#000" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  user-select: none;

  &:hover {
    border-color: #000;
  }
`;

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useSettings();

  const options = [
    { value: "default", label: "기본 모드" },
    { value: "white", label: "화이트 모드" },
    { value: "contrast", label: "고대비 모드" },
  ];

  return (
    <SwitcherContainer>
      {options.map((opt) => (
        <ThemeButton
          key={opt.value}
          $active={theme === opt.value}
          onClick={() =>
            setTheme(opt.value as "default" | "white" | "contrast")
          }
        >
          {opt.label}
        </ThemeButton>
      ))}
    </SwitcherContainer>
  );
};
