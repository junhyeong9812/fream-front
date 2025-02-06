import React from "react";
import styled from "styled-components";
import { NavLink, Outlet } from "react-router-dom";

const StylePageContainer = styled.div`
  width: 1280px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.12px;
  padding: 16px 0;
  text-align: center;
`;

const StickyNavContainer = styled.div`
  position: sticky;
  top: var(--global-header-height);
  z-index: 3;
  background-color: white;
`;

const Tabs = styled.nav`
  border-bottom: 1px solid #f0f0f0;
  padding-left: 40px;
  padding-right: 40px;
`;

const TabList = styled.ul`
  display: flex;
  margin: 0;
  list-style: none;
  justify-content: flex-start;
`;

const TabItem = styled.li`
  &:first-child a {
    padding-left: 0;
    padding-right: 0;
  }

  &:not(:first-child) {
    margin-left: 24px;
  }
`;

const TabLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  padding: 15px 0 6px;
  font-size: 16px;
  line-height: 1.25;
  position: relative;
  text-decoration: none;
  color: #aaa;

  &.active {
    border-bottom: 2px solid #000;
    color: #000;
    font-weight: bold;
  }

  &:hover {
    color: #ef6253;
  }
`;

const TabName = styled.span`
  position: relative;

  &.updated::after {
    background-color: #ef6253;
    border-radius: 50%;
    content: "";
    height: 5px;
    position: absolute;
    right: -7px;
    top: 0;
    width: 5px;
  }
`;

const StylePage: React.FC = () => {
  const tabs = [
    { name: "KICKS", path: "/style/kicks", updated: false },
    { name: "팔로잉", path: "/style/following", updated: false },
    { name: "발견", path: "/style/explore", updated: false },
    { name: "랭킹", path: "/style/ranking", updated: true },
    { name: "트렌드", path: "/style/trend", updated: true },
    { name: "겨울 핫템", path: "/style/winter", updated: false },
    { name: "스니커즈", path: "/style/sneakers", updated: false },
    { name: "럭셔리", path: "/style/luxury", updated: false },
    { name: "의류", path: "/style/clothing", updated: false },
    { name: "가방", path: "/style/bags", updated: false },
    { name: "셀럽 스타일", path: "/style/celebrity", updated: false },
    { name: "컬렉터블", path: "/style/collectibles", updated: false },
    { name: "액세서리", path: "/style/accessories", updated: false },
  ];

  return (
    <StylePageContainer>
      <PageTitle>STYLE</PageTitle>
      <StickyNavContainer>
        <Tabs>
          <TabList>
            {tabs.map((tab) => (
              <TabItem key={tab.name}>
                <TabLink
                  to={tab.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <TabName className={tab.updated ? "updated" : ""}>
                    {tab.name}
                  </TabName>
                </TabLink>
              </TabItem>
            ))}
          </TabList>
        </Tabs>
      </StickyNavContainer>
      <Outlet /> {/* 하위 경로의 컴포넌트를 렌더링 */}
    </StylePageContainer>
  );
};

export default StylePage;
