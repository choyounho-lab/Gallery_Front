import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import TopBar from "./components/TopBar";
import Sidebar from "./components/SideBar";

import Home from "./components/Home/Home";

import SearchGenreTrack from "./pages/SearchGenreTrack";
import AlbumDetail from "./pages/AlbumDetail";
import GenreList from "./pages/GenreList";
import GenreListDetail from "./pages/GenreListDetail";
import SearchResult from "./pages/SearchResult";
import ApiGetPlayListSample from "./pages/apiSample/ApiGetPlayListSample";
// import TrackDetail from "./pages/TrackDetail";
import Event from "./pages/Event";
import Notice from "./pages/Notice";
import ArtistDetail from "./pages/ArtistDetail";
import { useSelector } from "react-redux";
import { selectUserInfo } from "./store/userInfo";
import { FaSpinner } from "react-icons/fa";
import { useDispatch } from "react-redux";
import YouTubePlayer from "./pages/player/YouTubePlayer";
import { PlayerProvider } from "./pages/player/PlayerContext";
import { setUserInfo } from "./store/userInfo"; // 너가 만든 리덕스 슬라이스
// App.tsx 또는 Router 파일 상단에 추가:

//카카오 페이 결제 서비스 조윤호
import PaySuccess from "./pages/pay/PaySuccess";
import PayFail from "./pages/pay/PayFail";
import PayCancel from "./pages/pay/PayCancel";

import Login from "./pages/Login";
import PlaylistTrack from "./pages/PlaylistTrack";
import EventDetail from "./pages/EventDetail";
import { selectDisplayMode } from "./store/displayMode";

const NotFound = () => (
  <div className="p-4 text-red-500">404 - 페이지를 찾을 수 없습니다.</div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <FaSpinner className="animate-spin text-blue-500 text-3xl" />
    <span className="ml-2 text-gray-700">로딩 중...</span>
  </div>
);

const routeList = [
  {
    path: "/",
    element: (isDarkMode: boolean) => <Home isDarkMode={isDarkMode} />,
  },
  { path: "/login", element: () => <Login /> },
  { path: "/list", element: () => <SearchGenreTrack /> },
  { path: "/albumDetail", element: () => <AlbumDetail /> },
  { path: "/genreList", element: () => <GenreList /> },
  { path: "/genreListDetail/:genre", element: () => <GenreListDetail /> },
  { path: "/search/:search", element: () => <SearchResult /> },
  { path: "/event", element: () => <Event /> },
  { path: "/eventDetail/:eventId", element: () => <EventDetail /> },
  { path: "/notice", element: () => <Notice /> },
  { path: "/test", element: () => <ApiGetPlayListSample /> },
  // { path: "/trackDetail", element: () => <TrackDetail /> },
  { path: "/artistDetail", element: () => <ArtistDetail /> },

  { path: "/playlist/:playlistId", element: () => <PlaylistTrack /> },
  //카카오 페이 결제 서비스 조윤호
  { path: "/pay/success", element: () => <PaySuccess /> },
  { path: "/pay/fail", element: () => <PayFail /> },
  { path: "/pay/cancel", element: () => <PayCancel /> },
];

const App = () => {
  const darkMode = useSelector(selectDisplayMode);
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // 로딩 시뮬레이션
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 페이지 전환 시 스크롤 맨 위로
    window.scrollTo(0, 0);
  }, [location]);

  // Tailwind 'dark:' 동작 위해 html에 클래스 설정
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${
        darkMode ? "dark bg-black text-white" : "bg-white text-gray-900"
      } min-h-screen`}
    >
      <YouTubePlayer />
      <Sidebar />
      <div className="ml-70 transition-opacity duration-300 ease-in-out max-sm:hidden">
        <TopBar />
        <div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Routes>
              {routeList.map(({ path, element }, index) => (
                <Route key={index} path={path} element={element(darkMode)} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
