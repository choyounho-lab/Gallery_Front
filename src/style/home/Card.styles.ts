// src/style/home/Card.styles.ts
import styled from 'styled-components';

export const Section = styled.section`
    position: relative;
    z-index: 1;
    padding: 56px 24px 80px;
    max-width: 1280px;
    margin: 0 auto;
`;

export const SectionTitle = styled.h2`
    font-size: clamp(20px, 2.2vw, 28px);
    font-weight: 800;
    margin: 0 0 20px;
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
    @media (max-width: 1100px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    @media (max-width: 780px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
`;

export const Card = styled.article`
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border 0.15s ease;
    &:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 255, 255, 0.25);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
    }
`;

export const CardThumb = styled.div<{ $src?: string }>`
    height: 180px;
    background: ${({ $src }) =>
        $src
            ? `url(${$src}) center/cover no-repeat`
            : 'linear-gradient(135deg,#2a2e36,#1a1c22)'};
`;

export const CardBody = styled.div`
    padding: 14px 14px 16px;
`;

export const CardTitle = styled.h3`
    font-size: 16px;
    margin: 0 0 8px;
    font-weight: 700;
    line-height: 1.35;
`;

export const CardMeta = styled.div`
    font-size: 13px;
    opacity: 0.85;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export const CardLink = styled.a`
    display: inline-flex;
    margin-top: 10px;
    font-size: 13px;
    font-weight: 700;
    color: #0d0e0eff;
    text-decoration: none;
    border-bottom: 1px dashed rgba(0, 234, 255, 0.35);
    width: fit-content;
    &:hover {
        border-bottom-color: rgba(0, 234, 255, 0.8);
    }
`;
