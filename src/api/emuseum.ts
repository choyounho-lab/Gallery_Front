// src/api/emuseum.ts
import axios from "axios";

/** 백엔드 주소 (배포/환경에 맞게 수정) */
const API_BASE = process.env.REACT_APP_API_BASE_URL ?? "http://localhost:8000";

/** axios 인스턴스 */
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

/** ----- 타입들 ----- */
export interface RelicItem {
  title: string;
  description?: string;
  medium?: string;
  temporal?: string;
  // 상세 응답에 있을 수도 있는 필드(기관마다 다름)
  relicId?: string;
  imageUrl?: string;
  thumbImage?: string;
}

/** 목록 응답 타입 (단건일 때 item이 객체로 내려올 수 있어 대비) */
export interface RelicListResponse {
  response: {
    header: { resultCode: string; resultMsg: string };
    body: {
      items: { item: RelicItem[] | RelicItem };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

/** 상세 응답 타입(기관별 스키마 차이가 있어 느슨하게) */
export interface RelicDetailResponse {
  response: {
    header: { resultCode: string; resultMsg: string };
    body: {
      items: { item: RelicItem | RelicItem[] } | RelicItem | RelicItem[];
      // 일부 API는 body.item 으로 내려오기도 함 → 안전하게 처리
    };
  };
}

/** 배열 정규화 헬퍼 */
function toArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

/** ----- API 함수들 ----- */
export async function getRelicList(params: {
  pageNo?: number;
  numOfRows?: number;
  keyword?: string;
  resultType?: "json" | "xml";
}) {
  const { data } = await api.get<RelicListResponse>("/api/emuseum/relic/list", {
    params: {
      pageNo: params.pageNo ?? 1,
      numOfRows: params.numOfRows ?? 10,
      resultType: params.resultType ?? "json",
      keyword: params.keyword,
    },
  });

  const body = data?.response?.body;
  const items = toArray(body?.items?.item);
  return {
    items,
    pageNo: body?.pageNo ?? 1,
    numOfRows: body?.numOfRows ?? items.length,
    totalCount: body?.totalCount ?? items.length,
  };
}

export async function getRelicDetail(relicId: string, resultType: "json" | "xml" = "json") {
  const { data } = await api.get<RelicDetailResponse>("/api/emuseum/relic/detail", {
    params: { relicId, resultType },
  });

  // 상세도 단일/배열 혼재 가능 → 정규화
  const maybeItems =
    (data?.response?.body as any)?.items?.item ??
    (data?.response?.body as any)?.item ??
    (data?.response?.body as any);

  const [item] = toArray<RelicItem>(maybeItems);
  return item;
}
