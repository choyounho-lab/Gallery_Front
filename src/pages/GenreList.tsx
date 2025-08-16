// src/pages/GenreList.tsx
import { Link } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { selectDisplayMode } from "../store/displayMode"; // 경로 확인 필수
import PopularArtistSlider from "../components/Artist/PopularArtists";
import PopularAlbumSlider from "../components/Album/PopularAlbum";

function GenreList() {
  const isDarkMode = useSelector(selectDisplayMode); // Redux 다크모드 상태

  interface GenreListType {
    id: number;
    name: string;
    color: string;
  }

  const darkenHexColor = (hex: string, percent: number): string => {
    let f = parseInt(hex.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = f >> 16,
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff;
    return (
      "#" +
      (
        0x1000000 +
        (Math.round((t - R) * p) + R) * 0x10000 +
        (Math.round((t - G) * p) + G) * 0x100 +
        (Math.round((t - B) * p) + B)
      )
        .toString(16)
        .slice(1)
    );
  };

  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const genreList: GenreListType[] = [
    { id: 1, name: "Pop", color: "#251a36ff" },
    { id: 2, name: "Ballad", color: "#643255ff" },
    { id: 3, name: "K-Pop", color: "#47222bff" },
    { id: 4, name: "R&B", color: "#533429ff" },
    { id: 5, name: "Hip-hop", color: "#615134ff" },
    { id: 6, name: "Jazz", color: "#5f5f33ff" },
    { id: 7, name: "Classical", color: "#324d5eff" },
    { id: 8, name: "OST", color: "#254049ff" },
    { id: 9, name: "Trot", color: "#401f75ff" },
    { id: 10, name: "EDM", color: "#195a63ff" },
    { id: 11, name: "Rock", color: "#70341eff" },
    { id: 12, name: "Dance", color: "#6A0572" },
    { id: 13, name: "Indie", color: "#2C5F2D" },
    { id: 14, name: "Acoustic", color: "#4B4453" },
    { id: 15, name: "Other", color: "#070808" },
    { id: 16, name: "Soul", color: "#A084DC" },
    { id: 17, name: "Funk", color: "#443f2dff" },
    { id: 18, name: "Reggae", color: "#176853ff" },
  ];

  return (
    <div
      className={`max-w-7xl mx-auto px-4 py-12 ${
        isDarkMode ? "   text-white" : " text-black"
      }`}
    >
      {/* 헤더 */}
      <div
        className="w-full py-10 text-center rounded-lg mb-10 shadow-lg"
        style={{
          boxShadow: isDarkMode
            ? "0 8px 24px rgba(255, 255, 255, 0.2)"
            : "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 className="text-4xl font-extrabold mb-6 drop-shadow-lg">
          장르 선택
        </h2>
        <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
          원하는 장르를 선택하고 원하는 노래를 추천 받아보세요.
        </p>
      </div>

      {/* 장르 리스트 */}
      <div className="relative">
        <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? "" : ""}`}>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[380px] overflow-y-auto pr-2 pb-2">
            {genreList.map((item: GenreListType) => (
              <li key={item.id}>
                <Link to={`/genreListDetail/${item.name.replace(/\s+/g, "")}`}>
                  <div
                    className="rounded-xl h-16 sm:h-18 md:h-14 flex items-center justify-center relative overflow-hidden
                      transition-all duration-300 hover:scale-[1.05] hover:brightness-110 group cursor-pointer shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(
                        item.color,
                        1
                      )}, ${hexToRgba(darkenHexColor(item.color, 0.8), 0.3)})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-30 transition duration-300 rounded-xl" />
                    <p className="text-white text-lg font-semibold z-10 drop-shadow text-center px-2">
                      {item.name}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 아티스트 / 앨범 */}
      <div className="mt-20 space-y-20">
        <PopularArtistSlider />
        <PopularAlbumSlider />
      </div>
    </div>
  );
}

export default GenreList;
