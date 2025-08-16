// src/pages/EventDetail.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/EventDetail.css";
import { Link } from "react-router-dom"; // 라우팅을 위해 Link 컴포넌트 사용
import { hostInstance } from "../api/hostInstance";

type EventDetailResponse = {
  eventId: number;
  eventTitle: string;
  eventContent: string;
  eventCreateId: string;
  eventCreateDate: string;
  eventStartDate: string;
  eventEndDate: string;
  prizeName?: string;     // 가격
  quantity?: number;      // 수량
  prizeDesc?: string;     // 가격 상세 설명
};

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const [eventDetail, setEventDetail] = useState<EventDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await hostInstance.get(`event/eventDetail/${eventId}`);
        setEventDetail(response.data);
      } catch (err) {
        setError("이벤트 상세 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const pad = (n: number) => n.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    return `${year}.${month}.${day}`;
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!eventDetail) return <p>이벤트 정보를 찾을 수 없습니다.</p>;


const handleButtonClick = async () => {
  try {
    // 백엔드 API 호출: userId와 eventId를 함께 전달
    const response = await axios.post(`http://localhost:8080/api/event/apply`, {/*userId */});

    if (response.status === 200) {
      console.log("신청 성공");
      // 신청 성공 후 페이지 이동
      // history.push(`/eventList`);
    } else {
      console.error("신청 실패");
    }
  } catch (error) {
    console.error("에러 발생", error);
  }
};


  return (
    <div className="event-detail-page">
  <div className="event-title">{eventDetail.eventTitle}</div>

  <div className="event-meta">
    등록자 : {eventDetail.eventCreateId} / 등록일 : {formatDate(eventDetail.eventCreateDate)}
  </div>

  <div className="event-body">
    <div className="poster">
      <img src={`https://placehold.co/300x400/e0e0e0/333333?text=Event+${eventDetail.eventId}`} />
    </div>

    <div className="event-info">
      <div className="info-row"><span className="label">이벤트 기간 : </span><span className="value">{formatDate(eventDetail.eventStartDate)} ~ {formatDate(eventDetail.eventEndDate)}</span></div>
      {/* <div className="info-row"><span className="label">공연시간 : </span><span className="value"></span></div> */}
      <div className="info-row"><span className="label">경품 : </span><span className="value">{eventDetail.prizeName || "없음"}</span></div>
      <div className="info-row"><span className="label">경품 설명 : </span><span className="value">{eventDetail.prizeDesc || "없음"}</span></div>
    </div>
  </div>

  <div className="event-footer">
    <h3>이벤트 내용</h3>
    <p style={{ whiteSpace: "pre-line" }}>{eventDetail.eventContent}</p>
    <hr />
    <p>본 상품은 일반배송 상품으로 2025년 8월 27일부터 순차 배송됩니다.</p>
  </div>
  <div className="apply">
    <button onClick={() => handleButtonClick(/*userId */)} className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-200 ease-in-out">
      신청하기
    </button>
  </div>
</div>

  );
}