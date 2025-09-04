// src/pages/Collection.tsx
import React, { useEffect, useMemo, useState } from "react";
import { getRelicList, RelicItem } from "../api/emuseum";

const Collection: React.FC = () => {
  const [items, setItems] = useState<RelicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [keyword, setKeyword] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / numOfRows)),
    [totalCount, numOfRows]
  );

  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setLoading(true);
        const { items, totalCount } = await getRelicList({
          pageNo,
          numOfRows,
          keyword: keyword.trim() || undefined,
        });
        if (abort) return;
        setItems(items);
        setTotalCount(totalCount);
        setErr(null);
      } catch (e: any) {
        if (abort) return;
        setErr(e?.message ?? "요청 실패");
      } finally {
        if (!abort) setLoading(false);
      }
    })();

    return () => {
      abort = true;
    };
  }, [pageNo, numOfRows, keyword]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">소장품 목록</h1>

      {/* 검색 */}
      <div className="mb-4 flex gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="예: 호미, 장군, 씨송곳…"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={() => setPageNo(1)}
          className="border px-4 py-2 rounded"
          title="검색"
        >
          검색
        </button>
      </div>

      {loading && <div>불러오는 중…</div>}
      {err && <div className="text-red-600">오류: {err}</div>}

      {!loading && !err && (
        <>
          <ul className="space-y-2 mb-4">
            {items.map((it, idx) => (
              <li key={idx} className="border p-3 rounded">
                <div className="font-medium">{it.title || "(제목 없음)"}</div>
                <div className="text-sm text-gray-600">
                  {(it.temporal || "-")} · {(it.medium || "-")}
                </div>
                {it.description && (
                  <p className="mt-1 text-sm leading-relaxed">{it.description}</p>
                )}
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
        </>
      )}
    </div>
  );
};

export default Collection;
