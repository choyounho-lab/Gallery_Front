// src/components/Header.tsx
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getRelicList, RelicItem, Category } from "../../api/emuseum";
import { Link } from "react-router-dom";

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

const MenuItem = styled.div`
  position: relative;
  width: 100px;
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

// 🔽 드롭다운 스타일
const Dropdown = styled.div`
  position: absolute;
  top: 100%; /* 부모 메뉴 바로 아래 */
  left: 0;
  background: rgba(20, 20, 25, 0.9);
  backdrop-filter: blur(6px);
  padding: 12px 0;
  border-radius: 8px;
  min-width: 160px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;

  ${MenuItem}:hover & {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
`;

const DropdownLink = styled.a`
  padding: 8px 16px;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.2s;
  border-radius: 6px;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
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

interface HeaderProps {
  onCategoryChange: (category: string) => void;
}

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Bar>
      <Left>
        <Brand as={Link} to="/">
          BELLARTE
        </Brand>
      </Left>

      <Center>
        {/* ✅ 드롭다운 메뉴 */}
        <MenuItem>
          <NavLink as={Link} to="/exhibition/current">
            전시
          </NavLink>
          <Dropdown>
            <DropdownLink as={Link} to="/exhibition/current">
              현재 전시
            </DropdownLink>
            <DropdownLink as={Link} to="/exhibition/upcoming">
              예정 전시
            </DropdownLink>
            <DropdownLink as={Link} to="/exhibition/past">
              지난 전시
            </DropdownLink>{" "}
          </Dropdown>
        </MenuItem>
        <MenuItem>
          <NavLink as={Link} to="collection">
            소장품
          </NavLink>
          <Dropdown>
            <DropdownLink as={Link} to="/collection?category=PAINTING">
              회화(그림)
            </DropdownLink>
            <DropdownLink as={Link} to="/collection?category=CERAMIC">
              도자기
            </DropdownLink>
            <DropdownLink as={Link} to="/collection?category=BOOK">
              서적
            </DropdownLink>
            <DropdownLink as={Link} to="/collection?category=ETC">
              기타
            </DropdownLink>
          </Dropdown>
        </MenuItem>
        <MenuItem>
          <NavLink href="#learn">배움·연구</NavLink>
          <Dropdown>{/* 필요한 소메뉴 추가하기 */}</Dropdown>
        </MenuItem>
        <MenuItem>
          <NavLink href="#membership">멤버십</NavLink>
          <Dropdown>{/* 필요한 소메뉴 추가하기 */}</Dropdown>
        </MenuItem>
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
function setCategory(cat: string) {
  throw new Error("Function not implemented.");
}
