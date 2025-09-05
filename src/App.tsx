import React from "react";
import { BrowserRouter } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import { GlobalStyleWrapper } from "./style/GlobalStyleWrapper";
import Router from "./routes/Router";

function App() {
  return (
    <SettingsProvider>
      <GlobalStyleWrapper>
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "inherit",
            color: "inherit",
          }}
        >
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </div>{" "}
      </GlobalStyleWrapper>
    </SettingsProvider>
  );
}

export default App;
