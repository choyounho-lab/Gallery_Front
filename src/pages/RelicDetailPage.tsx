import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRelicDetail, RelicItem } from "../api/emuseum";

const RelicDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<RelicItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const detail = await getRelicDetail(id);
        setItem(detail);
      } catch (e: any) {
        setErr(e?.message ?? "불러오기 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>불러오는 중…</div>;
  if (err) return <div className="text-red-600">{err}</div>;
  if (!item) return <div>데이터 없음</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 border rounded hover:bg-gray-100 text-sm"
      >
        ← 뒤로 가기
      </button>

      <h1 className="text-2xl font-bold mb-4">{item.title || "(제목 없음)"}</h1>
      {(item.imageUrl || item.thumbImage) && (
        <img
          src={item.imageUrl || item.thumbImage}
          alt={item.title || "image"}
          className="w-full max-h-96 object-contain mb-4"
        />
      )}
      <div className="text-sm text-gray-600 mb-2">
        {item.temporal || "-"} · {item.medium || "-"}
      </div>
      {item.description && (
        <p className="leading-relaxed">{item.description}</p>
      )}
    </div>
  );
};

export default RelicDetailPage;
