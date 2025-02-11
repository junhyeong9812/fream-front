import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiShoppingBag,
  FiHome,
  FiBookmark,
  FiUser,
} from "react-icons/fi";
import NotificationModal from "./headerModal/NotificationModal";
import SearchModal from "./headerModal/SearchModal";
import "./Header.css";
import { WeatherDataDto } from "src/global/types/weather";
import { fetchCurrentWeather } from "./services/weatherService";
import { fetchTodayAccessCount } from "./services/accessLogQueryService";
import { AuthContext } from "src/global/context/AuthContext";
import { logoutService } from "./services/logoutService";
import { useWebSocket } from "src/global/hooks/useNotificationWebSocket";

const Header: React.FC = () => {
  const { notifications, hasUnread, connect, disconnect, markAsRead } =
    useWebSocket();
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();
  // 날씨 & 접속자수 상태
  const [currentWeather, setCurrentWeather] = useState<WeatherDataDto | null>(
    null
  );
  const [todayAccessCount, setTodayAccessCount] = useState<number>(0);

  // (예시) 현재 날짜(YYYY-MM-DD) 표시용
  const [currentDateString, setCurrentDateString] = useState<string>("");
  useEffect(() => {
    if (isLoggedIn) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [isLoggedIn, connect, disconnect]);

  useEffect(() => {
    // 컴포넌트 마운트 시, 날씨 & 오늘 접속자 조회 + 날짜 세팅
    async function loadData() {
      const weather = await fetchCurrentWeather();
      if (weather) {
        setCurrentWeather(weather);
      }

      const count = await fetchTodayAccessCount();
      setTodayAccessCount(count);

      // 오늘 날짜 예: 2025-02-01
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      setCurrentDateString(`${year}-${month}-${day}`);
    }

    loadData();
  }, []);
  const handleLogout = async () => {
    try {
      // 1) 백엔드 /auth/logout 호출 -> 쿠키 무효화
      await logoutService();

      // 2) 로컬스토리지에서 "IsLoggedIn" 제거
      localStorage.removeItem("IsLoggedIn");

      // 3) AuthContext false로
      setIsLoggedIn(false);

      alert("로그아웃되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  return (
    <>
      {/* 데스크탑 헤더 전체 영역 */}
      <div className="header-all-container">
        {/* 데스크탑 헤더 */}
        <header className="header-container">
          {/* --- 상단 섹션: 날짜 / 오늘 접속자 VS top-nav --- */}
          <div className="header-top-section">
            <div className="left-info">
              <div className="date-info">오늘 날짜: {currentDateString}</div>
              <div className="visit-info">
                오늘 접속자: {todayAccessCount}명
              </div>
              {currentWeather && (
                <div className="weather-info">
                  (날씨) {currentWeather.temperature.toFixed(1)}°C / 강수확률:{" "}
                  {currentWeather.precipitationProbability}% / 강수량:{" "}
                  {currentWeather.precipitation}mm
                </div>
              )}
            </div>
            {/* top-nav 우측 정렬 */}
            <div className="top-nav">
              <ul>
                <li>
                  <Link to="/support/notice">고객센터</Link>
                </li>
                <li>
                  <Link to="/my">마이페이지</Link>
                </li>
                <li>
                  <Link to="/favorites">관심</Link>
                </li>
                <li>
                  <Link to="#" onClick={() => setNotificationModalOpen(true)}>
                    알림
                    {hasUnread && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </Link>
                </li>
                <li>
                  {isLoggedIn ? (
                    <button onClick={handleLogout}>로그아웃</button>
                  ) : (
                    <>
                      <Link to="/login">로그인</Link>
                    </>
                  )}
                </li>
              </ul>
            </div>
          </div>

          <div className="bottom-nav">
            <Link to="/">
              <img className="logo-image" src="/Fream.png" alt="KREAM Logo" />
            </Link>
            <nav className="nav">
              <ul>
                <li>
                  <Link to="/">HOME</Link>
                </li>
                <li>
                  <Link to="/style/explore">STYLE</Link>
                </li>
                <li>
                  <Link to="/shop">SHOP</Link>
                </li>
                <li>
                  <button
                    className="icon"
                    onClick={() => setSearchModalOpen(true)}
                  >
                    <FiSearch />
                  </button>
                </li>
                <li>
                  <button className="icon">
                    <FiShoppingBag />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </div>

      {/* 모바일 헤더 */}
      <header className="mobile-header-container">
        <Link to="/">
          <img
            className="mobile-logo-image"
            src="/Fream.png"
            alt="Mobile Logo"
          />
        </Link>
        <button className="icon" onClick={() => setNotificationModalOpen(true)}>
          <FiShoppingBag />
        </button>
      </header>

      {/* 모바일 하단 네비게이션 */}
      <nav className="mobile-nav">
        <ul>
          <li>
            <Link to="/">
              <FiHome />
              HOME
            </Link>
          </li>
          <li>
            <Link to="/style">
              <FiBookmark />
              STYLE
            </Link>
          </li>
          <li>
            <Link to="/shop">
              <FiSearch />
              SHOP
            </Link>
          </li>
          <li>
            <Link to="/saved">
              <FiBookmark />
              SAVED
            </Link>
          </li>
          <li>
            <Link to="/mypage">
              <FiUser />
              MY
            </Link>
          </li>
        </ul>
      </nav>

      {/* 알림 모달 */}
      {isNotificationModalOpen && (
        <NotificationModal
          closeModal={() => setNotificationModalOpen(false)}
          notifications={notifications}
          onNotificationClick={markAsRead}
        />
      )}
      {/* 검색 모달 */}
      {isSearchModalOpen && (
        <SearchModal closeModal={() => setSearchModalOpen(false)} />
      )}
    </>
  );
};

export default Header;
