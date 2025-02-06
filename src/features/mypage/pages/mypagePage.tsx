import React from "react";
import styled from "styled-components";
import MyHomePage from "./myHomePage";
import { Link, Outlet, useLocation } from "react-router-dom";

// 공통 스타일의 Link 컴포넌트
// const StyledLink = styled.a`
//   text-decoration: none;
//   color: inherit;
//   &:hover,
//   &:focus,
//   &:active {
//     text-decoration: none;
//   }
// `;
// 공통 스타일의 Link 컴포넌트
const StyledLink = styled(Link)<{ $isActive?: boolean }>`
  text-decoration: none;
  color: ${(props) => (props.$isActive ? "black" : "inherit")};
  font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};

  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
`;

// 컨테이너 스타일
const Container = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  max-width: 1280px;
  padding: 40px 40px 160px;
`;

// 사이드바 스타일
const Sidebar = styled.div`
  margin-right: 20px;
  width: 180px;
`;

// sub_List 스타일
const SubList = styled.div<{ marginTop?: boolean }>`
  margin-top: ${(props) => (props.marginTop ? "40px" : "0")};
`;

// 사이드바 타이틀 스타일
const SidebarTitle = styled.strong`
  display: inline-block;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.27px;
  line-height: 22px;
  margin-bottom: 12px;
  vertical-align: top;
`;

// h2 제목 스타일
const PageTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.15px;
  line-height: 29px;
  margin-bottom: 30px;
`;

// 리스트 컨테이너
const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

// 리스트 아이템 스타일
const ListItem = styled.li`
  margin-top: 12px;
  color: rgba(34, 34, 34, 0.5);
  font-size: 15px;
  letter-spacing: -0.15px;
  line-height: 18px;
`;

// 메인 콘텐츠 영역 스타일
const MainContent = styled.div`
  flex: 1;
`;

// Mypage 컴포넌트
const MypagePage: React.FC = () => {
  const location = useLocation();

  // 사이드바 메뉴 데이터
  const shoppingMenu = [
    { name: "구매 내역", href: "/my/purchase" },
    { name: "판매 내역", href: "/my/sales" },
    { name: "보관 판매", href: "/my/storage" },
    { name: "관심", href: "/my/favorites" },
  ];

  const infoMenu = [
    { name: "로그인 정보", href: "/my/login-info" },
    { name: "프로필 관리", href: "/my/profile" },
    { name: "주소록", href: "/my/address" },
    { name: "결제 정보", href: "/my/payment-info" },
    { name: "판매 정상 계좌", href: "/my/account" },
    { name: "현금영수증 정보", href: "/my/cash-receipt" },
  ];

  return (
    <Container>
      <Sidebar>
        <StyledLink to="/my">
          <PageTitle>마이 페이지</PageTitle>
        </StyledLink>
        {/* 쇼핑 정보 */}
        <SubList>
          <SidebarTitle>쇼핑 정보</SidebarTitle>
          <List>
            {shoppingMenu.map((item) => (
              <ListItem key={item.href}>
                <StyledLink
                  to={item.href}
                  $isActive={location.pathname === item.href}
                >
                  {item.name}
                </StyledLink>
              </ListItem>
            ))}
          </List>
        </SubList>

        {/* 내 정보 */}
        <SubList marginTop>
          <SidebarTitle>내 정보</SidebarTitle>
          <List>
            {infoMenu.map((item) => (
              <ListItem key={item.href}>
                <StyledLink
                  to={item.href}
                  $isActive={location.pathname === item.href}
                >
                  {item.name}
                </StyledLink>
              </ListItem>
            ))}
          </List>
        </SubList>
      </Sidebar>
      <MainContent>
        <Outlet />
      </MainContent>
    </Container>
  );
};

export default MypagePage;
