import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { instance } from '../api/instance';
import { FeaturedExhibit } from '../types';

const Root = styled.main`
    position: relative;
    min-height: 100vh;
    color: #fff;
    background: #0b0c10;
`;

const Hero = styled.section<{ $bg?: string }>`
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
const OverlayShade = styled.div`
    position: absolute;
    inset: 0;
    background: radial-gradient(
            90% 55% at 70% 40%,
            rgba(0, 0, 0, 0.05) 0%,
            rgba(0, 0, 0, 0.55) 100%
        ),
        linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.45) 100%);
`;
const Content = styled.div`
    position: relative;
    height: calc(100vh - 72px);
`;
const InfoCard = styled.div`
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
const Tag = styled.div`
    font-size: 14px;
    font-weight: 700;
    opacity: 0.9;
    margin-bottom: 10px;
`;
const Title = styled.h1`
    margin: 0 0 10px;
    font-size: clamp(26px, 4vw, 36px);
    font-weight: 800;
`;
const Meta = styled.div`
    font-size: 14px;
    opacity: 0.9;
    margin-top: 8px;
`;
const CTA = styled.a`
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
const CircleButton = styled.button`
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
const FabMenu = styled.button`
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

const Home: React.FC = () => {
    const [exhibit, setExhibit] = useState<FeaturedExhibit | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await instance.get<FeaturedExhibit>(
                    '/api/home/featured'
                );
                setExhibit(res.data);
            } catch {
                // 임시 데이터(백엔드 준비 전)
                setExhibit({
                    id: 1,
                    title: '현대미술 소장품',
                    subTitle: 'M2',
                    period: '2025.02.27. –',
                    heroImage:
                        'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2069&auto=format&fit=crop',
                    detailUrl: '#',
                });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <Root>
            <Hero $bg={exhibit?.heroImage}>
                <OverlayShade />
                <Content>
                    <CircleButton title="설정">✧</CircleButton>

                    {!loading && exhibit && (
                        <HS.InfoCard>
                            <HS.Tag>{exhibit.subTitle ?? 'Bellarte'}</HS.Tag>
                            <HS.Title>{exhibit.title}</HS.Title>
                            <HS.CTA href={exhibit.detailUrl ?? '#'}>
                                상세보기
                            </HS.CTA>
                            <HS.Meta>{exhibit.period ?? ''}</HS.Meta>
                        </HS.InfoCard>
                    )}

                    <HS.FabMenu title="메뉴">≡</HS.FabMenu>
                </HS.Content>
            </HS.Hero>

            {/* 아래로 스크롤되는 추천 섹션 */}
            <CS.Section>
                <CS.SectionTitle>추천 전시</CS.SectionTitle>
                <CS.Grid>
                    {kcisaList.map((it) => (
                        <CS.Card key={it.LOCAL_ID}>
                            <CS.CardThumb $src={it.IMAGE_OBJECT} />
                            <CS.CardBody>
                                <CS.CardTitle>{it.TITLE}</CS.CardTitle>
                                <CS.CardMeta>
                                    {it.CNTC_INSTT_NM && (
                                        <span>기관: {it.CNTC_INSTT_NM}</span>
                                    )}
                                    {it.PERIOD && (
                                        <span>기간: {it.PERIOD}</span>
                                    )}
                                    {it.GENRE && <span>장르: {it.GENRE}</span>}
                                </CS.CardMeta>
                                <CS.CardLink
                                    href={it.URL || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    상세보기 ㅈㅈㅈ
                                </CS.CardLink>
                            </CS.CardBody>
                        </CS.Card>
                    ))}
                </CS.Grid>
            </CS.Section>
        </Common.Root>
    );
};

export default Home;
