// src/pages/exhibition/ExhibitionCardList.tsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { FeaturedExhibit, Exhibition } from "../../types/ApiType";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { themes, useSettings } from "../../contexts/SettingsContext";
import * as CS from "../../style/home/Card.styles";
import * as HS from "../../style/home/Hero.styles";

interface Props {
  list: Exhibition[];
  themeMode?: string;
}

const ExhibitionCardList: React.FC<Props> = ({
  list,
  themeMode = "default",
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [exhibit, setExhibit] = useState<FeaturedExhibit | null>(null);
  const { theme, fontSize } = useSettings();
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <CS.Grid>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <HS.CircleButton title="설정" onClick={toggleSidebar}>
        ✧
      </HS.CircleButton>

      {list.map((it) => (
        <CS.Card key={it.LOCAL_ID}>
          <CS.CardThumb $src={it.IMAGE_OBJECT} />
          <CS.CardBody>
            <CS.CardTitle $themeMode={themeMode}>{it.TITLE}</CS.CardTitle>
            <CS.CardMeta>
              {it.CNTC_INSTT_NM && <span>기관: {it.CNTC_INSTT_NM}</span>}
              {it.PERIOD && <span>기간: {it.PERIOD}</span>}
              {it.GENRE && <span>장르: {it.GENRE}</span>}
            </CS.CardMeta>
            <CS.CardLink
              href={it.URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              상세보기
            </CS.CardLink>
          </CS.CardBody>
        </CS.Card>
      ))}
    </CS.Grid>
  );
};

export default ExhibitionCardList;
