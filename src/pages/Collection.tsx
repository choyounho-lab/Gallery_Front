// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Collection = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const API_KEY = "744becef-9f7d-4b8a-b3e2-b271b67eb18a";

//   useEffect(() => {
//   axios.get("https://api.kcisa.kr/openapi/service/rest/meta/MPKreli", {
//   params: {
//     serviceKey: API_KEY,
//     numOfRows: 100,
//     pageNo: 1,
//     keyword: "",   // 빈 값이라도 반드시 넣기
//     resultType: "json", 
//   },
// })
//       .then((res) => {
//         console.log("API 원본 데이터:", res.data);

//         const items = res.data?.response?.body?.items?.item || [];

//         setData(items);
//       })
//       .catch((err) => {
//         console.error("API 호출 오류:", err);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <p>불러오는 중...</p>;

//   //  카테고리별 분류
//   const modernArt = data.filter((item) => item.CATEGORY === "현대미술");
//   const antiqueArt = data.filter((item) => item.CATEGORY === "고미술");

//   return (
//     <div>
//       <h1>🎨 e뮤지엄 소장품</h1>

//       <section>
//         <h2>🖼 현대미술</h2>
//         <ul>
//           {modernArt.map((item, i) => (
//             <li key={i}>
//               <h3>{item.TITLE}</h3>
//               {item.IMAGE_OBJECT && (
//                 <img src={item.IMAGE_OBJECT} alt={item.TITLE} width="200" />
//               )}
//             </li>
//           ))}
//         </ul>
//       </section>

//       <section>
//         <h2>🏺 고미술</h2>
//         <ul>
//           {antiqueArt.map((item, i) => (
//             <li key={i}>
//               <h3>{item.TITLE}</h3>
//               {item.IMAGE_OBJECT && (
//                 <img src={item.IMAGE_OBJECT} alt={item.TITLE} width="200" />
//               )}
//             </li>
//           ))}
//         </ul>
//       </section>
//     </div>
//   );
// };

// export default Collection;
import React, { useEffect, useState } from "react";
import axios from "axios";

type Item = {
  title: string;
  description?: string;
  temporal?: string;
  medium?: string;
  subDescription?: string;
  image?: string;  // 이미지 필드
};

type WithCategory = Item & { category: "현대미술" | "고미술" | "기타" };

const MODERN_PERIODS = ["현대", "근현대", "근대", "20세기", "21세기"];
const ANTIQUE_PERIODS = ["선사", "청동기", "철기", "삼국", "백제", "신라", "가야", "통일신라", "고려", "려말선초", "조선"];
const MODERN_MEDIUM_KEYWORDS = ["유화", "수채", "판화", "드로잉", "사진", "영상", "설치", "미디어", "아크릴", "현대"];
const ANTIQUE_MEDIUM_KEYWORDS = ["토기", "도자기", "청자", "백자", "분청", "옹기", "석기", "목기", "금속", "불상", "불교", "서예", "전적"];

function includesAny(target: string, keywords: string[]) {
  return keywords.some((k) => target.includes(k));
}

function classifyCategory(it: Item): "현대미술" | "고미술" | "기타" {
  const t = (it.temporal ?? "").trim();
  const m = ((it.medium ?? "") + " " + (it.subDescription ?? "")).trim();

  if (includesAny(t, MODERN_PERIODS)) return "현대미술";
  if (includesAny(t, ANTIQUE_PERIODS)) return "고미술";

  if (includesAny(m, MODERN_MEDIUM_KEYWORDS)) return "현대미술";
  if (includesAny(m, ANTIQUE_MEDIUM_KEYWORDS)) return "고미술";

  return "기타";
}

export default function Collection() {
  const [data, setData] = useState<WithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Item[]>("/api/relics", { params: { pageNo: 1, numOfRows: 20, keyword: "" } })
      .then((res) => {
        const mapped = (res.data || []).map((it) => ({
          ...it,
          category: classifyCategory(it),
        }));
        setData(mapped);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>불러오는 중…</p>;

  const modernArt = data.filter((d) => d.category === "현대미술");
  const antiqueArt = data.filter((d) => d.category === "고미술");

  const renderList = (items: WithCategory[]) => (
    <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", padding: 0 }}>
      {items.map((it, i) => (
        <li key={i} style={{ listStyle: "none", border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          {it.image && (
            <img
              src={it.image}
              alt={it.title}
              width="200"
              style={{ display: "block", marginBottom: 8, maxHeight: 160, objectFit: "cover" }}
              onError={(e) => ((e.currentTarget.style.display = "none"))}
            />
          )}
          <strong>{it.title}</strong>
          {it.temporal && <div>📅 {it.temporal}</div>}
          {it.medium && <div>🖌 {it.medium}</div>}
          {it.description && <p style={{ fontSize: 14, marginTop: 6 }}>{it.description}</p>}
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{ padding: 24 }}>
      <h1>🎨 소장품</h1>

      <section>
        <h2>🖼 현대미술 ({modernArt.length})</h2>
        {renderList(modernArt)}
      </section>

      <section>
        <h2>🏺 고미술 ({antiqueArt.length})</h2>
        {renderList(antiqueArt)}
      </section>
    </div>
  );
}
