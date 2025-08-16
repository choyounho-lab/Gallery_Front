// src/components/LightOrDarkToggleBtn.tsx
import React from "react";
import { useSelector } from "react-redux";
import { selectDisplayMode } from "../../store/displayMode";

interface LightOrDarkToggleBtnProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const LightOrDarkToggleBtn = ({
  isDarkMode,
  toggleDarkMode,
}: LightOrDarkToggleBtnProps) => {
  const darkMode = useSelector(selectDisplayMode);

  return (
    <div className="hidden 2xl:flex items-center space-x-4 select-none mr-10 ">
      <span
        className={`font-bold text-white ${
          !isDarkMode ? "opacity-100" : "opacity-40"
        } transition-opacity duration-500`}
      >
        LIGHT
      </span>

      <button
        onClick={toggleDarkMode}
        className={`relative w-20 h-9 rounded-full transition-colors duration-500 ease-in-out
          ${isDarkMode ? "bg-gray-800 shadow-lg" : "bg-gray-200 shadow-md"}
        `}
        aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
      >
        <div
          className={`absolute top-0  w-9 h-9 rounded-full transition-transform duration-500 ease-in-out
            ${
              isDarkMode
                ? "translate-x-12 bg-gray-100"
                : "translate-x-0 bg-white"
            }
          `}
          style={{
            boxShadow: isDarkMode
              ? "0 0 15px 3px rgba(90, 90, 90, 0.7)"
              : "0 0 10px 2px rgba(0, 0, 0, 0.8)",
          }}
        >
          {isDarkMode && (
            <>
              <div className="absolute top-2 left-3 w-2 h-2 bg-gray-600 rounded-full opacity-60"></div>
              <div className="absolute bottom-3 right-2 w-3 h-3 bg-gray-600 rounded-full opacity-50"></div>
            </>
          )}
        </div>
      </button>

      <span
        className={`font-bold text-gray-100 ${
          isDarkMode ? "opacity-90" : "opacity-40"
        } transition-opacity duration-500`}
      >
        DARK
      </span>
    </div>
  );
};

export default LightOrDarkToggleBtn;
