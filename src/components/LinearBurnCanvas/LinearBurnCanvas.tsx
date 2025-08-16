// LinearBurnCanvas.tsx
import React from "react";
import Logo123 from "../../assets/image/Logoblack.svg";
import Logo124 from "../../assets/image/LogoWhite.svg";
import { styles } from "./LinearBurnCanvasStyles";
import video from "../../assets/video/Bg-video.mp4";
import { useSelector } from "react-redux";
import { selectDisplayMode } from "../../store/displayMode";

interface Props {
  onScrollClick?: () => void;
}

export default function LinearBurnCanvas({ onScrollClick }: Props) {
  const isDarkMode = useSelector(selectDisplayMode);

  return (
    <>
      <style>{styles}</style>

      {/* 애니메이션 keyframes와 클래스 정의 */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .floating-button {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>

      <div className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-inter relative">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-[-1] opacity-100"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            filter: isDarkMode
              ? "grayscale(100%)"
              : "grayscale(100%) invert(100%)",
          }}
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 로고 */}
        <div className="logo-wrapper z-20 mb-4">
          <img
            src={isDarkMode ? Logo124 : Logo123}
            alt="logo"
            className="w-300 fade-out-logo"
          />
        </div>

        {/* 시작하기 버튼 */}
        <button
          onClick={onScrollClick}
          className={`floating-button z-20 mt-150 px-10 py-3 ml-12 text-lg rounded-full transition-all absolute
            ${
              isDarkMode
                ? "bg-black text-white shadow-[0_0_20px_white]"
                : "bg-white text-black shadow-[0_0_20px_black]"
            }
            hover:bg-gray-500`}
        >
          시작하기
        </button>
      </div>
    </>
  );
}
