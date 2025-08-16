  import "react-circular-progressbar/dist/styles.css";
  import "../assets/css/Event.css"
  import Logo from "../assets/image/logo.svg";
  import IUTest from "../assets/image/IUTest.jpg";
import { useState, useEffect } from "react";
import axios from 'axios'; // axios 라이브러리 사용을 위해 추가
import { Link } from "react-router-dom"; // 라우팅을 위해 Link 컴포넌트 사용
import { hostInstance } from "../api/hostInstance";

// 이벤트 및 경품 상세 정보를 위한 타입 정의
// EventPrizeDetailVO에 맞춰 필드를 정의합니다.
type EventPrizeDetailType = {
  eventId: number;
  eventCode: number;
  eventTitle: string;
  eventContent: string;
  eventCreateId: string;
  eventCreateDate: string; // LocalDateTime은 문자열로 받아 처리
  eventUpdateId?: string; // 선택적 필드
  eventUpdateDate?: string; // 선택적 필드
  eventStartDate: string; // LocalDateTime은 문자열로 받아 처리
  eventEndDate: string; // LocalDateTime은 문자열로 받아 처리
  prizeId?: number; // LEFT JOIN으로 인해 null일 수 있음
  prizeName?: string; // LEFT JOIN으로 인해 null일 수 있음
  quantity?: number; // LEFT JOIN으로 인해 null일 수 있음
  prizeDesc?: string; // LEFT JOIN으로 인해 null일 수 있음
};

// 검색 조건을 위한 타입 정의 (MyBatis SearchHelper에 해당)
type SearchParams = {
  page: number; // 여기서는 0-indexed 페이지 번호를 의미 (내부 계산용)
  size: number;
  searchCode?: number | string;
  searchType?: string;
  searchKeyword?: string;
  // currentOnly?: boolean; // 현재 진행 중인 이벤트 필터링 (필요시 주석 해제 후 사용)
  // searchStartDate?: string; // 기간 검색 시작일 (필요시 주석 해제 후 사용)
  // searchEndDate?: string; // 기간 검색 종료일 (필요시 주석 해제 후 사용)
};

export default function Event() {
  const [events, setEvents] = useState<EventPrizeDetailType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("all"); // 기본 검색 타입: 전체
  const [currentPage, setCurrentPage] = useState<number>(0); // 현재 페이지 (0부터 시작)
  const [totalPages, setTotalPages] = useState<number>(0); // 총 페이지 수 (백엔드에서 받아와야 함)
  const pageSize = 5; // 한 페이지당 보여줄 항목 수

 // 모달 표시 상태 및 모달 메시지 상태 추가
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  // API 호출 함수
  const fetchEvents = async (params: SearchParams) => {
    try {
      setLoading(true);
      setError(null);

      // 백엔드 MyBatis의 OFFSET #{page} ROWS에 전달할 정확한 오프셋을 계산
      const offset = params.page * params.size;

      const response = await hostInstance.get('event/eventList', {
        params: {
          page: offset, // <--- 수정된 부분: 계산된 오프셋 값을 'page' 파라미터로 전달
          size: params.size,
          ...(params.searchCode && { searchCode: params.searchCode }),
          ...(params.searchType && { searchType: params.searchType }),
          ...(params.searchKeyword && { searchKeyword: params.searchKeyword }),
        }
      });

      console.log("백엔드 API 응답:", response.data);

      if (response.data && Array.isArray(response.data.list)) {
        setEvents(response.data.list);
        if (typeof response.data.totalElements === 'number') {
          setTotalPages(Math.ceil(response.data.totalElements / pageSize));
        } else {
          setTotalPages(1);
          console.warn("백엔드 응답에 totalElements가 없거나 유효하지 않습니다.");
        }
      } else {
        setError("API 응답 형식이 예상과 다릅니다. 'list' 배열을 찾을 수 없습니다.");
        setEvents([]);
        setTotalPages(0);
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`API 호출 중 에러 발생: ${err.response ? JSON.stringify(err.response.data) : err.message}`);
        console.error("API 호출 중 에러 발생:", err.response ? err.response.data : err.message);
      } else {
        setError("알 수 없는 에러가 발생했습니다.");
        console.error("알 수 없는 에러:", err);
      }
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 초기 이벤트 목록 로드
  useEffect(() => {
    fetchEvents({ page: currentPage, size: pageSize });
  }, [currentPage]);

  // 검색 버튼 클릭 또는 Enter 키 입력 시 이벤트 검색
  const handleSearch = () => {
    // 검색어가 비어있는지 확인
    if (searchTerm.trim() === '') {
      setModalMessage("검색어를 입력하세요."); // 모달 메시지 설정
      setShowModal(true); // 모달 표시
      // 기존 데이터는 유지되므로 notices, totalPages, selectedNotice를 변경하지 않음
      return; // API 호출 중단
    }
    setModalMessage(null); // 검색어가 있으면 메시지 초기화
    setShowModal(false); // 모달 숨기기
    setCurrentPage(0); // 검색 시 첫 페이지로 리셋
    fetchEvents({ page: 0, size: pageSize, searchType, searchKeyword: searchTerm });
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').trim();
  };

  // 로딩, 에러 상태에 따른 조건부 렌더링
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">이벤트 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
        <p className="text-xl">에러 발생: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">이벤트</h1>

        {/* 검색 영역 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <select
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="title">이벤트 제목</option>
            <option value="content">이벤트 내용</option>
            <option value="prizeName">경품 이름</option>
          </select>
          <input
            type="text"
            placeholder="이벤트 검색 (예: 아이유, 콘서트, 경품 등)"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out"
          >
            검색
          </button>
        </div>

        {/* 이벤트 목록 */}
        <ul className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <li key={event.eventId} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200 ease-in-out overflow-hidden">
                <Link to={`/eventDetail/${event.eventId}`}
                // <Link to={`/eventDetail/${event.eventId}/${event.eventContent}/${event.eventTitle}/${event.eventCreateId}/${event.eventCreateDate}/${event.eventStartDate}/${event.eventEndDate}/${event.prizeName}/${event.quantity}/${event.prizeDesc}`} 
                className="block p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* 이미지 (Placeholder 사용) */}
                    <div className="flex-shrink-0 w-full sm:w-32 h-24 sm:h-24 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center text-gray-500 text-sm">
                      {/* 실제 이미지 URL이 있다면 여기에 img 태그 사용 */}
                      <img
                        src={`https://placehold.co/128x96/e0e0e0/333333?text=Event+${event.eventId}`}
                        alt={`이벤트 이미지 ${event.eventId}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/128x96/e0e0e0/333333?text=No123+Image'; }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{event.eventTitle}</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-2">
                        기간: {formatDate(event.eventStartDate)} ~ {formatDate(event.eventEndDate)}
                      </p>
                      {event.prizeName && (
                        <p className="text-sm sm:text-base text-gray-700">
                          경품: {event.prizeName} ({event.quantity}명)
                        </p>
                      )}
                      {!event.prizeName && (
                        <p className="text-sm sm:text-base text-gray-700">
                          경품: 없음
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 mt-4 sm:mt-0">
                      <button className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-200 ease-in-out">
                        참여하기
                      </button>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-center text-gray-700 text-lg">
                <span className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                </span>
                <p className="font-semibold">검색 결과가 없습니다.</p>
                <p className="text-sm text-gray-500 mt-2">다른 검색어로 다시 시도해주세요.</p>
            </div>          )}
        </ul>

        {/* 페이지네이션 (백엔드에서 totalPages를 받아와야 활성화 가능) */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

            {/* 모달/팝업 창 */}
      {showModal && modalMessage && (
        <div className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-50"> {/* bg-opacity-10 -> bg-opacity-20으로 변경 */}
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">알림</h3>
            <p className="text-gray-700 mb-6">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out"
            >
              확인
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
