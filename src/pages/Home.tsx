// - 상단 히어로는 백엔드 추천 → 실패 시 KCISA 1건 폴백 → 최종 임시 데이터
// - 하단 추천 그리드는 KCISA 8건
// - AbortController 로 언마운트시 요청 취소 처리

import React, { useEffect, useState } from "react";
import { instance } from "../api/instance";
import { FeaturedExhibit, Exhibition } from "../types/ApiType";
import { fetchKcisaItems, toFeaturedExhibit } from "../api/kcisa";

import * as Common from "../style/home/Common.styles";
import * as HS from "../style/home/Hero.styles";
import * as CS from "../style/home/Card.styles";

const Home: React.FC = () => {
  const [exhibit, setExhibit] = useState<FeaturedExhibit | null>(null);
  const [loading, setLoading] = useState(true);
  const [kcisaList, setKcisaList] = useState<Exhibition[]>([]);

  // ===== 히어로 데이터: 백엔드 → KCISA → 임시 =====
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        // 1) 백엔드 추천 히어로
        const res = await instance.get<FeaturedExhibit>("/api/home/featured", {
          signal: controller.signal,
        });
        setExhibit(res.data);
      } catch {
        try {
          // 2) KCISA 1건 폴백
          const items = await fetchKcisaItems(1, 1, controller.signal);
          if (items.length > 0) setExhibit(toFeaturedExhibit(items[0]));
          else {
            // 3) 최종 임시
            setExhibit({
              id: 1,
              title: "현대미술 소장품",
              subTitle: "M2",
              period: "2025.02.27. –",
              heroImage:
                "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2069&auto=format&fit=crop",
              detailUrl: "#",
            });
          }
        } catch {
          // 3) 최종 임시
          setExhibit({
            id: 1,
            title: "현대미술 소장품",
            subTitle: "M2",
            period: "2025.02.27. –",
            heroImage:
              "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2069&auto=format&fit=crop",
            detailUrl: "#",
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

  return (
    <Common.Root>
      {/* 히어로 */}
      <HS.Hero $bg={exhibit?.heroImage}>
        <HS.OverlayShade />
        <HS.Content>
          <HS.CircleButton title="설정">✧</HS.CircleButton>

          {!loading && exhibit && (
            <HS.InfoCard>
              <HS.Tag>{exhibit.subTitle ?? "Bellarte"}</HS.Tag>
              <HS.Title>{exhibit.title}</HS.Title>
              <HS.CTA href={exhibit.detailUrl ?? "#"}>상세보기</HS.CTA>
              <HS.Meta>{exhibit.period ?? ""}</HS.Meta>
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
                  {it.CNTC_INSTT_NM && <span>기관: {it.CNTC_INSTT_NM}</span>}
                  {it.PERIOD && <span>기간: {it.PERIOD}</span>}
                  {it.GENRE && <span>장르: {it.GENRE}</span>}
                </CS.CardMeta>
                <CS.CardLink
                  href={it.URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  상세보기
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
