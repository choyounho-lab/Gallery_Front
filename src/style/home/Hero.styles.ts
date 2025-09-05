// src/style/home/Hero.styles.ts
import styled from 'styled-components';

export const Hero = styled.section<{ $bg?: string }>`
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    padding-top: 72px;
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: ${({ $bg }) =>
            $bg ? `url(${$bg})` : 'linear-gradient(135deg,#272a33,#0b0c10)'};
        background-size: cover;
        background-position: center;
        transform: scale(1.02);
        filter: brightness(0.75) saturate(1.05);
    }
`;

export const OverlayShade = styled.div`
    position: absolute;
    inset: 0;
`;

export const Content = styled.div`
    position: relative;
    height: calc(100vh - 72px);
`;

export const InfoCard = styled.div`
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: 24px;
    width: min(560px, 92vw);
    padding: 24px;
    border-radius: 14px;
    background: rgba(10, 10, 12, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(6px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
`;

export const Tag = styled.div`
    font-size: 14px;
    font-weight: 700;
    opacity: 0.9;
    margin-bottom: 10px;
`;

export const Title = styled.h1`
    margin: 0 0 10px;
    font-size: clamp(26px, 4vw, 36px);
    font-weight: 800;
`;

export const Meta = styled.div`
    font-size: 14px;
    opacity: 0.9;
    margin-top: 8px;
`;

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
    font-size: 14px;
    color: #0b0c10;
    background: #fff;
    border: 1px solid #fff;
    transition: 0.2s;
    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 14px rgba(255, 255, 255, 0.15);
    }
`;

export const CircleButton = styled.button`
    position: absolute;
    left: 24px;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    font-weight: 800;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: 0.2s;
    &:hover {
        background: rgba(255, 255, 255, 0.18);
        border-color: rgba(255, 255, 255, 0.32);
        transform: translateY(-50%) scale(1.04);
    }
    @media (max-width: 768px) {
        display: none;
    }
`;

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
    font-size: 22px;
    font-weight: 900;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        background: rgba(255, 255, 255, 0.18);
        border-color: rgba(255, 255, 255, 0.32);
        transform: scale(1.04);
    }
`;
 