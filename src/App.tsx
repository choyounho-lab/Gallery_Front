import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import "./global.css"; // 아래 6) 참고 (선택)

function App() {
  return (
    <>
      <Header />
      <Home />
    </>
  );
}

export default App;
