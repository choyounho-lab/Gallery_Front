import axios from "axios";

/** 백엔드 주소 */
const API_BASE = process.env.REACT_APP_API_BASE_URL;

/** axios 인스턴스 */
const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

/** 타입 */
export interface RelicItem {
  // 공통 표시용
  title?: string;
  description?: string;
  medium?: string;     // 재질(이름 우선 → 코드)
  temporal?: string;   // 국적/시대(이름 우선 → 코드)
  relicId?: string;
  imageUrl?: string;
  thumbImage?: string;

  // 상세에서 추가로 노출할 수 있는 필드들
  author?: string;
  indexWord?: string;

  nationalityCode?: string;
  nationalityName1?: string;
  nationalityName2?: string;

  materialCode?: string;
  materialName1?: string;
  materialName2?: string;

  purposeCode?: string;
  purposeName1?: string;
  purposeName2?: string;
  purposeName3?: string;
  purposeName4?: string;

  sizeRangeCode?: string;
  sizeRangeName?: string;

  placeLandCode?: string;
  placeLandName1?: string;
  placeLandName2?: string;

  designationCode?: string;
  designationName1?: string;
  designationName2?: string;
  designationInfo?: string;

  museumName1?: string;
  museumName2?: string;
  museumName3?: string;

  sizeInfo?: string;
  desc?: string;

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

/** 원본 → 화면용 매핑 (상세필드 대폭 확장) */
function mapRawToRelicItem(r: any): RelicItem {
  const title =
    r?.nameKr || r?.name || r?.title || "(제목 없음)";

  // 이름을 우선으로 한 대표 표기
  const medium =
    r?.materialName1 || r?.materialName2 || r?.materialCode;
  const temporal =
    r?.nationalityName2 || r?.nationalityName1 || r?.nationalityCode;

  // 설명: 박물관명 2/3를 합쳐 간단 표시
  const description = [r?.museumName2, r?.museumName3].filter(Boolean).join(" ");

  return {
    ...r, // 원본 필드도 그대로 보존
    title,
    description,
    medium,
    temporal,
    relicId: r?.id,
    imageUrl: normalizeImg(r?.imgUri),
    thumbImage: normalizeImg(r?.imgThumUriM || r?.imgThumUriS || r?.imgThumUriL),

    // 상세 노출용(이름/코드 쌍들 포함)
    author: r?.author,
    indexWord: r?.indexWord,

    nationalityCode: r?.nationalityCode,
    nationalityName1: r?.nationalityName1,
    nationalityName2: r?.nationalityName2,

    materialCode: r?.materialCode,
    materialName1: r?.materialName1,
    materialName2: r?.materialName2,

    purposeCode: r?.purposeCode,
    purposeName1: r?.purposeName1,
    purposeName2: r?.purposeName2,
    purposeName3: r?.purposeName3,
    purposeName4: r?.purposeName4,

    sizeRangeCode: r?.sizeRangeCode,
    sizeRangeName: r?.sizeRangeName,

    placeLandCode: r?.placeLandCode,
    placeLandName1: r?.placeLandName1,
    placeLandName2: r?.placeLandName2,

    designationCode: r?.designationCode,
    designationName1: r?.designationName1,
    designationName2: r?.designationName2,
    designationInfo: r?.designationInfo,

    museumName1: r?.museumName1,
    museumName2: r?.museumName2,
    museumName3: r?.museumName3,

    sizeInfo: r?.sizeInfo,
    desc: r?.desc,
  };
}

/** 공공 데이터 포맷 보정 */
function parseListPayload(data: any) {
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
      (Array.isArray(data?.response?.body?.items) ? data?.response?.body?.items : undefined) ??
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
  keyword?: string;
  category?: Category;
}) {
  const name =
    (params.keyword && params.keyword.trim()) ||
    keywordForCategory(params.category ?? "ALL");

  const { data } = await api.get("/api/emuseum/relic/list", {
    params: {
      pageNo: params.pageNo ?? 1,
      numOfRows: params.numOfRows ?? 10,
      name, // 백엔드→e뮤지엄은 name 검색
    },
  });

  return parseListPayload(data);
}

/** 상세 API (list[0]·item 모두 대응) */
export async function getRelicDetail(id: string) {
  const { data } = await api.get("/api/emuseum/relic/detail", { params: { id } });

  const body = data?.result ?? data?.response?.body ?? data?.body ?? data;
  const candidate =
    body?.item ??
    (Array.isArray(body?.list) ? body?.list[0] : body?.list) ??
    body;
  const [itemRaw] = toArray(candidate);

  return mapRawToRelicItem(itemRaw || {});
}
