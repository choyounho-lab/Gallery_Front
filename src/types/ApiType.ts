// - 공용 타입 정의 파일
// - KCISA 원본 타입(Exhibition)과 화면에서 사용하는 요약 타입(FeaturedExhibit) 분리

export interface FeaturedExhibit {
  id: number;
  title: string;
  subTitle?: string;
  period?: string;
  heroImage?: string;
  detailUrl?: string;
}

export interface Exhibition {
  TITLE: string;
  CNTC_INSTT_NM: string;
  COLLECTED_DATE: string;
  ISSUED_DATE: string;
  DESCRIPTION: string;
  IMAGE_OBJECT: string;
  LOCAL_ID: string;
  URL: string;
  GENRE: string;
  CONTACT_POINT: string;
  AUDIENCE: string;
  PERIOD: string;
  EVENT_PERIOD: string;
}
