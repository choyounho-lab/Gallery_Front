import React from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { useSettings, themes } from "../../contexts/SettingsContext";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarContainer = styled.aside<{
  $isOpen: boolean;
  $bg: string;
  $color: string;
}>`
  position: fixed;
  top: 0;
  left: ${({ $isOpen }) => ($isOpen ? "0" : "-500px")};
  width: 500px;
  height: 100%;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  transition: left 0.4s ease-in-out, background 0.3s, color 0.3s;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  box-sizing: border-box;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1200;
`;

const SidebarContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow-y: auto;
  transform: translateY(-12%);

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 0;
  }

  hr {
    border: none;
    border-top: 1px solid gray;
    width: 100%;
    margin: 2rem 0;
  }

  p {
    color: inherit;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
`;

const OptionGroup = styled.div`
  margin-bottom: 2rem;
`;

const OptionLabel = styled.span`
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FontSizeButton = styled.button<{ $active: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? "#000" : "#ccc")};
  background-color: ${({ $active }) => ($active ? "#000" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  border-radius: 50px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    border-color: #000;
  }
`;

const ThemeLabel = styled.label<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ $active }) => ($active ? "#000" : "#ccc")};
  background-color: ${({ $active }) => ($active ? "#000" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  user-select: none;
`;

const ThemeInput = styled.input`
  display: none;
`;

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, fontSize, setFontSize } = useSettings();

  const fontSizes = [
    { label: "가", size: "small" },
    { label: "가", size: "medium" },
    { label: "가", size: "large" },
  ];

  const themeOptions = [
    { value: "default", label: "기본" },
    { value: "white", label: "화이트모드" },
    { value: "contrast", label: "고대비모드" },
  ];

  const themeColors = themes[theme];

  return (
    <SidebarContainer
      $isOpen={isOpen}
      $bg={themeColors.bg}
      $color={themeColors.color}
    >
      <SidebarHeader>
        <CloseButton onClick={onClose}>
          <AiOutlineClose />
        </CloseButton>
      </SidebarHeader>

      <SidebarContent>
        <h2>안녕하세요 BELLARTE입니다.</h2>
        <hr />
        <p>아래 옵션을 조정하여 알맞은 탐색 환경을 만들어보세요.</p>

        <OptionGroup>
          <OptionLabel>글자 크기</OptionLabel>
          <ButtonGroup>
            {fontSizes.map((fs) => (
              <FontSizeButton
                key={fs.size}
                $active={fontSize === fs.size}
                onClick={() =>
                  setFontSize(fs.size as "small" | "medium" | "large")
                }
              >
                {fs.label}
              </FontSizeButton>
            ))}
          </ButtonGroup>
        </OptionGroup>

        <OptionGroup>
          <OptionLabel>추천 옵션</OptionLabel>
          <ThemeSwitcher />
          {/* <ButtonGroup>
            {themeOptions.map((th) => (
              <React.Fragment key={th.value}>
                <ThemeInput
                  type="radio"
                  id={`theme-${th.value}`}
                  name="theme"
                  value={th.value}
                  checked={theme === th.value}
                  onChange={() =>
                    setTheme(th.value as "default" | "white" | "contrast")
                  }
                />
                <ThemeLabel
                  htmlFor={`theme-${th.value}`}
                  $active={theme === th.value}
                  onClick={() =>
                    setTheme(th.value as "default" | "white" | "contrast")
                  }
                >
                  {th.label}
                </ThemeLabel>
              </React.Fragment>
            ))}
          </ButtonGroup> */}
        </OptionGroup>
      </SidebarContent>
    </SidebarContainer>
  );
};
