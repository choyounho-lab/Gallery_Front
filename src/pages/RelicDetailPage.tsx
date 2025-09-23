import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRelicDetail, RelicItem } from "../api/emuseum";

const Row: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) => {
  if (
    value == null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  )
    return null;
  return (
    <div className="grid grid-cols-3 gap-3 py-2 border-b last:border-b-0">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="col-span-2 text-sm break-words">{value}</div>
    </div>
  );
};

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
        setErr(null);
      } catch (e: any) {
        setErr(e?.message ?? "불러오기 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const chips = useMemo(() => {
    if (!item) return [];
    const arr = [
      item.temporal,
      item.medium,
      item.purposeName1,
      item.purposeName2,
      item.purposeName3,
      item.purposeName4,
      item.designationName1,
      item.designationName2,
    ].filter(Boolean) as string[];
    // 중복 제거
    return Array.from(new Set(arr));
  }, [item]);

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

      <h1 className="text-2xl font-bold mb-3">{item.title || "(제목 없음)"}</h1>

      {/* 태그/칩 */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {chips.map((c) => (
            <span key={c} className="px-2 py-1 text-xs rounded-full border">
              {c}
            </span>
          ))}
        </div>
      )}

      {(item.imageUrl || item.thumbImage) && (
        <img
          src={item.imageUrl || item.thumbImage}
          alt={item.title || "image"}
          className="w-full max-h-96 object-contain mb-4 rounded"
          loading="lazy"
        />
      )}

      {/* 요약 라인 */}
      <div className="text-sm text-gray-600 mb-4">
        {item.temporal || "-"} · {item.medium || "-"}
      </div>

      {/* 상세 설명 본문 */}
      {item.desc && (
        <p className="leading-relaxed mb-6 whitespace-pre-line">{item.desc}</p>
      )}

      {/* 정보 표(존재하는 값만 출력) */}
      <div className="border rounded-lg divide-y">
        <Row label="작가/제작" value={item.author} />
        <Row label="색인어" value={item.indexWord} />

        <Row
          label="국적/시대"
          value={[
            item.nationalityName1,
            item.nationalityName2,
            item.nationalityCode && `(${item.nationalityCode})`,
          ]
            .filter(Boolean)
            .join(" / ")}
        />

        <Row
          label="재질"
          value={[
            item.materialName1,
            item.materialName2,
            item.materialCode && `(${item.materialCode})`,
          ]
            .filter(Boolean)
            .join(" / ")}
        />

        <Row
          label="용도"
          value={[
            item.purposeName1,
            item.purposeName2,
            item.purposeName3,
            item.purposeName4,
            item.purposeCode && `(${item.purposeCode})`,
          ]
            .filter(Boolean)
            .join(" · ")}
        />

        <Row
          label="크기 범주"
          value={[
            item.sizeRangeName,
            item.sizeRangeCode && `(${item.sizeRangeCode})`,
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <Row label="크기 정보" value={item.sizeInfo} />

        <Row
          label="소재지"
          value={[
            item.placeLandName1,
            item.placeLandName2,
            item.placeLandCode && `(${item.placeLandCode})`,
          ]
            .filter(Boolean)
            .join(" / ")}
        />

        <Row
          label="지정"
          value={[
            item.designationName1,
            item.designationName2,
            item.designationInfo,
            item.designationCode && `(${item.designationCode})`,
          ]
            .filter(Boolean)
            .join(" / ")}
        />

        <Row
          label="소장처"
          value={[item.museumName1, item.museumName2, item.museumName3]
            .filter(Boolean)
            .join(" > ")}
        />

        <Row label="식별자" value={item.relicId} />
      </div>
    </div>
  );
};

export default RelicDetailPage;
