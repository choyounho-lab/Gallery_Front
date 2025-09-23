import axios from "axios";
import { Exhibition, FeaturedExhibit } from "../types/ApiType";

// 프록시 서버 주소
const PROXY_BASE = "http://localhost:4000/api/kcisa";

export async function fetchKcisaItems(
  pageNo = 1,
  numOfRows = 8
): Promise<Exhibition[]> {
  try {
    const res = await axios.get(PROXY_BASE, {
      params: { pageNo, numOfRows },
    });
    console.log("👉 KCISA raw response:", res.data);
    const items = res.data?.response?.body?.items?.item;
    return Array.isArray(items) ? items : items ? [items] : [];
  } catch (err) {
    console.error("KCISA API 에러:", err);
    return [];
  }
}

export function toFeaturedExhibit(x: Exhibition): FeaturedExhibit {
  return {
    id: Number(x.LOCAL_ID) || 0,
    title: x.TITLE,
    subTitle: x.CNTC_INSTT_NM || undefined,
    period: x.PERIOD || x.EVENT_PERIOD || undefined,
    heroImage:
      x.IMAGE_OBJECT || "https://via.placeholder.com/800x400?text=No+Image",
    detailUrl: x.URL || "#",
  };
}
