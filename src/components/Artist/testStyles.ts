export const styles = `
  /* 슬라이더 트랙 컨테이너 */
  .slider-track {
    display: flex;
    transition: transform 0.5s ease-in-out;
  }

  /* 트랜지션 비활성화 클래스 */
  .slider-track.no-transition {
    transition: none;
  }

  /* 각 슬라이더 아이템 (개별 이미지) */
  .slider-item {
    min-width: calc(100% / 3); /* 한 화면에 3개 아이템 표시 */
    box-sizing: border-box;
    display: flex;
    flex-direction: column; /* 이미와 이름이 세로로 정렬되도록 */
    justify-content: center;
    align-items: center;
    padding: 1rem; /* 아이템 간 여백 */
    opacity: 0.7; /* 비활성 아이템의 투명도 */
    transform: scale(0.9); /* 비활성 아이템의 크기 */
    transition: all 0.5s ease-in-out; /* 모든 변화에 트랜지션 적용 */
    z-index: 1; /* 기본 z-index */
    position: relative; /* artist-name-overlay의 absolute 위치를 위해 필요 */
    overflow: hidden; /* 오버레이가 아이템 밖으로 넘어가지 않도록 */
    border-radius: 1rem; /* 슬라이더 아이템 자체의 모서리 둥글게 */
  }

  /* 중앙에 위치한 활성 슬라이더 아이템 */
  .slider-item.is-center {
    opacity: 1; /* 활성 아이템은 완전히 보이게 */
    transform: scale(1); /* 활성 아이템은 약간 확대 */
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.7); /* 그림자 효과 강화 */
    z-index: 10; /* 활성 아이템을 맨 앞으로 */
  }

  /* 슬라이더 아이템 내부 이미지 */
  .slider-item img {
    width: 100%; /* 부모 아이템 너비에 맞춤 */
    height: 450px; /* 고정 높이 */
    object-fit: cover; /* 이미지가 잘리지 않고 채워지도록 */
    border-radius: 1rem; /* 모서리 둥글게 */
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5); /* 이미지 그림자 */
  }

  /* 아티스트 이름 오버레이 */
  .artist-name-overlay {
    position: absolute;
    bottom: 0; /* 이미지 하단에 위치 */
    left: 0;
    right: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0)
    ); /* 그라데이션 배경 */
    padding: 1.5rem 1rem 1rem; /* 패딩 조정 */
    text-align: center;
    color: white; /* 텍스트 색상 */
    transform: translateY(100%); /* 기본적으로 숨김 (아래로 완전히 내려놓음) */
    transition: transform 0.4s ease-out, opacity 0.4s ease-out; /* 애니메이션 효과 */
    pointer-events: none; /* 오버레이가 클릭을 방해하지 않도록 */
    opacity: 0; /* 기본적으로 투명하게 숨김 */
    border-bottom-left-radius: 1rem; /* 이미지와 동일하게 하단 모서리 둥글게 */
    border-bottom-right-radius: 1rem; /* 이미지와 동일하게 하단 모서리 둥글게 */
    display: flex;
    align-items: flex-end; /* 텍스트를 하단에 정렬 */
    justify-content: center;
    height: 30%; /* 오버레이가 차지할 높이 (조절 가능) */
  }

  /* 슬라이더 아이템에 호버 시 또는 중앙 아이템일 때 아티스트 이름 오버레이 표시 */
  .slider-item:hover .artist-name-overlay,
  .slider-item.is-center .artist-name-overlay {
    transform: translateY(0); /* 오버레이를 위로 올려서 보이게 함 */
    opacity: 1; /* 완전히 보이게 함 */
  }

  /* 아티스트 이름 텍스트 스타일 */
  .artist-name-overlay p {
    margin: 0; /* 기본 마진 제거 */
    font-size: 1.5rem; /* 더 큰 폰트 크기 */
    font-weight: 700; /* 더 굵은 폰트 */
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7); /* 더 강한 텍스트 그림자 */
    line-height: 1.2; /* 줄 간격 조절 */
    word-break: break-word; /* 긴 이름 처리 */
  }
`;
