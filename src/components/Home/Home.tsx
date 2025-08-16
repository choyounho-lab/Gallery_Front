// src/components/Home/Home.tsx

// React 및 API, 스타일, 유틸 라이브러리 import
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  apiGetNewReleases,
  apiGetTracksByAlbumId,
  apiGetKpopAlbums,
} from "../../api/api";
import { NewReleasesResponse, AlbumItem, Track } from "../../types/types";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { FastAverageColor } from "fast-average-color";
import {
  HomeContainer,
  HomeSection,
  HomeTitle,
  ThumbnailList,
  ThumbnailWrapper,
  ThumbnailImage,
  ThumbnailOverlay,
  AlbumList,
  AlbumCard,
  AlbumImage,
  AlbumInfo,
  AlbumNameContainer,
  ScrollText,
  TrackList,
  TrackItem,
  TrackEmpty,
  TrackScrollText,
  CarouselWrapper,
  ArrowButton,
  PlayButton,
  KpopAlbumList,
  KpopAlbumCard,
  KpopPlayButton,
  AlbumCarouselWrapper,
  GlobalArrowButton,
} from "./Home.styles";

// 메인페이지 시작 페이지
import LinearBurnCanvas from "../../components/LinearBurnCanvas/LinearBurnCanvas";

// NewArtist
import Test from "../Artist/NewArtist";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userInfo";
import axios from "axios";

// 플러그인 등록
gsap.registerPlugin(ScrollToPlugin);

// Home 컴포넌트가 isDarkMode prop을 받도록 수정
function Home({ isDarkMode }: { isDarkMode: boolean }) {
  // 상태 정의
  const [newReleasesData, setNewReleasesData] =
    useState<NewReleasesResponse | null>(null);
  const [albumTracksMap, setAlbumTracksMap] = useState<Record<string, Track[]>>(
    {}
  );
  const [albumColors, setAlbumColors] = useState<Record<string, string>>({});
  const [kpopAlbums, setKpopAlbums] = useState<AlbumItem[]>([]);
  const latestAlbumListRef = useRef<HTMLUListElement>(null);
  const [testArtistIds, setTestArtistIds] = useState<string[]>([]);

  // 수평 캐러셀 스크롤 핸들러
  const scrollList = useCallback((dir: number, elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) el.scrollBy({ left: 600 * dir, behavior: "smooth" });
  }, []);

  // 수직 캐러셀 스크롤 핸들러
  const scrollVerticalAlbumList = useCallback((dir: number) => {
    if (latestAlbumListRef.current) {
      const cardHeight = 104;
      const gapHeight = 16;
      const scrollAmount = (cardHeight + gapHeight) * 3;
      latestAlbumListRef.current.scrollBy({
        top: scrollAmount * dir,
        behavior: "smooth",
      });
    }
  }, []);

  //카카오페이
  // useEffect(() => {
  //     axios
  //         .post(
  //             'https://open-api.kakaopay.com/online/v1/payment/ready',
  //             {
  //                 cid: 'TC0ONETIME',
  //                 partner_order_id: 'partner_order_id',
  //                 partner_user_id: 'partner_user_id',
  //                 item_name: '초코파이',
  //                 quantity: '1',
  //                 total_amount: '2200',
  //                 vat_amount: '200',
  //                 tax_free_amount: '0',
  //                 approval_url: 'https://developers.kakao.com/success',
  //                 fail_url: 'https://developers.kakao.com/fail',
  //                 cancel_url: 'https://developers.kakao.com/cancel',
  //             },
  //             {
  //                 headers: {
  //                     Authorization:
  //                         'SECRET_KEY DEV0570670DBC65B5887D71F1BAD3FC051172A60',
  //                     'Content-Type': 'application/json',
  //                 },
  //             }
  //         )
  //         .then((res) => {
  //             console.log(res);
  //         });
  // }, []);

  // 앨범별 트랙 병렬 요청 처리
  const fetchTracksWithConcurrency = useCallback(
    async (albums: AlbumItem[], limit = 1) => {
      const resultMap: Record<string, Track[]> = {};
      for (let i = 0; i < albums.length; i += limit) {
        const batch = albums.slice(i, i + limit);
        await Promise.all(
          batch.map(async (album) => {
            if (!album.id) return;
            try {
              const res = await apiGetTracksByAlbumId(album.id);
              resultMap[album.id] = res.items ? res.items.slice(0, 20) : [];
            } catch (e) {
              console.error(`트랙 요청 실패: ${album.id}`, e);
              resultMap[album.id] = [];
            }
          })
        );
      }
      return resultMap;
    },
    []
  );

  // 최신 앨범/트랙/아티스트 이미지 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGetNewReleases();
        setNewReleasesData(data);
        const albums = data.albums?.items?.slice(0, 20) || [];
        const tracksMap = await fetchTracksWithConcurrency(albums, 3);
        setAlbumTracksMap(tracksMap);

        // Test 컴포넌트에 전달할 아티스트 ID 추출 (최대 10개)
        const extractedArtistIds: string[] = [];
        const seenArtistIds = new Set<string>(); // 중복 방지를 위한 Set
        for (const album of albums) {
          if (extractedArtistIds.length >= 10) break; // 10개 채우면 중단
          for (const artist of album.artists) {
            if (extractedArtistIds.length >= 10) break;
            if (artist.id && !seenArtistIds.has(artist.id)) {
              extractedArtistIds.push(artist.id);
              seenArtistIds.add(artist.id);
            }
          }
        }
        setTestArtistIds(extractedArtistIds);
      } catch (err) {
        console.error("최신 앨범 및 트랙 불러오기 오류:", err);
      }
    };
    fetchData();
  }, []);

  // K-POP 앨범 데이터 로드
  useEffect(() => {
    const fetchKpopAlbumsData = async () => {
      try {
        const kpopAlbumsResponse = await apiGetKpopAlbums(0, 20);
        if (kpopAlbumsResponse?.albums?.items) {
          setKpopAlbums(kpopAlbumsResponse.albums.items);
        }
      } catch (err) {
        console.error("K-POP 앨범 불러오기 오류:", err);
      }
    };
    fetchKpopAlbumsData();
  }, []);

  // 앨범 이미지 평균 색상 추출
  useEffect(() => {
    const allAlbumsToProcess = [
      ...(newReleasesData?.albums?.items || []),
      ...kpopAlbums,
    ];
    if (allAlbumsToProcess.length === 0) return;
    const fac = new FastAverageColor();
    const colorMap: Record<string, string> = {};
    const fetchColors = async () => {
      const promises = allAlbumsToProcess.map((item) => {
        return new Promise<void>((resolve) => {
          if (!item.id || albumColors[item.id]) return resolve();
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = item.images?.[0]?.url ?? "";
          if (!img.src) {
            colorMap[item.id] = "#726d77";
            return resolve();
          }
          img.onload = async () => {
            try {
              const color = await fac.getColorAsync(img);
              colorMap[item.id] = color.hex;
            } catch {
              colorMap[item.id] = "#726d77";
            }
            resolve();
          };
          img.onerror = () => {
            colorMap[item.id] = "#726d77";
            resolve();
          };
        });
      });
      await Promise.all(promises);
      setAlbumColors((prev) => ({ ...prev, ...colorMap }));
    };
    fetchColors();
  }, [newReleasesData, kpopAlbums]);

  // 앨범 및 트랙명 hover 시 텍스트 스크롤 애니메이션
  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    const albumNameContainers = document.querySelectorAll<HTMLElement>(
      ".album-name-scroll-container"
    );
    albumNameContainers.forEach((container) => {
      const scrollText = container.querySelector(".scroll-text") as HTMLElement;
      if (!scrollText) return;
      const containerWidth = container.offsetWidth;
      const textWidth = scrollText.scrollWidth;
      scrollText.style.transition = "transform 4s linear";
      scrollText.style.transform = "translateX(0)";
      if (textWidth > containerWidth) {
        const handleEnter = () => {
          scrollText.style.transition = "transform 4s linear";
          scrollText.style.transform = `translateX(-${
            textWidth - containerWidth
          }px)`;
        };
        const handleLeave = () => {
          scrollText.style.transition = "none";
          scrollText.style.transform = "translateX(0)";
          setTimeout(() => {
            scrollText.style.transition = "transform 4s linear";
          }, 20);
        };
        container.addEventListener("mouseenter", handleEnter);
        container.addEventListener("mouseleave", handleLeave);
        cleanupFunctions.push(() => {
          container.removeEventListener("mouseenter", handleEnter);
          container.removeEventListener("mouseleave", handleLeave);
        });
      }
    });

    const trackItems = document.querySelectorAll<HTMLElement>(
      ".track-item-scroll-container"
    );
    trackItems.forEach((container) => {
      const scrollText = container.querySelector(
        ".track-scroll-text"
      ) as HTMLElement;
      if (!scrollText) return;
      const containerWidth = container.offsetWidth;
      const textWidth = scrollText.scrollWidth;
      scrollText.style.transition = "transform 4s linear";
      scrollText.style.transform = "translateX(0)";
      if (textWidth > containerWidth) {
        const handleEnter = () => {
          scrollText.style.transition = "transform 4s linear";
          scrollText.style.transform = `translateX(-${
            textWidth - containerWidth
          }px)`;
        };
        const handleLeave = () => {
          scrollText.style.transition = "none";
          scrollText.style.transform = "translateX(0)";
          setTimeout(() => {
            scrollText.style.transition = "transform 4s linear";
          }, 20);
        };
        container.addEventListener("mouseenter", handleEnter);
        container.addEventListener("mouseleave", handleLeave);
        cleanupFunctions.push(() => {
          container.removeEventListener("mouseenter", handleEnter);
          container.removeEventListener("mouseleave", handleLeave);
        });
      }
    });

    return () => {
      cleanupFunctions.forEach((fn) => fn());
    };
  }, [newReleasesData, albumTracksMap]);

  const user = useSelector(selectUserInfo);

  useEffect(() => {
    console.table(user);
  }, []);
  const mainContentRef = useRef<HTMLElement>(null);
  const handleScrollToMain = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <HomeContainer isDarkMode={isDarkMode}>
      {/* 🔹 LinearBurnCanvas는 계속 렌더링 */}
      <LinearBurnCanvas
        onScrollClick={handleScrollToMain}
        // isDarkMode={isDarkMode}
      />

      {/* Test 컴포넌트에 artistIds prop 전달 */}
      <Test artistIds={testArtistIds} />

      {/* 최신 앨범 섹션 */}
      <HomeSection ref={mainContentRef}>
        <HomeTitle isDarkMode={isDarkMode}>최신 앨범</HomeTitle>

        <CarouselWrapper>
          <ArrowButton
            pos="left"
            onClick={() => scrollList(-1, "thumbnailList")}
            isDarkMode={isDarkMode}
          >
            &#10094;
          </ArrowButton>
          <ThumbnailList id="thumbnailList">
            {newReleasesData?.albums?.items?.slice(0, 20).map((album) => (
              <Link
                key={album.id}
                to={
                  {
                    pathname: "/albumDetail",
                    search: `?id=${album.id}&search=${encodeURIComponent(
                      album.name
                    )}`,
                    state: {
                      albumData: album,
                      tracks: albumTracksMap[album.id] || [],
                    },
                  } as any
                }
              >
                <ThumbnailWrapper key={album.id} title={album.name}>
                  <ThumbnailImage
                    src={album.images?.[0]?.url ?? "/fallback.jpg"}
                    alt={album.name}
                    loading="lazy"
                  />
                  <ThumbnailOverlay>
                    <strong>{album.name}</strong>
                    <small>{album.artists.map((a) => a.name).join(", ")}</small>
                  </ThumbnailOverlay>
                </ThumbnailWrapper>
              </Link>
            ))}
          </ThumbnailList>
          <ArrowButton
            pos="right"
            onClick={() => scrollList(1, "thumbnailList")}
            isDarkMode={isDarkMode}
          >
            &#10095;
          </ArrowButton>
        </CarouselWrapper>
      </HomeSection>

      <HomeTitle isDarkMode={isDarkMode}>최신곡</HomeTitle>
      <HomeSection id="main-content-start">
        <AlbumCarouselWrapper>
          <AlbumList ref={latestAlbumListRef}>
            {newReleasesData?.albums?.items?.slice(0, 20).map((album) => (
              <Link
                key={album.id}
                to={
                  {
                    pathname: "/albumDetail",
                    search: `?id=${album.id}&search=${encodeURIComponent(
                      album.name
                    )}`,
                    state: {
                      albumData: album,
                      tracks: albumTracksMap[album.id] || [],
                    },
                  } as any
                }
              >
                <AlbumCard
                  bgColor={albumColors[album.id] ?? "#726d77"}
                  title={album.name}
                  isDarkMode={isDarkMode}
                >
                  <AlbumImage
                    src={album.images?.[0]?.url ?? "/fallback.jpg"}
                    alt={album.name}
                    loading="lazy"
                  />
                  <AlbumInfo>
                    <AlbumNameContainer className="album-name-scroll-container">
                      <ScrollText className="scroll-text">
                        {album.name}
                      </ScrollText>
                    </AlbumNameContainer>
                    <TrackList>
                      {albumTracksMap[album.id]?.length ? (
                        albumTracksMap[album.id].slice(0, 1).map((track) => (
                          <TrackItem
                            key={track.id}
                            className="track-item-scroll-container"
                            isDarkMode={isDarkMode}
                          >
                            <TrackScrollText className="track-scroll-text">
                              {track.name}
                            </TrackScrollText>
                          </TrackItem>
                        ))
                      ) : (
                        <TrackEmpty isDarkMode={isDarkMode}>
                          수록곡 없음
                        </TrackEmpty>
                      )}
                    </TrackList>
                  </AlbumInfo>
                  <PlayButton isDarkMode={isDarkMode}>▶</PlayButton>
                </AlbumCard>
              </Link>
            ))}
          </AlbumList>
          <GlobalArrowButton
            pos="up"
            onClick={() => scrollVerticalAlbumList(-1)}
            isDarkMode={isDarkMode}
          >
            &#9650;
          </GlobalArrowButton>
          <GlobalArrowButton
            pos="down"
            onClick={() => scrollVerticalAlbumList(1)}
            isDarkMode={isDarkMode}
          >
            &#9660;
          </GlobalArrowButton>
        </AlbumCarouselWrapper>
      </HomeSection>

      <HomeSection>
        <HomeTitle isDarkMode={isDarkMode}>
          K-POP 인기 앨범 / PLAY LIST
        </HomeTitle>
        <CarouselWrapper>
          <ArrowButton
            pos="left"
            onClick={() => scrollList(-1, "kpopAlbumList")}
            isDarkMode={isDarkMode}
          >
            &#10094;
          </ArrowButton>
          <KpopAlbumList id="kpopAlbumList">
            {kpopAlbums.length > 0 ? (
              kpopAlbums.map((album) => (
                <KpopAlbumCard
                  key={album.id}
                  bgColor={albumColors[album.id] ?? "#a052ff"}
                  title={album.name}
                  isDarkMode={isDarkMode}
                >
                  <AlbumImage
                    src={album.images?.[0]?.url ?? "/fallback.jpg"}
                    alt={album.name}
                    loading="lazy"
                  />
                  <AlbumInfo>
                    <AlbumNameContainer className="album-name-scroll-container">
                      <ScrollText className="scroll-text">
                        {album.name}
                      </ScrollText>
                    </AlbumNameContainer>
                    <small>{album.artists.map((a) => a.name).join(", ")}</small>
                  </AlbumInfo>
                  <KpopPlayButton isDarkMode={isDarkMode}>▶</KpopPlayButton>
                </KpopAlbumCard>
              ))
            ) : (
              <TrackEmpty isDarkMode={isDarkMode}>
                K-POP 앨범을 불러오는 중이거나 없습니다.
              </TrackEmpty>
            )}
          </KpopAlbumList>
          <ArrowButton
            pos="right"
            onClick={() => scrollList(1, "kpopAlbumList")}
            isDarkMode={isDarkMode}
          >
            &#10095;
          </ArrowButton>
        </CarouselWrapper>
      </HomeSection>
    </HomeContainer>
  );
}

export default Home;
