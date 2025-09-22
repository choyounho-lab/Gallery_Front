// Home2.tsx
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { instance } from '../api/instance';
import { FeaturedExhibit, Exhibition } from '../types/ApiType';
import { fetchKcisaItems, toFeaturedExhibit } from '../api/kcisa';
import { themes, useSettings } from '../contexts/SettingsContext';

import * as Common from '../style/home/Common.styles';
import * as HS from '../style/home/Hero.styles';
import * as CS from '../style/home/Card.styles';
import { Sidebar } from '../components/Sidebar/Sidebar';

// ===== 날짜 파싱 유틸 =====
// 날짜 파싱 유틸(안전 버전) - 그대로 유지
const toISODate = (s?: string | null) => {
    if (!s) return null;
    const m = s.match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
    if (!m) return null;
    const [, y, mo, d] = m;
    const yy = Number(y),
        mm = Number(mo),
        dd = Number(d);
    const date = new Date(yy, mm - 1, dd, 0, 0, 0, 0);
    return isNaN(date.getTime()) ? null : date;
};

// "YYYY.MM.DD … YYYY.MM.DD"에서 날짜 문자열 1~2개 추출 - 그대로 유지
const splitPeriod = (period: string) => {
    const dates: string[] =
        period.match(/\d{4}[.\-\/]\d{1,2}[.\-\/]\d{1,2}/g) ?? [];
    const start = toISODate(dates[0] ?? null);
    const end = toISODate(dates[1] ?? null);
    return { start, end };
};

// ===== 날짜만 비교하도록 정규화(옵션 2) =====
const normalizeDate = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

// ===== 기간 토글 UI =====
type PeriodMode = 'all' | 'ongoing' | 'upcoming';

const ToggleBar = styled.div`
    position: sticky;
    top: 0;
    z-index: 5;
    display: flex;
    gap: 8px;
    padding: 10px 16px;
    backdrop-filter: blur(6px);
    background: color-mix(in oklab, #0b0b0b 80%, transparent);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;
const ToggleButton = styled.button<{ active?: boolean }>`
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: ${({ active }) =>
        active ? 'rgba(255,255,255,0.14)' : 'transparent'};
    color: inherit;
    cursor: pointer;
    transition: transform 0.15s ease, background 0.2s ease;
    white-space: nowrap;
    &:hover {
        transform: translateY(-1px);
    }
`;

const Home2: React.FC = () => {
    const [exhibits, setExhibits] = useState<FeaturedExhibit[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [kcisaList, setKcisaList] = useState<Exhibition[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [paused, setPaused] = useState(false);

    // 기간 토글 상태
    const [period, setPeriod] = useState<PeriodMode>('all');

    const { theme, fontSize } = useSettings();

    // 오늘(자정 기준) — 옵션2: useMemo 없이 현재 시각을 즉시 반영
    const now = normalizeDate(new Date());

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
                    } else {
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
        if (paused || exhibits.length === 0) return;
        const id = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % exhibits.length);
        }, 5000);
        return () => clearInterval(id);
    }, [paused, exhibits.length]);

    // ===== KCISA 데이터 =====
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const items = await fetchKcisaItems(1, 48, controller.signal);
                setKcisaList(items);
            } catch {
                setKcisaList([]);
            }
        })();
        return () => controller.abort();
    }, []);

    // ===== 진행/예정 분류 (옵션2: 날짜만 비교) =====
    const ongoing = useMemo(() => {
        return kcisaList.filter((it) => {
            if (!it.PERIOD) return false;
            const { start, end } = splitPeriod(it.PERIOD);
            if (!start) return false;
            const s = normalizeDate(start);
            return end ? s <= now && now <= normalizeDate(end) : s <= now;
        });
    }, [kcisaList, now]);

    const upcoming = useMemo(() => {
        return kcisaList.filter((it) => {
            if (!it.PERIOD) return false;
            const { start } = splitPeriod(it.PERIOD);
            if (!start) return false;
            const s = normalizeDate(start);
            return s > now;
        });
    }, [kcisaList, now]);

    // 기간 토글이 적용된 기본 리스트
    const baseList = useMemo(() => {
        if (period === 'ongoing') return ongoing;
        if (period === 'upcoming') return upcoming;
        return kcisaList;
    }, [period, ongoing, upcoming, kcisaList]);

    // 기관별 묶음(기간 토글 적용)
    const byOrg = useMemo(() => {
        const map: Record<string, Exhibition[]> = {};
        baseList.forEach((it) => {
            if (!it.CNTC_INSTT_NM) return;
            (map[it.CNTC_INSTT_NM] ||= []).push(it);
        });
        return map;
    }, [baseList]);

    // 추천 전시(기간 토글 적용)
    const recommended = useMemo(() => {
        const shuffled = [...baseList].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 8);
    }, [baseList]);

    const currentExhibit = exhibits[currentIndex];

    // ===== 카드 컴포넌트 =====
    const ExhibitCard: React.FC<{ item: Exhibition }> = ({ item }) => (
        <CS.Card>
            <CS.CardThumb
                role="img"
                aria-label={item.TITLE}
                $src={item.IMAGE_OBJECT}
            />
            <CS.CardBody>
                <CS.CardTitle themeMode={theme as keyof typeof themes}>
                    {item.TITLE}
                </CS.CardTitle>
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

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <Common.Root style={{ ['--app-font-size' as any]: fontSize ?? '16px' }}>
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Hero */}
            <HS.Hero
                $bg={currentExhibit?.heroImage}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <HS.OverlayShade />
                <HS.Content>
                    <HS.CircleButton
                        title="설정"
                        aria-label="설정 열기"
                        onClick={toggleSidebar}
                    >
                        ✧
                    </HS.CircleButton>

                    {!loading && currentExhibit && (
                        <HS.InfoCard $theme={theme as keyof typeof themes}>
                            <HS.Tag>
                                {currentExhibit.subTitle ?? 'Bellarte'}
                            </HS.Tag>
                            <HS.Title>{currentExhibit.title}</HS.Title>
                            <HS.CTA
                                href={currentExhibit.detailUrl ?? '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                상세보기
                            </HS.CTA>
                            <HS.Meta>{currentExhibit.period ?? ''}</HS.Meta>
                        </HS.InfoCard>
                    )}
                </HS.Content>
            </HS.Hero>

            {/* 기간 토글 바 */}
            <ToggleBar>
                <ToggleButton
                    active={period === 'all'}
                    onClick={() => setPeriod('all')}
                >
                    전체
                </ToggleButton>
                <ToggleButton
                    active={period === 'ongoing'}
                    onClick={() => setPeriod('ongoing')}
                >
                    진행 중
                </ToggleButton>
                <ToggleButton
                    active={period === 'upcoming'}
                    onClick={() => setPeriod('upcoming')}
                >
                    예정
                </ToggleButton>
            </ToggleBar>

            {/* 기관별 전시(기간 토글 적용, 각 기관 최대 8개) */}
            {Object.entries(byOrg).map(([org, list]) => (
                <CS.Section key={org}>
                    <CS.SectionTitle>
                        {org}
                        {period !== 'all'
                            ? ` · ${period === 'ongoing' ? '진행 중' : '예정'}`
                            : ''}
                    </CS.SectionTitle>
                    <CS.Grid>
                        {list.slice(0, 8).map((it) => (
                            <ExhibitCard key={it.LOCAL_ID} item={it} />
                        ))}
                    </CS.Grid>
                </CS.Section>
            ))}

            {/* 오늘의 추천 전시(기간 토글 적용, 8개) */}
            <CS.Section>
                <CS.SectionTitle>
                    오늘의 추천 전시
                    {period !== 'all'
                        ? ` · ${period === 'ongoing' ? '진행 중' : '예정'}`
                        : ''}
                </CS.SectionTitle>
                <CS.Grid>
                    {recommended.map((it) => (
                        <ExhibitCard key={it.LOCAL_ID} item={it} />
                    ))}
                </CS.Grid>
            </CS.Section>
        </Common.Root>
    );
};

export default Home2;
