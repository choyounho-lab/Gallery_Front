import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { getRelicList, RelicItem, Category } from "../api/emuseum";

/** 화면 표시용 간단 분류(라벨만) */
function prettyCategory(it: RelicItem): string {
  const hay = [
    it.title, it.description, (it as any).nameKr, (it as any).name,
    (it as any).indexWord, it.medium, (it as any).materialCode, (it as any).purposeCode,
  ].filter(Boolean).join("").replace(/\s+/g, "");

  if (/(회화|그림|유화|수묵|채색|불화|동양화|서양화|판화|드로잉|스케치|초상|풍경화)/.test(hay)) return "회화(그림)";
  if (/(도자|도자기|자기|도기|토기|청자|백자|분청|옹기|항아리|사발|주전자|병|접시)/.test(hay)) return "도자기";
  if (/(서적|책|문서|고문서|간찰|필사본|판본|고서|경전|불경|사경|목판|인쇄)/.test(hay)) return "서적";
  return "기타";
}

const Collection: React.FC = () => {
  const [items, setItems] = useState<RelicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 검색어 입력(q)와 확정(keyword)
  const [q, setQ] = useState("");
  const [keyword, setKeyword] = useState<string | undefined>(undefined);

  // 카테고리(서버 재조회에 사용)
  const [category, setCategory] = useState<Category>("ALL");

  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / numOfRows)),
    [totalCount, numOfRows]
  );

  // 디바운스
  const debounceMs = 400;
  const timerRef = useRef<number | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQ(v);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const k = v.trim();
      setKeyword(k.length ? k : undefined);
      setPageNo(1);
    }, debounceMs);
  };
  const runSearch = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    const k = q.trim();
    setKeyword(k.length ? k : undefined);
    setPageNo(1);
  }, [q]);

  // 데이터 로드 (검색어/카테고리/페이지 바뀔 때)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { items, totalCount } = await getRelicList({
          pageNo,
          numOfRows,
          keyword,
          category,
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
    return () => { cancelled = true; };
  }, [pageNo, numOfRows, keyword, category]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-2">소장품 목록</h1>

      {/* 카테고리 탭 (클릭 시 서버 재조회) */}
      <div className="flex flex-wrap gap-2 mb-3">
        {[
          { key: "ALL", label: "전체" },
          { key: "PAINTING", label: "회화(그림)" },
          { key: "CERAMIC", label: "도자기" },
          { key: "BOOK", label: "서적" },
          { key: "ETC", label: "기타" },
        ].map((c) => {
          const active = category === (c.key as Category);
          return (
            <button
              key={c.key}
              onClick={() => { setCategory(c.key as Category); setPageNo(1); }}
              className={
                "px-3 py-1 rounded-full border text-sm " +
                (active ? "bg-black text-white border-black" : "bg-black text-white border-black")
              }
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="text-sm text-gray-600 mb-4">
        총 <b>{totalCount}</b>건 {keyword ? `(검색어: “${keyword}”)` : ""} · 현재 페이지 표시: <b>{items.length}</b>건
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
            {items.map((it, idx) => (
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
                    <div className="font-medium truncate">{it.title || "(제목 없음)"}</div>
                    <div className="text-xs text-gray-500 mb-1">카테고리: {prettyCategory(it)}</div>
                    <div className="text-sm text-gray-600">
                      {(it.temporal || "-")} · {(it.medium || "-")}
                    </div>
                    {it.description && (
                      <p className="mt-1 text-sm leading-relaxed line-clamp-3">{it.description}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {items.length === 0 && <li>결과가 없습니다.</li>}
          </ul>

          {/* 페이지네이션 */}
          <div className="flex items-center gap-2">
            <button
              className="border px-3 py-1 rounded disabled:opacity-50"
              onClick={() => setPageNo((p) => Math.max(1, p - 1))}
              disabled={pageNo <= 1}
            >
              이전
            </button>
            <span className="text-sm">{pageNo} / {totalPages}</span>
            <button
              className="border px-3 py-1 rounded disabled:opacity-50"
              onClick={() => setPageNo((p) => Math.min(totalPages, p + 1))}
              disabled={pageNo >= totalPages}
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Collection;
