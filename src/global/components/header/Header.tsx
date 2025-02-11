import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
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
  // WebSocket 훅
  const { notifications, hasUnread, connect, disconnect, markAsRead } =
    useWebSocket();

  // 모달 상태
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  // 인증 컨텍스트
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // 데이터 상태
  const [currentWeather, setCurrentWeather] = useState<WeatherDataDto | null>(
    null
  );
  const [todayAccessCount, setTodayAccessCount] = useState<number>(0);
  const [currentDateString, setCurrentDateString] = useState<string>("");

  // 컴포넌트 마운트 상태 추적
  const isMounted = useRef(true);

  // WebSocket 연결 관리
  useEffect(() => {
    let isSubscribed = true;

    const handleWebSocketConnection = async () => {
      if (isLoggedIn && isSubscribed) {
        try {
          await connect();
        } catch (error) {
          console.error("WebSocket 연결 실패:", error);
        }
      }
    };

    handleWebSocketConnection();

    return () => {
      isSubscribed = false;
      disconnect();
    };
  }, [isLoggedIn]);

  // 날씨와 접속자 수 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      if (!isMounted.current) return;

      try {
        const [weather, count] = await Promise.all([
          fetchCurrentWeather(),
          fetchTodayAccessCount(),
        ]);

        if (!isMounted.current) return;

        if (weather) {
          setCurrentWeather(weather);
        }
        setTodayAccessCount(count);

        // 날짜 설정
        const now = new Date();
        const formattedDate = [
          now.getFullYear(),
          String(now.getMonth() + 1).padStart(2, "0"),
          String(now.getDate()).padStart(2, "0"),
        ].join("-");

        setCurrentDateString(formattedDate);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    loadData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // 모달 토글 핸들러
  const toggleNotificationModal = useCallback(() => {
    setNotificationModalOpen((prev) => !prev);
  }, []);

  const toggleSearchModal = useCallback(() => {
    setSearchModalOpen((prev) => !prev);
  }, []);

  // 로그아웃 핸들러
  const handleLogout = useCallback(async () => {
    try {
      disconnect(); // WebSocket 연결 먼저 해제
      await logoutService();
      localStorage.removeItem("IsLoggedIn");
      setIsLoggedIn(false);
      alert("로그아웃되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      alert("로그아웃 처리 중 오류가 발생했습니다.");
    }
  }, [disconnect, setIsLoggedIn, navigate]);

  return (
    <>
      {/* 데스크탑 헤더 전체 영역 */}
      <div className="header-all-container">
        <header className="header-container">
          {/* 상단 섹션: 날짜 / 오늘 접속자 VS top-nav */}
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
                    <Link to="/login">로그인</Link>
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
                  <button className="icon" onClick={toggleSearchModal}>
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
        <button className="icon" onClick={toggleNotificationModal}>
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

      {/* 모달 */}
      {isNotificationModalOpen && (
        <NotificationModal
          closeModal={() => setNotificationModalOpen(false)}
          notifications={notifications}
          onNotificationClick={markAsRead}
        />
      )}
      {isSearchModalOpen && (
        <SearchModal closeModal={() => setSearchModalOpen(false)} />
      )}
    </>
  );
};

export default Header;
