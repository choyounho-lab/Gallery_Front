import styled from "styled-components";

//추천전시 백그라운드 0910 조윤호
export const Root = styled.main`
  position: relative;
  min-height: 100vh;
  color: ${({ theme }) => theme.color};
  background: ${({ theme }) => theme.bg};
`;
