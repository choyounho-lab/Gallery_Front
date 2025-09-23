// src/style/home/Hero.styles.ts
import styled from "styled-components";
import { themes } from "../../contexts/SettingsContext";

type ThemeKeys = keyof typeof themes;
interface InfoCardProps {
  $theme: ThemeKeys; // transient prop (DOM에 안 내려감)
}

/** 히어로 영역 */
export const Hero = styled.section<{ $bg?: string }>`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  padding-top: 72px;

  /* ::before/오버레이/콘텐츠 레이어 분리를 위해 */
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0; /* 배경 레이어 */
    pointer-events: none; /* 클릭 방해 금지 */
    background-image: ${({ $bg }) =>
      $bg ? `url(${$bg})` : "linear-gradient(135deg,#272a33,#0b0c10)"};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transform: scale(1.02);
    filter: brightness(0.75) saturate(1.05);
    will-change: transform; /* 성능 힌트 */
  }
`;

/** 어둡게 덮는 오버레이(원하면 배경을 넣어 사용) */
export const OverlayShade = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none; /* 클릭 방해 금지 */
  /* 필요 시: background: linear-gradient(to bottom, rgba(0,0,0,.25), rgba(0,0,0,.5)); */
`;

/** 내부 콘텐츠 컨테이너 */
export const Content = styled.div`
  position: relative;
  height: calc(100vh - 72px);
  z-index: 2; /* 배경/오버레이 위로 */
`;

/** 히어로 정보 카드 */
export const InfoCard = styled.div<InfoCardProps>`
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 24px;
  width: min(560px, 92vw);
  padding: 24px;
  border-radius: 14px;

  /* 반투명 유리 카드 */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);

  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  overflow: hidden;
  z-index: 2; /* 오버레이 위 */

  /* 위에서 내려오는 하이라이트 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.22),
      rgba(255, 255, 255, 0.1) 30%,
      rgba(255, 255, 255, 0) 65%
    );
    pointer-events: none;
  }
`;

export const Tag = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  opacity: 0.9;
  margin-bottom: 10px;
`;

export const Title = styled.h1`
  margin: 0 0 10px;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 800;
`;

export const Meta = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-top: 8px;
`;

/* 버튼 스타일: ThemeProvider의 theme 객체를 사용하는 경우 */
export const CTA = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 18px;
  margin-top: 18px;
  border-radius: 21px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.875rem;

  color: ${({ theme }) => (theme as any)?.color ?? "#111"};
  background: ${({ theme }) => (theme as any)?.bg ?? "transparent"};
  border: 1px solid ${({ theme }) => (theme as any)?.color ?? "#111"};

  transition: 0.2s;
  &:hover {
    background: gray;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(255, 255, 255, 0.15);
  }
`;

/** 사이드 플로팅 버튼 */
export const CircleButton = styled.button`
  z-index: 3000;
  position: fixed;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: gray;
  color: black;
  font-weight: 800;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: 0.2s;

  &:hover {
    background: #a9a9a9; /* lightgray */
    border-color: rgba(255, 255, 255, 0.32);
    transform: translateY(-50%) scale(1.04);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

/** FAB 버튼(필요 시 사용) */
export const FabMenu = styled.button`
  position: absolute;
  right: 24px;
  bottom: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 1.25rem;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.32);
    transform: scale(1.04);
  }
`;
