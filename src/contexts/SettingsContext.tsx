import React, { createContext, useContext, useState } from "react";

export const themes = {
  default: {
    bg: "#1e1e1e",
    color: "#f5f5f5",
    border: "rgba(255,255,255,0.15)",
  },
  white: { bg: "#ffffff", color: "#000000", border: "rgba(0,0,0,0.15)" },
  contrast: { bg: "gray", color: "#f5f5f5", border: "rgba(0,0,0,0.25)" },
};
type ThemeType = keyof typeof themes;
type FontSizeType = "small" | "medium" | "large";

type SettingsContextType = {
  theme: ThemeType;
  fontSize: FontSizeType;
  setTheme: (theme: ThemeType) => void;
  setFontSize: (size: FontSizeType) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>("default");
  const [fontSize, setFontSize] = useState<FontSizeType>("medium");

  return (
    <SettingsContext.Provider
      value={{ theme, fontSize, setTheme, setFontSize }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
