import React, { useEffect, useState } from "react";
import { Exhibition } from "../types/ApiType";
import { fetchKcisaItems } from "../api/kcisa";
import {
  classifyExhibitions,
  ClassifiedExhibitions,
} from "../utils/exhibitionUtils";
import ExhibitionCardList from "./exhibition/ExhibitionCardList";
import styled from "styled-components";

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const TabButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: ${({ active }) => (active ? "#222" : "#555")};
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;

  &:hover {
    background: #333;
  }
`;

const ExhibitionTabs: React.FC = () => {
  const [list, setList] = useState<Exhibition[]>([]);
  const [classified, setClassified] = useState<ClassifiedExhibitions | null>(
    null
  );
  const [tab, setTab] = useState<"current" | "upcoming" | "past">("current");

  useEffect(() => {
    (async () => {
      const items = await fetchKcisaItems(1, 100);
      const c = classifyExhibitions(items);
      setClassified(c);
      setList(c.current); // 초기 탭은 현재 전시
    })();
  }, []);

  const handleTab = (type: "current" | "upcoming" | "past") => {
    if (!classified) return;
    setTab(type);
    setList(classified[type]);
  };

  return (
    <div style={{ paddingTop: "80px" }}>
      <ButtonGroup>
        <TabButton
          active={tab === "current"}
          onClick={() => handleTab("current")}
        >
          현재 전시
        </TabButton>
        <TabButton
          active={tab === "upcoming"}
          onClick={() => handleTab("upcoming")}
        >
          예정 전시
        </TabButton>
        <TabButton active={tab === "past"} onClick={() => handleTab("past")}>
          지난 전시
        </TabButton>
      </ButtonGroup>

      <ExhibitionCardList list={list} />
    </div>
  );
};

export default ExhibitionTabs;
