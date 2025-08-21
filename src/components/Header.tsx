import React from "react";
import styled from "styled-components";

const Bar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 24px;
  z-index: 10;
  backdrop-filter: saturate(140%) blur(4px);
  background: rgba(10, 10, 12, 0.25);
`;

// 왼쪽 (로고)
const Left = styled.div`
  display: flex;
  align-items: center;
`;
const Brand = styled.a`
  font-weight: 800;
  font-size: 24px;
  letter-spacing: 1px;
  color: #fff;
  text-decoration: none;
`;

// 가운데 (네비게이션)
const Center = styled.nav`
  position: absolute; /* 화면 전체 기준 */
  left: 50%; /* 화면 가로 50% 위치 */
  transform: translateX(
    -50%
  ); /* 자신의 너비 절반만큼 왼쪽 이동 → 정확히 중앙 */
  display: flex;
  gap: 32px;
`;
const NavLink = styled.a`
  color: #eaeaea;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.7;
  }
`;

// 오른쪽 (버튼들)
const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Pill = styled.button`
  height: 36px;
  padding: 0 12px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.35);
  }
`;

const Header: React.FC = () => (
  <Bar>
    {/* 좌측 로고 */}
    <Left>
      <Brand href="/">BELLARTE</Brand>
    </Left>

    {/* 가운데 네비 */}
    <Center>
      <NavLink href="#visit">방문안내</NavLink>
      <NavLink href="#exhibitions">전시</NavLink>
      <NavLink href="#collection">소장품</NavLink>
      <NavLink href="#learn">배움·연구</NavLink>
      <NavLink href="#membership">멤버십</NavLink>
    </Center>

    {/* 우측 버튼 */}
    <Right>
      <Pill>ENG</Pill>
      <Pill>로그인</Pill>
      <Pill>회원가입</Pill>
    </Right>
  </Bar>
);

export default Header;
