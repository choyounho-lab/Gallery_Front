import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
* {
    box-sizing: border-box;
}
body {
    font-family: "Noto Sans KR", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
}
.noto-sans-kr-400 {
    font-family: "Noto Sans KR", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
}
.noto-sans-kr-700 {
    font-family: "Noto Sans KR", sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
}
.noto-sans-kr-800 {
    font-family: "Noto Sans KR", sans-serif;
    font-optical-sizing: auto;
    font-weight: 800;
    font-style: normal;
}

.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-custom::-webkit-scrollbar-thumb {
  background-color: rgba(230, 224, 224, 0.7);
  border-radius: 4px;
}
.scrollbar-custom::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background-color: #777;
}
  

.transition-all {
  transition: all 0.3s ease-in-out;
}






`;
