import axios from "axios";
import { Exhibition, FeaturedExhibit } from "../types/ApiType";

const KCISA_BASE = "https://api.kcisa.kr/openapi/API_CCA_149/request";
const SERVICE_KEY = "532faf93-e042-4158-840f-dd052fcdac0a";

export async function fetchKcisaItems(
  pageNo = 1,
  numOfRows = 1,
  signal?: AbortSignal
): Promise<Exhibition[]> {
  const res = await axios.get(KCISA_BASE, {
    params: {
      serviceKey: SERVICE_KEY,
      pageNo,
      numOfRows,
      resultType: "json",
    },
    signal,
  });

  const items = res?.data?.response?.body?.items?.item;
  return Array.isArray(items) ? items : items ? [items] : [];
}

export function toFeaturedExhibit(x: Exhibition): FeaturedExhibit {
  return {
    id: Number(x.LOCAL_ID) || 0,
    title: x.TITLE,
    subTitle: x.CNTC_INSTT_NM || undefined,
    period: x.PERIOD || x.EVENT_PERIOD || undefined,
    heroImage: x.IMAGE_OBJECT || undefined,
    detailUrl: x.URL || "#",
  };
}
