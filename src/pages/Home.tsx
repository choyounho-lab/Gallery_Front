// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { Exhibition, FeaturedExhibit } from "../types/ApiType";
import { fetchKcisaItems, toFeaturedExhibit } from "../api/kcisa";
import { dummyKcisaList } from "../api/dummyData"; // ✅ 더미 데이터 import
import { themes, useSettings } from "../contexts/SettingsContext";

import * as Common from "../style/home/Common.styles";
import * as HS from "../style/home/Hero.styles";
import * as CS from "../style/home/Card.styles";
import { Sidebar } from "../components/Sidebar/Sidebar";

const Home: React.FC = () => {
  const [exhibits, setExhibits] = useState<FeaturedExhibit[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [kcisaList, setKcisaList] = useState<Exhibition[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { theme, fontSize } = useSettings();

  // ===== KCISA 데이터 (서버 프록시 사용) =====
  useEffect(() => {
    (async () => {
      try {
        const items = await fetchKcisaItems(1, 20); // 프록시 서버 호출
        console.log("✅ KCISA 응답:", items);
        setKcisaList(items);

        // 첫 Hero용 데이터도 KCISA에서 가져오기
        if (items.length > 0) {
          setExhibits(items.slice(0, 5).map(toFeaturedExhibit));
        }
      } catch (err) {
        console.error("❌ KCISA 데이터 가져오기 실패:", err);
        // ✅ API 실패 시 dummyKcisaList 사용
        setKcisaList(dummyKcisaList);
        setExhibits(dummyKcisaList.slice(0, 5).map(toFeaturedExhibit));
      } finally {
        setLoading(false);
      }
    })();
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
        <CS.CardTitle themeMode={theme}>{item.TITLE}</CS.CardTitle>
        <CS.CardMeta>
          {item.CNTC_INSTT_NM && <span>기관: {item.CNTC_INSTT_NM}</span>}
          {item.PERIOD && <span>기간: {item.PERIOD}</span>}
          {item.GENRE && <span>장르: {item.GENRE}</span>}
        </CS.CardMeta>
        <CS.CardLink
          href={item.URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          상세보기
        </CS.CardLink>
      </CS.CardBody>
    </CS.Card>
  );

  const currentExhibit = exhibits[currentIndex];

  // ===== KCISA 분류 =====
  const byOrg: Record<string, Exhibition[]> = {};
  kcisaList.forEach((it) => {
    if (!it.CNTC_INSTT_NM) return;
    if (!byOrg[it.CNTC_INSTT_NM]) byOrg[it.CNTC_INSTT_NM] = [];
    byOrg[it.CNTC_INSTT_NM].push(it);
  });

  const recommended = [...kcisaList]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <Common.Root>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Hero */}
      <HS.Hero $bg={currentExhibit?.heroImage}>
        <HS.OverlayShade />
        <HS.Content>
          <HS.CircleButton title="설정" onClick={toggleSidebar}>
            ✧
          </HS.CircleButton>

          {!loading && currentExhibit && (
            <HS.InfoCard $theme={theme as keyof typeof themes}>
              <HS.Tag>{currentExhibit.subTitle ?? "Bellarte"}</HS.Tag>
              <HS.Title>{currentExhibit.title}</HS.Title>
              <HS.CTA href={currentExhibit.detailUrl ?? "#"}>상세보기</HS.CTA>
              <HS.Meta>{currentExhibit.period ?? ""}</HS.Meta>
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
