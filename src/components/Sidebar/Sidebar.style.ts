// src/components/Sidebar/Sidebar.styles.ts
import styled from "styled-components";

export const SidebarContainer = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: ${({ $open }) => ($open ? "0" : "-320px")};
  width: 320px;
  height: 100%
  background-color: white;
  background: rgba(31, 31, 31, 0.95);
  backdrop-filter: blur(10px);
  color: black;
  transition: left 0.3s ease;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h2 {
    font-size: 1.8rem;
    font-weight: bold;
  }
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 1.1rem;
  transition: background 0.2s, transform 0.2s;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: rotate(90deg);
  }
`;
