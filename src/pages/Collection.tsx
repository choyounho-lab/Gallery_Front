
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { getRelicList, RelicItem } from "../api/emuseum";

type Category = "all" | "painting" | "ceramics" | "book" | "other";

/** 카테고리 판별(제목/설명/원본필드 일부를 기반으로 가벼운 휴리스틱) */
function categorize(it: RelicItem): Category {
  const hay = [
    it.title,
    it.description,
    (it as any).nameKr,
    (it as any).name,
    (it as any).indexWord,
    it.medium,                 // materialCode 같은 게 들어올 수 있음
    (it as any).materialCode,
    (it as any).purposeCode,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, "");

  // 회화(그림)
  const isPainting =
    /(회화|그림|유화|수묵|채색|불화|동양화|서양화|판화|스케치|드로잉|탱화|벽화|초상|풍경화)/.test(hay);

  // 도자기
  const isCeramics =
    /(도자|도자기|자기|청자|백자|분청|토기|옹기|항아리|사발|주전자|주발|접시|병|찻잔|찻사발)/.test(hay) ||
    String((it as any).materialCode || "").startsWith("PS08002"); // 예시: 도자 계열 코드가 이런 형태라면

  // 서적
  const isBook =
    /(서적|책|문서|고문서|간찰|필사본|판본|고서|경전|불경|사경|목판|인쇄|금속활자|목활자)/.test(hay);

  if (isPainting) return "painting";
  if (isCeramics) return "ceramics";
  if (isBook) return "book";
  return "other";
}

const Collection: React.FC = () => {
  const [items, setItems] = useState<RelicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 검색어 입력(q)와 확정(keyword) 분리
  const [q, setQ] = useState("");
  const [keyword, setKeyword] = useState<string | undefined>(undefined);

  // 카테고리
  const [category, setCategory] = useState<Category>("all");

  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / numOfRows)),
    [totalCount, numOfRows]
  );

  // 디바운스 검색
  const debounceMs = 400;
  const timerRef = useRef<number | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQ(v);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const k = v.trim();
      setKeyword(k.length ? k : undefined);
    }, debounceMs);
  };
  const runSearch = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    const k = q.trim();
    setKeyword(k.length ? k : undefined);
  }, [q]);

  // 키워드/카테고리 변경 시 1페이지로
  useEffect(() => {
    setPageNo(1);
  }, [keyword, category]);

  // 데이터 로드
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { items, totalCount } = await getRelicList({
          pageNo,
          numOfRows,
          keyword, // 서버에는 name으로 매핑되어 전송됨
        });
        if (cancelled) return;
        setItems(items);
        setTotalCount(totalCount);
        setErr(null);
      } catch (e: any) {
        if (cancelled) return;
        setErr(e?.message ?? "요청 실패");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageNo, numOfRows, keyword]);

  // 화면 표시용(현재 페이지의 결과에만 카테고리 필터 적용)
  const viewItems = useMemo(() => {
    if (category === "all") return items;
    return items.filter((it) => categorize(it) === category);
  }, [items, category]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-2">소장품 목록</h1>

      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {[
          { key: "all", label: "전체" },
          { key: "painting", label: "회화(그림)" },
          { key: "ceramics", label: "도자기" },
          { key: "book", label: "서적" },
          { key: "other", label: "기타" },
        ].map((c) => {
          const active = category === (c.key as Category);
          return (
            <button
              key={c.key}
              onClick={() => setCategory(c.key as Category)}
              className={
                "px-3 py-1 rounded-full border text-sm " +
                (active
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-800 hover:bg-gray-100")
              }
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="text-sm text-gray-600 mb-4">
        총 <b>{totalCount}</b>건 {keyword ? `(검색어: “${keyword}”)` : ""} ·
        {" "}현재 페이지 표시: <b>{viewItems.length}</b>건
      </div>

      {/* 검색 */}
      <div className="mb-4 flex gap-2">
        <input
          value={q}
          onChange={onChange}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
          placeholder="소장품들을 검색해보세요."
          className="border px-3 py-2 rounded w-full"
        />
        <button onClick={runSearch} className="border px-4 py-2 rounded" title="검색">
          검색
        </button>
      </div>

      {loading && <div>불러오는 중…</div>}
      {err && <div className="text-red-600">오류: {err}</div>}

      {!loading && !err && (
        <>
          <ul className="space-y-3 mb-4">
            {viewItems.map((it, idx) => (
              <li key={idx} className="border rounded p-3">
                <div className="flex gap-3">
                  {(it.thumbImage || it.imageUrl) && (
                    <img
                      src={it.thumbImage || it.imageUrl}
                      alt={it.title || "image"}
                      className="w-20 h-20 object-cover rounded"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {it.title || "(제목 없음)"}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      카테고리: {categorize(it) === "painting"
                        ? "회화(그림)"
                        : categorize(it) === "ceramics"
                        ? "도자기"
                        : categorize(it) === "book"
                        ? "서적"
                        : "기타"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {(it.temporal || "-")} · {(it.medium || "-")}
                    </div>
                    {it.description && (
                      <p className="mt-1 text-sm leading-relaxed line-clamp-3">
                        {it.description}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {viewItems.length === 0 && <li>결과가 없습니다.</li>}
          </ul>

          {/* 페이지네이션 (서버 totalCount 기준) */}
          <div className="flex items-center gap-2">
            <button
              className="border px-3 py-1 rounded disabled:opacity-50"
              onClick={() => setPageNo((p) => Math.max(1, p - 1))}
              disabled={pageNo <= 1}
            >
              이전
            </button>
            <span className="text-sm">
              {pageNo} / {totalPages}
            </span>
            <button
              className="border px-3 py-1 rounded disabled:opacity-50"
              onClick={() => setPageNo((p) => Math.min(totalPages, p + 1))}
              disabled={pageNo >= totalPages}
            >
              다음
            </button>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            * 카테고리 필터는 현재 페이지에 표시된 항목에 적용됩니다.
          </p>
        </>
      )}
    </div>
  );
};

export default Collection;
