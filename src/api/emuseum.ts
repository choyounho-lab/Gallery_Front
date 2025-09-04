// src/api/emuseum.ts
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

/** 유틸 */
function toArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function normalizeImg(u?: string): string | undefined {
  if (!u) return undefined;
  if (!/^https?:\/\//i.test(u)) return "https://" + u.replace(/^\/+/, "");
  return u;
}

/** e뮤지엄 원본 → 화면용 아이템 매핑 */
function mapRawToRelicItem(r: any): RelicItem {
  return {
    title: r?.nameKr || r?.name || r?.title || "(제목 없음)",
    description: [r?.museumName2, r?.museumName3].filter(Boolean).join(" "),
    medium: r?.materialCode,
    temporal: r?.nationalityCode,
    relicId: r?.id,
    imageUrl: normalizeImg(r?.imgUri),
    thumbImage: normalizeImg(r?.imgThumUriM || r?.imgThumUriS || r?.imgThumUriL),
    ...r, // ⛔️ 여기서 다시 덮임
  };
}


/** 공공 데이터 포맷 보정: e뮤지엄(list) 우선 + 기타 포맷도 대응 */
function parseListPayload(data: any) {
  console.log("LIST raw data =>", data);

  // 성공 코드 판별 (e뮤지엄은 "0000")
  const code =
    data?.resultCode ??
    data?.result?.resultCode ??
    data?.response?.header?.resultCode ??
    data?.response?.body?.resultCode ??
    data?.body?.resultCode;

  const ok =
    code == null ||
    code === "0000" ||
    code === "00" ||
    code === "0" ||
    code === 0;
    

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

  // 아이템 원본 뽑기 (e뮤지엄: 최상위 list)
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

  const pageNo =
    Number(data?.pageNo ??
      data?.response?.body?.pageNo ??
      1);

  const numOfRows =
    Number(data?.numOfRows ??
      data?.response?.body?.numOfRows ??
      items.length);

  const totalCount =
    Number(data?.totalCount ??
      data?.response?.body?.totalCount ??
      items.length);

  return { items, pageNo, numOfRows, totalCount };
}

/** 목록 API */
export async function getRelicList(params: {
  pageNo?: number;
  numOfRows?: number;
  keyword?: string; // UI에선 keyword, 서버엔 name으로 전달
}) {
  const { data } = await api.get("/api/emuseum/relic/list", {
    params: {
      pageNo: params.pageNo ?? 1,
      numOfRows: params.numOfRows ?? 10,
      // ✅ 백엔드→e뮤지엄은 name 파라미터를 사용
      name: params.keyword?.trim() || undefined,
    },
  });

  return parseListPayload(data);
}

/** 상세 API (느슨 파싱) */
export async function getRelicDetail(id: string) {
  const { data } = await api.get("/api/emuseum/relic/detail", {
    params: { id }, // ✅ relicId 아님, id
  });

  console.log("DETAIL raw data =>", data);

  // 상세는 보통 객체 하나가 내려오므로 안전하게 추출
  const body = data?.result ?? data?.response?.body ?? data?.body ?? data;
  const candidate =
    body?.item ??
    (Array.isArray(body?.list) ? body?.list[0] : body?.list) ??
    body;
  const [itemRaw] = toArray(candidate);
  return mapRawToRelicItem(itemRaw || {});
}
