import styled from "styled-components";

export const Root = styled.main`
  position: relative;
  min-height: 100vh;
  color: ${({ theme }) => theme.color};
  background: ${({ theme }) => theme.bg};
`;
