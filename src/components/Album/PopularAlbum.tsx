import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiGetWeeklyPopularAlbums } from "../../api/albumApi";
import { AlbumType } from "../../types/types";
import { RootState } from "../../store/store"; // ← store에서 RootState 가져오기
import { selectDisplayMode } from "../../store/displayMode";
import { Link } from "react-router-dom";

interface AlbumVO {
  albumId: number;
  spotifyAlbumId: String;
}

const PopularAlbumSlider = () => {
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Redux에서 다크모드 상태 가져오기
  const isDarkMode = useSelector(selectDisplayMode);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await apiGetWeeklyPopularAlbums();
        console.log("📦 주간 인기 앨범 데이터:", data);
        setAlbums(data);
      } catch (error) {
        console.error("❌ 주간 인기 앨범 로딩 실패:", error);
      }
    };
    fetchAlbums();
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <>
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            scrollbar-width: none;
          }
        `}
      </style>

      <div
        className={`relative w-full px-8 py-10 rounded-lg
    ${
      isDarkMode
        ? "shadow-[0_8px_16px_rgba(255,255,255,0.2)]" // 다크모드: 검정 그림자
        : "shadow-[0_8px_16px_rgba(0,0,0,0.2)]" // 라이트모드: 흰색 그림자
    }`}
      >
        <div
          className={`w-full py-10 mb-10 text-center rounded-lg ${
            isDarkMode
              ? "shadow-[0_8px_16px_rgba(255,255,255,0.2)]" // 다크모드: 검정 그림자
              : "shadow-[0_8px_16px_rgba(0,0,0,0.2)]" // 라이트모드: 흰색 그림자
          }`}
        >
          <h2
            className={`text-4xl font-extrabold mb-6 drop-shadow-lg ${
              isDarkMode ? "text-white" : ""
            }`}
          >
            주간 인기 앨범
          </h2>
          <p className={isDarkMode ? "text-white" : ""}>
            주간 가장 인기 있던 앨범을 만나보세요.
          </p>
        </div>

        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 z-10 p-3 rounded-full bg-white/90 text-black shadow-lg hover:bg-white transform -translate-y-0 mt-20 transition-colors duration-200"
          aria-label="왼쪽으로 스크롤"
        >
          ◀
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 z-10 p-3 rounded-full bg-white/90 text-black shadow-lg hover:bg-white transform -translate-y-0 mt-20 transition-colors duration-200"
          aria-label="오른쪽으로 스크롤"
        >
          ▶
        </button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar gap-8 pb-6 scroll-smooth"
        >
          {albums.map((album) => (
            <div
              key={album.spotifyAlbumId}
              className="group relative flex-shrink-0 w-64 h-80 cursor-pointer overflow-hidden rounded-xl transition-shadow duration-300 transform hover:scale-105 hover:z-20"
              style={{ boxShadow: "0 4px 12px rgba(255, 255, 255, 0.2)" }}
            >
              <Link
                to={`/albumDetail?id=${encodeURIComponent(
                  album.spotifyAlbumId
                )}&search=${encodeURIComponent(album.albumTitle)}`}
                key={album.spotifyAlbumId}
                className="group relative flex-shrink-0 w-64 h-80 cursor-pointer overflow-hidden rounded-xl transition-shadow duration-300 transform hover:scale-105 hover:z-20"
                style={{ boxShadow: "0 4px 12px rgba(255, 255, 255, 0.2)" }}
              >
                <img
                  src={album.albumCoverImage}
                  alt={album.albumTitle}
                  className="h-full w-full object-cover transition-filter duration-300 group-hover:brightness-75"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 text-center text-md font-semibold text-white truncate transition-all duration-300 group-hover:text-2xl group-hover:font-bold">
                  {album.albumTitle}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PopularAlbumSlider;
