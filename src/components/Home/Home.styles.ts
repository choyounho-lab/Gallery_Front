// src/components/Home/Home.styles.ts
import styled from "styled-components";

/* =========================================================================
    ===== 🎨 전역 스타일 및 공통 요소 (Global Styles & Common Elements) =====
    ========================================================================= */

// Body 스타일은 HomeContainer에서 대부분 처리되므로 간단하게 유지
export const Body = styled.body`
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* 가로 스크롤 방지 (전역) */
  // color는 HomeContainer에서 관리하므로 여기서는 제거
`;

export const HomeContainer = styled.div<{ isDarkMode: boolean }>`
  min-height: 100vh;
  background-color: ${(props) =>
    props.isDarkMode ? "#080808" : "#F8F8F8"}; /* 더 깊고 어두운 다크 배경색 */
  color: ${(props) =>
    props.isDarkMode ? "#EAEAEA" : "#333333"}; /* 텍스트 색상 대비 명확화 */
  transition: background-color 0.6s ease, color 0.6s ease; /* 트랜지션 시간 증가 */
  position: relative;
  z-index: 1;

  /* 작은 화면에서의 패딩 조정 */
  @media (max-width: 768px) {
    padding: 2.5rem 1.8rem;
  }
`;

export const HomeSection = styled.section`
  margin-bottom: 1rem; /* 섹션 간 간격 더 확대 */
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 4.5rem;
  }
`;

export const HomeTitle = styled.h2<{ isDarkMode: boolean }>`
  color: ${(props) =>
    props.isDarkMode ? "#F9F9F9" : "#1A1A1A"}; /* 제목 색상 더 뚜렷하게 */
  font-size: 3rem; /* 제목 폰트 크기 더 키움 */
  font-weight: 800; /* 더 굵게 */
  margin-bottom: 3.5rem; /* 제목과 콘텐츠 간 간격 조정 */
  transition: color 0.4s ease;
  padding-left: 1.5rem; /* 왼쪽 패딩 증가 */
  border-left: 8px solid
    ${(props) => (props.isDarkMode ? "#B07AFF" : "#A36BEE")}; /* 강조 라인 색상 및 굵기 변경 (더 세련된 보라색) */
  text-shadow: ${(props) =>
    props.isDarkMode
      ? "0 0 15px rgba(176, 122, 255, 0.5)"
      : "none"}; /* 다크모드에서 빛나는 효과 강화 */
  letter-spacing: -0.04em; /* 글자 간격 살짝 줄임 */

  @media (max-width: 768px) {
    font-size: 2.4rem;
    margin-bottom: 3rem;
    padding-left: 1.2rem;
    border-left-width: 6px;
  }
`;

/* =========================================================================
    ===== ➡️ 캐러셀 화살표 버튼 (Carousel Arrow Buttons) ===================
    ========================================================================= */

export const ArrowButton = styled.button<{
  pos: "left" | "right";
  isDarkMode: boolean;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) =>
    props.pos === "left"
      ? "left: -2.5rem;"
      : "right: -2.5rem;"} /* 캐러셀 컨테이너 바깥으로 더 배치 */
    width: 5rem; /* 크기 더 키움 */
  height: 5rem; /* 크기 더 키움 */
  background: ${(props) =>
    props.isDarkMode
      ? "rgba(25, 25, 25, 0.98)" /* 다크모드에서 더 어둡고 불투명한 배경 */
      : "rgba(255, 255, 255, 0.98)"}; /* 라이트모드에서 밝고 불투명한 배경 */
  color: ${(props) =>
    props.isDarkMode ? "#F5F5F5" : "#333333"}; /* 색상 대비 개선 */
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-size: 2.5rem; /* 아이콘 크기 더 키움 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6); /* 그림자 더 강조 */
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease,
    box-shadow 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.isDarkMode ? "rgba(40, 40, 40, 1)" : "rgba(240, 240, 240, 1)"};
    transform: translateY(-50%) scale(1.18); /* 호버 시 더 크게 확대 */
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
  }

  @media (max-width: 768px) {
    width: 4rem;
    height: 4rem;
    font-size: 2rem;
    ${(props) => (props.pos === "left" ? "left: -1.2rem;" : "right: -1.2rem;")}
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  }
`;

// K-Pop 섹션 캐러셀의 화살표 버튼 위치 조정을 위한 Wrapper (HomeSection을 상속하여 마진 사용)
export const KpopCarouselWrapper = styled(HomeSection)`
  margin: 0 2rem; // 좌우 마진 추가
  padding: 0; // HomeSection의 패딩은 따로 없음
`;

/* =========================================================================
    ===== 🎧 썸네일 캐러셀 리스트 (New Releases - '최신 앨범') =============
    ========================================================================= */

export const CarouselWrapper = styled.div`
  position: relative;
  margin: 0 2.5rem; /* 좌우 마진 증가로 화살표 공간 확보 및 여백 */

  @media (max-width: 768px) {
    margin: 0 1.5rem;
  }
`;

export const ThumbnailList = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 2.5rem; /* 간격 더 넓힘 */
  padding: 1.8rem 0; /* 패딩 조정 */
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 1.8rem;
    padding: 1.2rem 0;
  }
`;

export const ThumbnailWrapper = styled.div`
  position: relative;
  width: 22rem; /* 너비 더 키움 */
  height: 22rem; /* 높이 더 키움 */
  flex-shrink: 0;
  border-radius: 1.8rem; /* 둥근 모서리 더 부드럽게 */
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7); /* 그림자 더 깊게, 다크 모드에 어울리게 */
  transition: transform 0.5s ease, box-shadow 0.5s ease;

  &:hover {
    transform: translateY(-15px) scale(1.06); /* 호버 시 더 위로 이동 및 확대 */
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8); /* 호버 시 그림자 더 강조 */
  }

  &:hover img {
    transform: scale(1.25); /* 이미지 확대율 증가 */
    filter: brightness(0.2); /* 어둡게 하는 정도 더 증가 */
  }
  &:hover div {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 18rem;
    height: 18rem;
    border-radius: 1.5rem;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
    &:hover {
      transform: translateY(-10px) scale(1.04);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
  }
`;

export const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease, filter 0.7s ease; /* 트랜지션 시간 증가 */
`;

export const ThumbnailOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.99) 35%,
    /* 더 진한 오버레이 시작, 더 넓은 범위 */ rgba(0, 0, 0, 0) 100%
  );
  color: white;
  padding: 2.5rem; /* 패딩 증가 */
  font-size: 1.2rem; /* 폰트 크기 살짝 키움 */
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.6s ease, transform 0.6s ease; /* 트랜지션 시간 증가 */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 1.2rem; /* 간격 증가 */

  strong {
    font-size: 1.8rem; /* 제목 폰트 크기 키움 */
    font-weight: 700;
    text-shadow: 0 0 15px rgba(0, 0, 0, 0.8); /* 텍스트 그림자 */
  }
  small {
    font-size: 1.1rem; /* 아티스트 이름 폰트 크기 조정 */
    opacity: 0.98; /* 불투명도 증가 */
  }

  @media (max-width: 768px) {
    padding: 1.8rem;
    strong {
      font-size: 1.6rem;
    }
    small {
      font-size: 1rem;
    }
  }
`;

/* =========================================================================
    ===== 🎶 앨범 카드 리스트 (Latest Tracks - '최신곡') =============
    ========================================================================= */

export const AlbumCarouselWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 2.5rem; /* 앨범 리스트와 세로 화살표 버튼 간의 간격 조정 */
  margin: 0 2.5rem; /* 좌우 마진 추가 (버튼 공간 확보) */
  padding: 2.5rem 0; /* 상하 패딩 증가 */
  min-height: calc(
    6rem * 3 + 1.5rem * 2 + 2.5rem
  ); /* AlbumCard height * 3 + gap * 2 + 상하 패딩 */
  overflow: hidden;

  @media (max-width: 768px) {
    margin: 0 1.5rem;
    gap: 1.8rem;
    padding: 2rem 0;
    min-height: auto;
    flex-direction: column;
    align-items: center;
  }
`;

// Home.tsx에서 isDarkMode를 전달하지 않으므로, isDarkMode?: boolean으로 변경하여 필수가 아님을 명시
export const AlbumList = styled.ul<{ isDarkMode?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem; /* 앨범 카드 간 간격 조정 */
  padding: 1rem; /* 리스트 내부 패딩 (스크롤바와 내용 간 여백) */
  flex-grow: 1;
  height: calc(6rem * 3 + 1.5rem * 2 + 1rem * 2); /* 3줄 높이 고정 */
  overflow-y: auto;
  overflow-x: hidden; /* 가로 스크롤 방지 */
  list-style: none;
  margin: 0;

  /* 스크롤바 커스터마이징 */
  &::-webkit-scrollbar {
    width: 10px; /* 세로 스크롤바 너비 */
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) =>
      props.isDarkMode ? "#1A1A1A" : "#EEEEEE"}; /* 트랙 색상 조정 */
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) =>
      props.isDarkMode ? "#3C3C3C" : "#A8A8A8"}; /* 썸 색상 조정 */
    border-radius: 10px;
    &:hover {
      background: ${(props) =>
        props.isDarkMode ? "#5A5A5A" : "#909090"}; /* 호버 시 색상 조정 */
    }
  }

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    flex-direction: column;
    height: auto;
    overflow-y: hidden;
    overflow-x: auto; /* 모바일에서 앨범 카드가 넘치면 가로 스크롤 허용 */
    align-items: flex-start; /* 모바일 가로 스크롤 시 좌측 정렬 */
    padding: 0.8rem 0;
    width: 100%;
    &::-webkit-scrollbar {
      display: none; /* 모바일에서는 스크롤바 숨김 */
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export const AlbumCard = styled.li.withConfig({
  shouldForwardProp: (prop) => prop !== "bgColor" && prop !== "isDarkMode",
})<{ bgColor: string; isDarkMode: boolean }>`
  position: relative;
  background: linear-gradient(
    135deg,
    ${(props) => props.bgColor},
    ${(props) => (props.isDarkMode ? "#1E1E1E" : "#F0F0F0")}
      /* 배경색 조정, 다크모드/라이트모드에 따라 */
  );
  border-radius: 1.2rem; /* 모서리 더 부드럽게 */
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4); /* 그림자 부드럽고 깊게 */
  padding: 1.2rem; /* 패딩 조정 */
  display: flex;
  gap: 1.2rem; /* 이미지와 정보 간 간격 조정 */
  align-items: center;
  width: 320px; /* 고정 너비 유지 */
  height: 6rem; /* 높이 살짝 키움 */
  flex-shrink: 0;
  overflow: hidden;
  box-sizing: border-box;
  color: ${(props) =>
    props.isDarkMode ? "#F9F9F9" : "#222222"}; /* 텍스트 색상 대비 강화 */
  transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-8px); /* 호버 시 살짝 위로 */
    box-shadow: 0 18px 35px rgba(0, 0, 0, 0.55); /* 호버 시 그림자 강조 */
    cursor: pointer;
  }

  @media (max-width: 768px) {
    width: 90%; /* 모바일에서 너비 조정 */
    max-width: 380px; /* 최대 너비 설정 */
    height: 5.5rem;
    padding: 1rem;
    gap: 1rem;
  }
`;

export const AlbumImage = styled.img`
  width: 5.5rem; /* 이미지 크기 더 키움 */
  height: 5.5rem; /* 이미지 크기 더 키움 */
  object-fit: cover;
  border-radius: 0.8rem; /* 모서리 둥글기 조정 */
  flex-shrink: 0;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.25);
`;

export const AlbumInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`;

export const AlbumNameContainer = styled.div`
  font-size: 1.2rem; /* 폰트 크기 살짝 키움 */
  font-weight: 700; /* 굵기 조정 */
  margin-bottom: 0.4rem; /* 간격 살짝 줄임 */
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  line-height: 1.3;
  text-overflow: ellipsis; /* 넘치는 텍스트 ... 처리 */

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const ScrollText = styled.span`
  display: inline-block;
  white-space: nowrap;
  will-change: transform;
  /* 애니메이션은 JS로 제어하는 것이 좋습니다. CSS transition은 초기 로드 시만 적용됩니다. */
`;

export const TrackList = styled.ul`
  max-height: 2.6rem; /* 트랙 2줄까지 보이도록 높이 조정 (폰트 크기 고려) */
  overflow: hidden;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const TrackItem = styled.li<{ isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.9rem; /* 폰트 크기 조정 */
  color: ${(props) =>
    props.isDarkMode ? "#CDCDCD" : "#555555"}; /* 색상 조정 */
  overflow: hidden;
  white-space: nowrap;
  cursor: default;
  position: relative;
  transition: color 0.3s ease;
  line-height: 1.2; /* 줄 간격 조정 */
  text-overflow: ellipsis; /* 넘치는 텍스트 ... 처리 */
`;

export const TrackScrollText = styled.span`
  display: inline-block;
  /* 애니메이션은 JS로 제어하는 것이 좋습니다. */
`;

export const TrackEmpty = styled.li<{ isDarkMode: boolean }>`
  font-size: 0.9rem; /* 폰트 크기 조정 */
  color: ${(props) =>
    props.isDarkMode ? "#AAAAAA" : "#888888"}; /* 색상 조정 */
  transition: color 0.3s ease;
`;

/* ===== 세로 스크롤 화살표 버튼 (AlbumList 옆에 배치) ===== */
export const GlobalArrowButton = styled.button<{
  pos: "up" | "down";
  isDarkMode: boolean;
}>`
  position: absolute;
  right: -0.5rem; /* AlbumCarouselWrapper 기준 우측으로 이동 */
  width: 4.5rem; /* 크기 조정 */
  height: 4.5rem; /* 크기 조정 */
  background: ${(props) =>
    props.isDarkMode ? "rgba(25, 25, 25, 0.98)" : "rgba(255, 255, 255, 0.98)"};
  color: ${(props) => (props.isDarkMode ? "#F5F5F5" : "#333333")};
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transition: background-color 0.3s ease, transform 0.3s ease, color 0.3s ease;
  font-size: 2.5rem; /* 아이콘 크기 키움 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);

  ${(props) => (props.pos === "up" ? "top: 0.8rem;" : "bottom: 0.8rem;")}

  &:hover {
    background: ${(props) =>
      props.isDarkMode ? "rgba(40, 40, 40, 1)" : "rgba(240, 240, 240, 1)"};
    transform: ${(props) =>
      props.pos === "up"
        ? "translateY(-0.6rem) scale(1.1)"
        : "translateY(0.6rem) scale(1.1)"}; /* 호버 시 이동 및 확대 */
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    display: none; /* 모바일에서는 세로 스크롤 버튼 숨김 */
  }
`;

/* 앨범 hover 시 재생 버튼 표시 */
export const PlayButton = styled.div<{ isDarkMode: boolean }>`
  position: absolute;
  top: 50%;
  left: 19%; /* 이미지 중앙에 더 가깝게 */
  transform: translate(-50%, -50%);
  background-color: ${(props) =>
    props.isDarkMode
      ? "rgba(0, 0, 0, 0.98)" /* Spotify 그린 컬러 */
      : "rgba(0, 0, 0, 1)"}; /* 배경색 조정 */
  color: white;
  padding: 0.9rem 1.2rem; /* 패딩 조정 */
  border-radius: 50%;
  font-size: 1.3rem; /* 아이콘 크기 키움 */
  opacity: 0;
  transition: opacity 0.3s ease, background-color 0.3s ease, color 0.3s ease,
    transform 0.3s ease;
  z-index: 10;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4); /* 그림자 추가 */

  ${AlbumCard}:hover & {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.18); /* 호버 시 약간 확대 */
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1.1rem;
    font-size: 1.2rem;
    ${AlbumCard}:hover & {
      transform: translate(-50%, -50%) scale(1.12);
    }
  }
`;

/* --- K-Pop 섹션 전용 스타일 추가 --- */

export const KpopAlbumList = styled.ul`
  display: flex;
  overflow-x: auto;
  gap: 2rem; /* 간격 살짝 넓힘 */
  padding: 2rem 0; /* 패딩 조정 */
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  list-style: none;
  margin: 0;

  &::-webkit-scrollbar {
    display: none;
  }

  align-items: center;
`;

export const KpopAlbumCard = styled.li.withConfig({
  shouldForwardProp: (prop) => prop !== "bgColor" && prop !== "isDarkMode",
})<{ bgColor: string; isDarkMode: boolean }>`
  position: relative;
  background: linear-gradient(
    135deg,
    ${(props) => props.bgColor},
    ${(props) => (props.isDarkMode ? "#151515" : "#E8E8E8")}
      /* 배경색 조정, 다크모드/라이트모드에 따라 */
  );
  border-radius: 2rem; /* 둥근 모서리 더 부드럽게 */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); /* 그림자 강조 */
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 25rem; /* 너비 살짝 키움 */
  height: 25rem; /* 높이 살짝 키움 */
  flex-shrink: 0;
  overflow: hidden;
  box-sizing: border-box;
  color: ${(props) =>
    props.isDarkMode ? "#F9F9F9" : "#222222"}; /* 텍스트 색상 대비 강화 */
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease,
    color 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-12px) scale(1.03); /* 호버 시 더 크게 이동 및 확대 */
    box-shadow: 0 25px 55px rgba(0, 0, 0, 0.7); /* 호버 시 그림자 더 강조 */
  }

  ${AlbumImage} {
    width: 12rem; /* 이미지 크기 키움 */
    height: 12rem; /* 이미지 크기 키움 */
    border-radius: 1.5rem; /* 모서리 둥글기 조정 */
    margin-bottom: 1.8rem; /* 간격 조정 */
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); /* 그림자 조정 */
  }

  ${AlbumNameContainer} {
    font-size: 2.2rem; /* 폰트 크기 키움 */
    font-weight: 800; /* 굵기 조정 */
    color: ${(props) =>
      props.isDarkMode ? "#FFFFFF" : "#000000"}; /* 색상 조정 */
    text-align: center;
    margin-bottom: 0.8rem;
  }

  small {
    font-size: 1.2rem; /* 폰트 크기 조정 */
    color: ${(props) =>
      props.isDarkMode ? "#B8B8B8" : "#444444"}; /* 색상 조정 */
  }

  ${TrackList} {
    display: none; /* K-Pop 카드에서는 트랙 리스트 숨김 유지 */
  }

  @media (max-width: 768px) {
    width: 20rem;
    height: 20rem;
    padding: 1.5rem;
    ${AlbumImage} {
      width: 10rem;
      height: 10rem;
      margin-bottom: 1.5rem;
    }
    ${AlbumNameContainer} {
      font-size: 1.8rem;
    }
    small {
      font-size: 1rem;
    }
  }
`;

export const KpopPlayButton = styled(PlayButton)`
  top: auto;
  bottom: 1rem; /* 하단에서부터의 거리 조정 */
  left: 50%;
  transform: translateX(-50%) translateY(0);
  padding: 1.4rem 1.8rem; /* 패딩 조정 */
  font-size: 1.6rem; /* 아이콘 크기 조정 */
  background-color: ${(props) =>
    props.isDarkMode
      ? "rgba(0, 0, 0, 0.95)"
      : "rgba(0, 0, 0, 1)"}; /* Spotify 그린 색상 강조 */
  color: white; /* 텍스트 색상 흰색으로 고정 */
  border: none; /* 테두리 제거 */
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);

  ${KpopAlbumCard}:hover & {
    opacity: 1;
    transform: translateX(-50%) translateY(-2rem); /* 호버 시 더 크게 위로 이동 */
  }

  @media (max-width: 768px) {
    padding: 1.2rem 1.5rem;
    font-size: 1.4rem;
    bottom: 2.5rem;
    ${KpopAlbumCard}:hover & {
      transform: translateX(-50%) translateY(-1.5rem);
    }
  }
`;
