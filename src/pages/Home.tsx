import React, { useEffect, useState } from 'react';
import { Exhibition, FeaturedExhibit } from '../types/ApiType';
import { fetchKcisaItems, toFeaturedExhibit } from '../api/kcisa';
import { dummyKcisaList } from '../api/dummyData'; // ✅ 더미 데이터 import123123
import { themes, useSettings } from '../contexts/SettingsContext';

import * as Common from '../style/home/Common.styles';
import * as HS from '../style/home/Hero.styles';
import * as CS from '../style/home/Card.styles';
import { Sidebar } from '../components/Sidebar/Sidebar';

const Home: React.FC = () => {
    const [exhibits, setExhibits] = useState<FeaturedExhibit[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [kcisaList, setKcisaList] = useState<Exhibition[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { theme, fontSize } = useSettings();

    // ===== 히어로 데이터: 백엔드 → KCISA → 임시 =====
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await instance.get<FeaturedExhibit>(
                    '/api/home/featured',
                    {
                        signal: controller.signal,
                    }
                );
                setExhibit(res.data);
            } catch {
                try {
                    const items = await fetchKcisaItems(
                        1,
                        1,
                        controller.signal
                    );
                    if (items.length > 0)
                        setExhibit(toFeaturedExhibit(items[0]));
                    else {
                        setExhibit({
                            id: 1,
                            title: '현대미술 소장품',
                            subTitle: 'M2',
                            period: '2025.02.27. –',
                            heroImage:
                                'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2069&auto=format&fit=crop',
                            detailUrl: '#',
                        });
                    }
                } catch {
                    setExhibit({
                        id: 1,
                        title: '현대미술 소장품',
                        subTitle: 'M2',
                        period: '2025.02.27. –',
                        heroImage:
                            'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2069&auto=format&fit=crop',
                        detailUrl: '#',
                    });
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, []);

    // ===== 추천 그리드: KCISA 다건 =====
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const items = await fetchKcisaItems(1, 8, controller.signal);
                setKcisaList(items);
            } catch {
                setKcisaList([]);
            }
        })();
        return () => controller.abort();
    }, []);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    console.log('InfoCard theme:', theme);
    return (
        <Common.Root>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Hero */}
            <HS.Hero $bg={currentExhibit?.heroImage}>
                <HS.OverlayShade />
                <HS.Content>
                    <HS.CircleButton title="설정" onClick={toggleSidebar}>
                        ✧
                    </HS.CircleButton>

                    {!loading && currentExhibit && (
                        <HS.InfoCard $theme={theme as keyof typeof themes}>
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

            {/* 기관별 전시 */}
            {Object.entries(byOrg).map(([org, list]) => (
                <CS.Section key={org}>
                    <CS.SectionTitle>{org}</CS.SectionTitle>
                    <CS.Grid>
                        {list.map((it) => (
                            <ExhibitCard key={it.LOCAL_ID} item={it} />
                        ))}
                    </CS.Grid>
                </CS.Section>
            ))}

            {/* 오늘의 추천 전시 */}
            <CS.Section>
                <CS.SectionTitle>오늘의 추천 전시</CS.SectionTitle>
                <CS.Grid>
                    {recommended.map((it) => (
                        <ExhibitCard key={it.LOCAL_ID} item={it} />
                    ))}
                </CS.Grid>
            </CS.Section>
        </Common.Root>
    );
};

export default Home;
