import { Exhibition } from "../types/ApiType";

export interface ClassifiedExhibitions {
  current: Exhibition[];
  upcoming: Exhibition[];
  past: Exhibition[];
}

export const classifyExhibitions = (
  list: Exhibition[]
): ClassifiedExhibitions => {
  const current: Exhibition[] = [];
  const upcoming: Exhibition[] = [];
  const past: Exhibition[] = [];

  const now = new Date();

  list.forEach((ex) => {
    if (!ex.PERIOD) return;

    // (금) 같은 요일 제거 후 날짜 파싱
    const [startStr, endStr] = ex.PERIOD.split("~").map((s) =>
      s.replace(/\([^)]+\)/g, "").trim()
    );

    const start = new Date(startStr);
    const end = new Date(endStr);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    // 현재 전시 기준: 오늘 포함
    if (now >= start && now <= end) current.push(ex);
    else if (now < start) upcoming.push(ex);
    else if (now > end) past.push(ex);
  });

  return { current, upcoming, past };
};
