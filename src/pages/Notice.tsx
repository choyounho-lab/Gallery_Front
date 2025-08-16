import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom'; // ReactDOM 임포트 추가 (모달 포털을 위해 필요)
import { hostInstance } from "../api/hostInstance";

// 🔸 공지사항 타입 정의
type NoticeType = {
  noticeId: number;
  noticeCodeId: number;
  noticeTitle: string;
  noticeContent: string;
  noticeCreateId: string;
  noticeCreateDate: string; // LocalDateTime은 문자열로 받아 처리
  noticeUpdateId?: string; // 선택적 필드
  noticeUpdateDate?: string; // 선택적 필드
};

// 검색 조건을 위한 타입 정의 (MyBatis SearchHelper에 해당)
type SearchParams = {
  page: number;
  size: number;
  searchCode?: number | string;
  searchType?: string;
  searchKeyword?: string;
};

export default function Notice() {
  const [notices, setNotices] = useState<NoticeType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<NoticeType | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const pageSize = 5;

  // 모달 표시 상태 및 모달 메시지 상태 추가
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  // API 호출 함수
  const fetchNotices = async (params: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      // API 호출 시작 시 모달 메시지 및 모달 표시 상태 초기화
      setModalMessage(null);
      setShowModal(false);

      const offset = params.page * params.size;

      const response = await hostInstance.get('notice/noticeList', {
        params: {
          page: offset,
          size: params.size,
          ...(params.searchCode && { searchCode: params.searchCode }),
          ...(params.searchType && { searchType: params.searchType }),
          ...(params.searchKeyword && { searchKeyword: params.searchKeyword }),
        }
      });

      console.log("백엔드 API 응답:", response.data);

      if (response.data && Array.isArray(response.data.list)) {
        setNotices(response.data.list);
        if (typeof response.data.totalElements === 'number') {
          setTotalPages(Math.ceil(response.data.totalElements / pageSize));
        } else {
          setTotalPages(1);
          console.warn("백엔드 응답에 totalElements가 없거나 유효하지 않습니다.");
        }
      } else {
        setError("API 응답 형식이 예상과 다릅니다. 'list' 배열을 찾을 수 없습니다.");
        setNotices([]);
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

  // 컴포넌트 마운트 시 초기 공지 목록 로드 및 currentPage 변경 시 재로드
  // searchTerm과 searchType을 의존성 배열에서 제거하여 자동 검색을 방지합니다.
  useEffect(() => {
    fetchNotices({ page: currentPage, size: pageSize, searchType: "all", searchKeyword: "" }); // 초기 로드 시 전체 목록을 가져오도록 설정
  }, [currentPage]); // currentPage가 변경될 때만 재로드

  // 검색 버튼 클릭 또는 Enter 키 입력 시 공지 검색
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
    // 검색 버튼 클릭 시에만 fetchNotices를 명시적으로 호출합니다.
    fetchNotices({ page: 0, size: pageSize, searchType, searchKeyword: searchTerm });
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

  // 로딩, 에러 상태에 따른 조건부 렌더링 확인
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">로딩 중...</p>
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

  // 모달 컴포넌트 정의 (Event 컴포넌트 내부 또는 외부에서 정의 가능)
  const Modal = ({ message, onClose }: { message: string; onClose: () => void }) => {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      console.error("Modal root element not found! Please ensure <div id='modal-root'> exists in index.html");
      return null;
    }

    return ReactDOM.createPortal(
      <div className="fixed inset-0 bg-gray-600 bg-opacity-20 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">알림</h3>
          <p className="text-gray-700 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out"
          >
            확인
          </button>
        </div>
      </div>,
      modalRoot // 이 DOM 노드에 모달을 렌더링합니다.
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">공지사항</h1>

        {/* 검색 영역 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <select
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <input
            type="text"
            placeholder="공지사항 검색 (예: 업데이트, 점검 등)"
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

        {/* 공지 목록 */}
        <div className="space-y-4">
          {notices.length > 0 ? (
            notices.map((notice) => (
              <div key={notice.noticeId} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200 ease-in-out overflow-hidden">
                <div
                  className="flex justify-between items-center p-4 sm:p-6 cursor-pointer"
                  onClick={() => {
                    setSelectedNotice(
                      selectedNotice?.noticeId === notice.noticeId ? null : notice
                    );
                  }}
                >
                  <div className="text-sm sm:text-base text-gray-600 flex-shrink-0 mr-8">{notice.noticeId}</div>
                  <div className="text-lg sm:text-xl font-semibold text-gray-900 flex-grow">{notice.noticeTitle}</div>
                  <div className="text-sm sm:text-base text-gray-600 flex-shrink-0">{formatDate(notice.noticeCreateDate)}</div>
                </div>

                {/* 선택된 공지일 경우 바로 아래에 상세 내용 출력 */}
                {selectedNotice?.noticeId === notice.noticeId && (
                  <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
                    <div>
                      <div className="text-sm sm:text-base text-gray-600 mb-2">
                        <span>등록일: {formatDate(selectedNotice.noticeCreateDate)}</span>
                      </div>
                      <div className="text-gray-800 leading-relaxed mb-4">{selectedNotice.noticeContent}</div>
                      <Link to="/new" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        메인으로 돌아가기
                      </Link>
                    </div>
                  </div>
                )}
              </div>
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
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
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

      {/* 모달/팝업 창은 이제 Portal을 통해 렌더링됩니다. */}
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

