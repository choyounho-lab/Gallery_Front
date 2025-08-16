import React, { useState, useEffect, useRef, useCallback } from "react";
import { styles } from "./testStyles"; // 스타일 파일 임포트
import { apiGetArtistById } from "../../api/api"; // 아티스트 API 임포트
import { ArtistObject } from "../../types/types"; // 아티스트 타입 임포트

// 슬라이더 아이템에 필요한 데이터 타입을 정의합니다.
interface SliderItemData {
  imageUrl: string;
  name: string; // 아티스트 이름을 추가합니다.
}

// Test 컴포넌트의 props 타입을 정의
interface TestProps {
  artistIds: string[]; // Home.tsx에서 전달받을 아티스트 ID 목록
}

// props를 받는 Test 컴포넌트
export default function Test({ artistIds }: TestProps) {
  // 슬라이더에 사용할 아티스트 이미지 URL 및 이름 상태
  const [sliderItems, setSliderItems] = useState<SliderItemData[]>([]);
  // 이미지 로딩 상태
  const [loading, setLoading] = useState<boolean>(true);

  // --- 실제 API 호출 코드 구조 ---
  const fetchArtistDataFromApi = async (
    artistId: string
  ): Promise<{ images: { url: string }[]; name: string }> => {
    try {
      const artistData: ArtistObject = await apiGetArtistById(artistId);
      return {
        images: artistData.images || [],
        name: artistData.name || "알 수 없는 아티스트",
      }; // 이름도 반환하도록 수정
    } catch (error) {
      console.error(`Error fetching artist ${artistId}:`, error);
      return { images: [], name: "알 수 없는 아티스트" };
    }
  };
  // --- 실제 API 호출 코드 구조 끝 ---

  // 슬라이더에 표시할 아티스트 이미지와 이름 로드
  useEffect(() => {
    const fetchArtistDataForSlider = async () => {
      if (artistIds.length === 0) {
        // artistIds가 없으면 로딩만 하고 리턴
        setLoading(false);
        setSliderItems([]);
        return;
      }

      setLoading(true); // 로딩 시작

      try {
        const fetchedItems = await Promise.all(
          artistIds.map(async (id) => {
            const res = await fetchArtistDataFromApi(id);
            // 첫 번째 이미지가 없으면 기본 플레이스홀더 사용
            const imageUrl =
              res.images[0]?.url ||
              `https://placehold.co/600x450/6a0572/ffffff?text=${encodeURIComponent(
                res.name
              )}`;
            return { imageUrl, name: res.name };
          })
        );
        // 유효한 이미지 URL이 있는 항목만 필터링 (사실상 모든 항목이 들어옴)
        setSliderItems(
          fetchedItems.filter((item) => item.imageUrl) as SliderItemData[]
        );
      } catch (error) {
        console.error("슬라이더 아티스트 데이터 불러오기 오류:", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };
    fetchArtistDataForSlider();
  }, [artistIds]); // artistIds prop이 변경될 때마다 실행

  // 슬라이더에 표시할 아이템 배열
  const items = sliderItems;

  const itemsPerPage = 3;
  const originalItemsCount = items.length;

  // 무한 루프를 위한 아이템 배열 확장
  const extendedItems =
    items.length > 0
      ? [
          ...items.slice(-(itemsPerPage - 1)),
          ...items,
          ...items.slice(0, itemsPerPage - 1),
        ]
      : [];

  const [currentIndex, setCurrentIndex] = useState(itemsPerPage - 1);
  const [animationState, setAnimationState] = useState({
    isAnimating: false,
    transitionEnabled: true,
  });
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);

  const nextImage = useCallback(() => {
    setAnimationState((p) => ({
      ...p,
      isAnimating: true,
      transitionEnabled: true,
    }));
    setCurrentIndex((p) => p + 1);
  }, []);

  const prevImage = useCallback(() => {
    setAnimationState((p) => ({
      ...p,
      isAnimating: true,
      transitionEnabled: true,
    }));
    setCurrentIndex((p) => p - 1);
  }, []);

  useEffect(() => {
    if (!animationState.isAnimating || items.length === 0) return;

    const handleTransitionEnd = () => {
      setAnimationState((p) => ({ ...p, isAnimating: false }));
      if (currentIndex >= originalItemsCount + (itemsPerPage - 1)) {
        setAnimationState((p) => ({ ...p, transitionEnabled: false }));
        setCurrentIndex(itemsPerPage - 1);
      } else if (currentIndex <= itemsPerPage - 2) {
        setAnimationState((p) => ({ ...p, transitionEnabled: false }));
        setCurrentIndex(originalItemsCount + (itemsPerPage - 2));
      }
    };

    const sliderElement = sliderTrackRef.current;
    if (sliderElement) {
      sliderElement.addEventListener("transitionend", handleTransitionEnd);
    }
    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener("transitionend", handleTransitionEnd);
      }
    };
  }, [
    currentIndex,
    animationState.isAnimating,
    originalItemsCount,
    itemsPerPage,
    items.length,
  ]);

  useEffect(() => {
    if (items.length === 0) return;

    const autoSlideInterval = setInterval(() => {
      !animationState.isAnimating && nextImage();
    }, 3000);
    return () => clearInterval(autoSlideInterval);
  }, [animationState.isAnimating, nextImage, items.length]);

  const getCenterImageExtendedIndex = useCallback(
    () => currentIndex + Math.floor(itemsPerPage / 2),
    [currentIndex, itemsPerPage]
  );

  return (
    <div className=" top-200min-h-screen w-full flex flex-col items-center justify-center  text-white font-inter relative overflow-hidden p-4">
      <style>{styles}</style>

      <div className="w-full py-10 bg-gradient-to-br from-purple-800 to-indigo-900 text-center shadow-xl rounded-lg mb-8">
        <h2 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg">
          최신발매 아티스트
        </h2>
        <p className="text-gray-300">
          신규 앨범을 발매한 아티스트를 확인하세요.
        </p>
      </div>

      <div className="relative w-full max-w-screen-lg overflow-hidden rounded-xl shadow-2xl ">
        {loading ? (
          <p className="text-white text-center py-20">
            아티스트 정보를 불러오는 중...
          </p>
        ) : items.length === 0 ? (
          <p className="text-white text-center py-20">
            아티스트 정보를 불러올 수 없거나, Home에서 전달된 아티스트가
            없습니다.
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
              }}
            >
              {extendedItems.map((item, index) => (
                <div
                  key={index} // key는 유니크해야 하지만, 확장된 배열에서는 index가 중복될 수 있으므로 다른 방법을 고려하는 것이 좋음 (ex. uuid, 아니면 index + originalId 등)
                  className={`slider-item ${
                    index === getCenterImageExtendedIndex() ? "is-center" : ""
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name} // alt 속성도 아티스트 이름으로 변경
                    onError={(e) => {
                      // 이미지 로드 실패 시 플레이스홀더 이미지와 아티스트 이름으로 대체
                      e.currentTarget.src = `https://placehold.co/600x450/6a0572/ffffff?text=${encodeURIComponent(
                        item.name || "Image Not Found"
                      )}`;
                      e.currentTarget.onerror = null;
                    }}
                  />
                  {/* 아티스트 이름 추가 */}
                  <div className="artist-name-overlay">
                    <p className="text-xl font-semibold text-white text-shadow-md">
                      {item.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={prevImage}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-purple-700 hover:bg-purple-800 text-white p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
              aria-label="Previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-purple-700 hover:bg-purple-800 text-white p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
              aria-label="Next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>
      <div className="flex justify-center mt-8 space-x-2">
        {items.map((_, idx) => (
          <span
            key={idx}
            className={`block w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
              currentIndex === idx + (itemsPerPage - 1) ||
              (currentIndex >= originalItemsCount + (itemsPerPage - 1) &&
                idx === 0) ||
              (currentIndex <= itemsPerPage - 2 &&
                idx === originalItemsCount - 1)
                ? "bg-purple-500"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
            onClick={() => {
              if (animationState.isAnimating) return;
              setAnimationState((p) => ({ ...p, transitionEnabled: true }));
              setCurrentIndex(idx + (itemsPerPage - 1));
            }}
            aria-label={`Go to slide ${idx + 1}`}
          ></span>
        ))}
      </div>
    </div>
  );
}
