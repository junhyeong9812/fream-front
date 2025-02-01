import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const Header: React.FC = () => {
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  // 날씨 & 접속자수 상태
  const [currentWeather, setCurrentWeather] = useState<WeatherDataDto | null>(
    null
  );
  const [todayAccessCount, setTodayAccessCount] = useState<number>(0);
  useEffect(() => {
    // 컴포넌트 마운트 시, 날씨 & 오늘 접속자 조회
    async function loadData() {
      const weather = await fetchCurrentWeather
      ();
      if (weather) {
        setCurrentWeather(weather);
      }

      const count = await fetchTodayAccessCount();
      setTodayAccessCount(count);
    }

    loadData();
  }, []);
  return (
    <>
      {/* 데스크탑 헤더 전체 영역 */}
      <div className="header-all-container">
        {/* 데스크탑 헤더 */}
        <header className="header-container">
        <div className="top-bar-info" 
               style={{ display: "flex", justifyContent: "space-between", padding: "0 40px" }}>
            {/* 서울 날씨 정보 */}
            <div>
              {currentWeather ? (
                <span style={{ marginRight: 16 }}>
                  현재 서울 날씨: {currentWeather.temperature.toFixed(1)}°C /
                  강수확률: {currentWeather.precipitationProbability}% /
                  강수량: {currentWeather.precipitation}mm
                </span>
              ) : (
                <span style={{ marginRight: 16 }}>
                  날씨 정보를 불러오는 중...
                </span>
              )}
            </div>
            {/* 오늘 접속자 */}
            <div>
              오늘 접속자: {todayAccessCount}명
            </div>
          </div>
          {/* ========================================= */}
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
                </Link>
              </li>
              <li>
                <Link to="/login">로그인</Link>
              </li>
            </ul>
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
        <NotificationModal closeModal={() => setNotificationModalOpen(false)} />
      )}
      {/* 검색 모달 */}
      {isSearchModalOpen && (
        <SearchModal closeModal={() => setSearchModalOpen(false)} />
      )}
    </>
  );
};

export default Header;
