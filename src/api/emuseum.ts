import axios from "axios";

/** 백엔드 주소 */
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

/** axios 인스턴스 */
const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

/** 타입 */
export interface RelicItem {
  title?: string;
  description?: string;
  medium?: string;
  temporal?: string;
  relicId?: string;
  imageUrl?: string;
  thumbImage?: string;
  [k: string]: any;
}

/** 카테고리 */
export type Category = "ALL" | "PAINTING" | "CERAMIC" | "BOOK" | "ETC";

/** 카테고리 → 대표 검색어(없으면 undefined) */
const CAT_KEYWORDS: Record<Exclude<Category, "ALL" | "ETC">, string[]> = {
  PAINTING: ["그림", "회화", "유화", "수묵", "채색", "판화", "드로잉"],
  CERAMIC:  ["도자", "도자기", "자기", "도기", "토기", "청자", "백자", "분청", "항아리"],
  BOOK:     ["고서", "서적", "책", "문집", "경전", "목판", "판본"],
};
function keywordForCategory(cat: Category): string | undefined {
  if (cat === "PAINTING") return CAT_KEYWORDS.PAINTING[0];
  if (cat === "CERAMIC")  return CAT_KEYWORDS.CERAMIC[0];
  if (cat === "BOOK")     return CAT_KEYWORDS.BOOK[0];
  return undefined;
}

/** 유틸 */
function toArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function normalizeImg(u?: string): string | undefined {
  if (!u) return undefined;
  if (!/^https?:\/\//i.test(u)) return "http://" + u.replace(/^\/+/, "");
  return u;
}

/** 원본 → 화면용 매핑 */
function mapRawToRelicItem(r: any): RelicItem {
  return {
    ...r, // ⬅️ 먼저 펼치고
    title: r?.nameKr || r?.name || r?.title || "(제목 없음)", // 우리가 보정한 값이 최종 반영되게
    description: [r?.museumName2, r?.museumName3].filter(Boolean).join(" "),
    medium: r?.materialCode,
    temporal: r?.nationalityCode,
    relicId: r?.id,
    imageUrl: normalizeImg(r?.imgUri),
    thumbImage: normalizeImg(r?.imgThumUriM || r?.imgThumUriS || r?.imgThumUriL),
  };
}

/** 공공 데이터 포맷 보정 */
function parseListPayload(data: any) {
  console.log("LIST raw data =>", data);

  const code =
    data?.resultCode ??
    data?.result?.resultCode ??
    data?.response?.header?.resultCode ??
    data?.response?.body?.resultCode ??
    data?.body?.resultCode;

  const ok = code == null || code === "0000" || code === "00" || code === "0" || code === 0;

  if (!ok) {
    const msg =
      data?.resultMsg ??
      data?.result?.resultMsg ??
      data?.response?.header?.resultMsg ??
      data?.response?.body?.resultMsg ??
      data?.body?.resultMsg ??
      "API 실패";
    throw new Error(`API 실패: [${code}] ${msg}`);
  }

  const rawItems =
    (Array.isArray(data?.list) && data.list) ||
    toArray<any>(
      data?.response?.body?.items?.item ??
        data?.response?.body?.item ??
        (Array.isArray(data?.response?.body?.items)
          ? data?.response?.body?.items
          : undefined) ??
        (Array.isArray(data) ? data : undefined)
    );

  const items = rawItems.map(mapRawToRelicItem);

  const pageNo = Number(data?.pageNo ?? data?.response?.body?.pageNo ?? 1);
  const numOfRows = Number(data?.numOfRows ?? data?.response?.body?.numOfRows ?? items.length);
  const totalCount = Number(data?.totalCount ?? data?.response?.body?.totalCount ?? items.length);

  return { items, pageNo, numOfRows, totalCount };
}

/** 목록 API */
export async function getRelicList(params: {
  pageNo?: number;
  numOfRows?: number;
  keyword?: string;     // 사용자가 입력한 검색어
  category?: Category;  // 카테고리 버튼
}) {
  const name =
    (params.keyword && params.keyword.trim()) ||
    keywordForCategory(params.category ?? "ALL");

  const { data } = await api.get("/api/emuseum/relic/list", {
    params: {
      pageNo: params.pageNo ?? 1,
      numOfRows: params.numOfRows ?? 10,
      name, // 백엔드→e뮤지엄은 name으로 검색
    },
  });

  return parseListPayload(data);
}

/** 상세 API (느슨 파싱) */
export async function getRelicDetail(id: string) {
  const { data } = await api.get("/api/emuseum/relic/detail", { params: { id } });
  console.log("DETAIL raw data =>", data);

  const body = data?.result ?? data?.response?.body ?? data?.body ?? data;
  const candidate = body?.item ?? (Array.isArray(body?.list) ? body?.list[0] : body?.list) ?? body;
  const [itemRaw] = toArray(candidate);
  return mapRawToRelicItem(itemRaw || {});
}
