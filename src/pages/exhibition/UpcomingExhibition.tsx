// src/pages/exhibition/CurrentExhibition.tsx
import React, { useEffect, useState } from "react";
import { Exhibition } from "../../types/ApiType";
import { fetchKcisaItems } from "../../api/kcisa";
import ExhibitionCardList from "./ExhibitionCardList";
import { classifyExhibitions } from "../../utils/exhibitionUtils";

const UpcomingExhibition: React.FC = () => {
  const [exhibits, setExhibits] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const list = await fetchKcisaItems(1, 50);
      const classified = classifyExhibitions(list);

      // ✅ 예정 전시만 가져오기
      setExhibits(classified.upcoming);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <ExhibitionCardList list={exhibits} />;
};

export default UpcomingExhibition;
