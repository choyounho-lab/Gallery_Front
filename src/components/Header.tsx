// src/components/Header.tsx
import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
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

const Left = styled.div`
  display: flex;
  align-items: center;
`;
const Brand = styled.a`
  font-weight: 800;
  font-size: 1.5rem;
  text-decoration: none;
`;

const Center = styled.nav`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 32px;
`;
const NavLink = styled.a`
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.7;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Pill = styled.button`
  height: 36px;
  padding: 0 12px;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.color};
  background: rgba(255, 255, 255, 0.08);
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.35);
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate(); // ✅ 추가

  return (
    <Bar>
      <Left>
        <Brand href="/">BELLARTE</Brand>
      </Left>

      <Center>
        <NavLink href="#visit">방문안내</NavLink>
        <NavLink href="#exhibitions">전시</NavLink>
        <NavLink href="collection">소장품</NavLink>
        <NavLink href="#learn">배움·연구</NavLink>
        <NavLink href="#membership">멤버십</NavLink>
      </Center>

      <Right>
        <Pill>ENG</Pill>
        <Pill onClick={() => navigate("/member/login")}>로그인</Pill>
        <Pill>회원가입</Pill>
      </Right>
    </Bar>
  );
};
export default Header;
