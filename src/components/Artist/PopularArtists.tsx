import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { hostInstance } from "../../api/hostInstance";
import { useSelector } from "react-redux";
import { selectDisplayMode } from "../../store/displayMode";

interface ArtistVO {
  artistId: number;
  artistExternalId: string;
  artistName: string;
  profileImage: string;
}

export default function PopularArtistSlider({}) {
  const [items, setItems] = useState<ArtistVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);
  const [animationState, setAnimationState] = useState({
    transitionEnabled: true,
    isAnimating: false,
  });
  const isDarkMode = useSelector(selectDisplayMode);
  const originalItemsCount = items.length;

  const extendedItems = React.useMemo(() => {
    if (originalItemsCount === 0) return [];
    const clonedSuffix = items.slice(0, itemsPerPage);
    const clonedPrefix = items.slice(originalItemsCount - itemsPerPage);
    return [...clonedPrefix, ...items, ...clonedSuffix];
  }, [items, originalItemsCount, itemsPerPage]);

  useEffect(() => {
    if (items.length > 0) {
      setCurrentIndex(itemsPerPage);
      setLoading(false);
    }
  }, [items, itemsPerPage]);

  const updateItemsPerPage = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setItemsPerPage(5);
    } else if (window.innerWidth >= 768) {
      setItemsPerPage(3);
    } else {
      setItemsPerPage(1);
    }
  }, []);

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [updateItemsPerPage]);

  const prevImage = useCallback(() => {
    if (animationState.isAnimating) return;
    setAnimationState((prev) => ({
      ...prev,
      transitionEnabled: true,
      isAnimating: true,
    }));
    setCurrentIndex((prev) => prev - 1);
  }, [animationState.isAnimating]);

  const nextImage = useCallback(() => {
    if (animationState.isAnimating) return;
    setAnimationState((prev) => ({
      ...prev,
      transitionEnabled: true,
      isAnimating: true,
    }));
    setCurrentIndex((prev) => prev + 1);
  }, [animationState.isAnimating]);

  useEffect(() => {
    const currentTrack = sliderTrackRef.current;
    if (!currentTrack || originalItemsCount === 0) return;

    const handleTransitionEnd = () => {
      setAnimationState((prev) => ({ ...prev, isAnimating: false }));
      if (currentIndex === 0) {
        setAnimationState((prev) => ({ ...prev, transitionEnabled: false }));
        setCurrentIndex(originalItemsCount);
      } else if (currentIndex >= originalItemsCount + itemsPerPage) {
        setAnimationState((prev) => ({ ...prev, transitionEnabled: false }));
        setCurrentIndex(itemsPerPage);
      }
    };

    currentTrack.addEventListener("transitionend", handleTransitionEnd);
    return () => {
      currentTrack.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [currentIndex, originalItemsCount, itemsPerPage]);

  const getCenterImageExtendedIndex = useCallback(() => {
    return currentIndex + Math.floor((itemsPerPage - 1) / 2);
  }, [currentIndex, itemsPerPage]);

  useEffect(() => {
    setLoading(true);
    hostInstance
      .get<ArtistVO[]>("popular-artists/weekly?offset=0&fetch=8")
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("인기 아티스트 불러오기 실패", err);
        setLoading(false);
      });
  }, []);

  const styles = `
    .slider-track {
      display: flex;
      transition: transform 0.5s ease-in-out;
    }
    .slider-track.no-transition {
      transition: none;
    }
    .slider-item {
      flex: 0 0 calc(100% / var(--items-per-page));
      padding: 0.5rem;
      padding-top: 1rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      transform: scale(0.9);
      opacity: 0.6;
      transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
      cursor: pointer;
      text-decoration: none;
    }
    .slider-item.is-center {
      transform: scale(1.1);
      opacity: 1;
    }
    .slider-item img {
      width: 100%;
      height: auto;
      border-radius: 50%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      margin-bottom: 0.5rem;
    }
    .artist-name-overlay {
      background-color: rgba(255, 255, 255, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      text-align: center;
      width: fit-content;
      max-width: 100%;
      box-sizing: border-box;
      margin-left: auto;
      margin-right: auto;
      color: white;
    }
    .artist-name-overlay p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 600;
      font-size: 1.125rem;
      margin: 0;
    }
  `;

  return (
    <div
      className={`w-full flex flex-col items-center justify-center font-inter relative overflow-hidden p-6 py-12 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      <style>{styles}</style>

      {/* 타이틀 */}
      <div
        className="w-full py-10 text-center rounded-lg mb-10 shadow-lg"
        style={{
          boxShadow: isDarkMode
            ? "0 8px 16px rgba(255, 255, 255, 0.2)"
            : "0 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2
          className={`text-4xl font-extrabold mb-6 drop-shadow-lg ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          주간 인기 아티스트
        </h2>
        <p className={isDarkMode ? "text-white" : "text-black"}>
          주간 가장 인기 있던 아티스트들을 만나보세요.
        </p>
      </div>

      {/* 슬라이더 컨테이너 */}
      <div
        className="relative w-full max-w-screen-lg overflow-hidden rounded-xl p-6 shadow-lg"
        style={{
          boxShadow: isDarkMode
            ? "0 8px 16px rgba(255, 255, 255, 0.2)"
            : "0 8px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        {loading ? (
          <p
            className={
              isDarkMode
                ? "text-white text-center py-20"
                : "text-black text-center py-20"
            }
          >
            아티스트 정보를 불러오는 중...
          </p>
        ) : (
          <>
            <div
              ref={sliderTrackRef}
              className={`slider-track ${
                animationState.transitionEnabled ? "" : "no-transition"
              }`}
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerPage)
                }%)`,
                ["--items-per-page" as any]: itemsPerPage,
              }}
            >
              {extendedItems.map((item, index) => (
                <Link
                  key={`${item.artistExternalId}-${index}`}
                  to={`/artistDetail?search=${encodeURIComponent(
                    item.artistName
                  )}&id=${encodeURIComponent(item.artistExternalId)}`}
                  className={`slider-item ${
                    index === getCenterImageExtendedIndex() ? "is-center" : ""
                  }`}
                >
                  <img
                    src={item.profileImage}
                    alt={item.artistName}
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/600x450/cc0000/ffffff?text=${encodeURIComponent(
                        item.artistName || "Image Not Found"
                      )}`;
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <div
                    className="artist-name-overlay"
                    style={{
                      color: isDarkMode ? "white" : "black",
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <p>{item.artistName}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* 버튼 */}
            <button
              onClick={prevImage}
              className={`absolute top-1/2 left-4 transform -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none ${
                isDarkMode
                  ? "bg-gray-600 hover:bg-gray-800 text-white"
                  : "bg-white hover:bg-gray-200 text-black"
              }`}
              aria-label="이전 아티스트"
            >
              ◀
            </button>
            <button
              onClick={nextImage}
              className={`absolute top-1/2 right-4 transform -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none ${
                isDarkMode
                  ? "bg-gray-600 hover:bg-gray-800 text-white"
                  : "bg-white hover:bg-gray-200 text-black"
              }`}
              aria-label="다음 아티스트"
            >
              ▶
            </button>
          </>
        )}
      </div>
    </div>
  );
}
