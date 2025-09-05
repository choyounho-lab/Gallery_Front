// Home.tsx
import React, { useEffect, useState } from 'react';
import { instance } from '../api/instance';
import { FeaturedExhibit, Exhibition } from '../types/ApiType';
import { fetchKcisaItems, toFeaturedExhibit } from '../api/kcisa';

import * as Common from '../style/home/Common.styles';
import * as HS from '../style/home/Hero.styles';
import * as CS from '../style/home/Card.styles';

const Home: React.FC = () => {
    const [exhibits, setExhibits] = useState<FeaturedExhibit[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [kcisaList, setKcisaList] = useState<Exhibition[]>([]);

    // ===== Hero 데이터 =====
    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                const res = await instance.get<FeaturedExhibit[]>(
                    '/api/home/featured',
                    { signal: controller.signal }
                );
                setExhibits(res.data);
            } catch {
                try {
                    const items = await fetchKcisaItems(
                        1,
                        100,
                        controller.signal
                    );
                    if (items.length > 0) {
                        setExhibits(items.map((it) => toFeaturedExhibit(it)));
                    }
                } catch {
                    setExhibits([
                        {
                            id: 1,
                            title: '현대미술 소장품',
                            subTitle: 'M2',
                            period: '2025.02.27. –',
                            heroImage:
                                'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2069&auto=format&fit=crop',
                            detailUrl: '#',
                        },
                    ]);
                }
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    // ===== Hero 자동 슬라이드 =====
    useEffect(() => {
        if (exhibits.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % exhibits.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [exhibits]);

    // ===== 카드 컴포넌트 =====
    const ExhibitCard: React.FC<{ item: Exhibition }> = ({ item }) => (
        <CS.Card>
            <CS.CardThumb $src={item.IMAGE_OBJECT} />
            <CS.CardBody>
                <CS.CardTitle>{item.TITLE}</CS.CardTitle>
                <CS.CardMeta>
                    {item.CNTC_INSTT_NM && (
                        <span>기관: {item.CNTC_INSTT_NM}</span>
                    )}
                    {item.PERIOD && <span>기간: {item.PERIOD}</span>}
                    {item.GENRE && <span>장르: {item.GENRE}</span>}
                </CS.CardMeta>
                <CS.CardLink
                    href={item.URL || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    상세보기
                </CS.CardLink>
            </CS.CardBody>
        </CS.Card>
    );

    // ===== KCISA 데이터 =====
    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                const items = await fetchKcisaItems(1, 8, controller.signal); // 넉넉히 가져오기
                setKcisaList(items);
            } catch {
                setKcisaList([]);
            }
        })();

        return () => controller.abort();
    }, []);

    const currentExhibit = exhibits[currentIndex];
    const now = new Date();

    // ===== KCISA 분류 =====
    const ongoing = kcisaList.filter((it) => {
        if (!it.PERIOD) return false;
        const [startStr, endStr] = it.PERIOD.split('–').map((s) => s.trim());
        if (!startStr) return false;
        const start = new Date(startStr.replace(/\./g, '-'));
        if (!endStr) {
            // 종료일 없으면 → 현재 진행 중으로 간주
            return start <= now;
        }
        const end = new Date(endStr.replace(/\./g, '-'));
        return start <= now && now <= end;
    });

    const upcoming = kcisaList.filter((it) => {
        if (!it.PERIOD) return false;
        const [startStr] = it.PERIOD.split('–').map((s) => s.trim());
        if (!startStr) return false;
        const start = new Date(startStr.replace(/\./g, '-'));
        return start > now;
    });

    const byGenre: Record<string, Exhibition[]> = {};
    kcisaList.forEach((it) => {
        if (!it.GENRE) return;
        if (!byGenre[it.GENRE]) byGenre[it.GENRE] = [];
        byGenre[it.GENRE].push(it);
    });

    const byOrg: Record<string, Exhibition[]> = {};
    kcisaList.forEach((it) => {
        if (!it.CNTC_INSTT_NM) return;
        if (!byOrg[it.CNTC_INSTT_NM]) byOrg[it.CNTC_INSTT_NM] = [];
        byOrg[it.CNTC_INSTT_NM].push(it);
    });

    const recommended = kcisaList.sort(() => Math.random() - 0.5).slice(0, 8);

    return (
        <Common.Root>
            {/* Hero */}
            <HS.Hero $bg={currentExhibit?.heroImage}>
                <HS.OverlayShade />
                <HS.Content>
                    {!loading && currentExhibit && (
                        <HS.InfoCard>
                            <HS.Tag>
                                {currentExhibit.subTitle ?? 'Bellarte'}
                            </HS.Tag>
                            <HS.Title>{currentExhibit.title}</HS.Title>
                            <HS.CTA href={currentExhibit.detailUrl ?? '#'}>
                                상세보기
                            </HS.CTA>
                            <HS.Meta>{currentExhibit.period ?? ''}</HS.Meta>
                        </HS.InfoCard>
                    )}
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
                                    상세보기1
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
