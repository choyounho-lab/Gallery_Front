import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Exhibition } from "../types/ApiType";
import { fetchKcisaItems } from "../api/kcisa";
import {
  classifyExhibitions,
  ClassifiedExhibitions,
} from "../utils/exhibitionUtils";
import ExhibitionCardList from "./exhibition/ExhibitionCardList";
import { themes, useSettings } from "../contexts/SettingsContext";
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

const ExhibitionPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [list, setList] = useState<Exhibition[]>([]);
  const [classified, setClassified] = useState<ClassifiedExhibitions | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const { theme } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const items = await fetchKcisaItems(1, 100);
        const c = classifyExhibitions(items);
        setClassified(c);

        // URL 파라미터에 맞는 리스트 선택
        if (type === "current") setList(c.current);
        else if (type === "upcoming") setList(c.upcoming);
        else if (type === "past") setList(c.past);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [type]);

  if (loading) return <div style={{ paddingTop: "80px" }}>Loading...</div>;

  const getTitle = () =>
    type === "current"
      ? "현재 전시"
      : type === "upcoming"
      ? "예정 전시"
      : "지난 전시";

  const handleTab = (tabType: "current" | "upcoming" | "past") => {
    navigate(`/exhibition/${tabType}`);
  };

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* 페이지 내 탭 버튼 */}
      <ButtonGroup>
        <TabButton
          active={type === "current"}
          onClick={() => handleTab("current")}
        >
          현재 전시
        </TabButton>
        <TabButton
          active={type === "upcoming"}
          onClick={() => handleTab("upcoming")}
        >
          예정 전시
        </TabButton>
        <TabButton active={type === "past"} onClick={() => handleTab("past")}>
          지난 전시
        </TabButton>
      </ButtonGroup>

      <h1>{getTitle()}</h1>
      <ExhibitionCardList list={list} />
    </div>
  );
};

export default ExhibitionPage;
