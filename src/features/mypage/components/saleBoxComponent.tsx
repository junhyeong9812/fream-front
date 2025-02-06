import React from "react";
import styled from "styled-components";
import { SalesBoxProps } from "../types/mypageTypes";

// 여백 스타일
const Spacer = styled.div`
  height: 40px;
`;

// 판매내역 타이틀 컨테이너 스타일
const TitleContainer = styled.div`
  display: flex;
  max-width: 100%;
  padding-bottom: 16px;
`;

// 판매내역 타이틀 스타일
const Title = styled.h3`
  font-size: 18px;
  letter-spacing: -0.27px;
  margin: 0;
  font-weight: bold;
`;

// 판매내역 탭 컨테이너 스타일
const SalesListTab = styled.div`
  background-color: #fafafa;
  border-radius: 12px;
  display: flex;
  width: 100%;
`;

// 판매내역 탭 아이템 스타일
const TabItem = styled.div`
  display: flex;
  flex: 1;
  text-align: center;

  &:first-of-type .tab-link::before {
    content: "";
    background-color: #ebebeb;
    position: absolute;
    top: 18px;
    bottom: 18px;
    right: 0;
    width: 1px;
  }
`;

// 판매내역 링크 스타일
const TabLink = styled.a`
  display: block;
  flex: 1;
  padding: 14px 0;
  position: relative;
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
  }
`;

// 판매내역 텍스트 스타일 (dt)
const TabTitle = styled.dt`
  color: rgba(34, 34, 34, 0.8);
  font-size: 12px;

  @media (min-width: 961px) {
    font-size: 13px;
  }
`;

// 판매내역 숫자 스타일 (dd)
const TabCount = styled.dd<{ isTotal?: boolean }>`
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.09px;
  line-height: 20px;
  margin: 2px 0 0;
  color: ${({ isTotal }) => (isTotal ? "#46a049" : "rgba(34, 34, 34, 0.8)")};

  @media (min-width: 961px) {
    font-size: 18px;
  }
`;

const SalesBoxComponent: React.FC<SalesBoxProps> = ({ title, tabs }) => {
  return (
    <>
      <Spacer /> {/* 여백 */}
      <TitleContainer>
        <Title>{title}</Title> {/* 동적으로 타이틀 표시 */}
      </TitleContainer>
      <SalesListTab>
        {tabs.map((tab, index) => (
          <TabItem key={index} className={tab.isTotal ? "total" : ""}>
            <TabLink className="tab-link" href={tab.href}>
              <dl>
                <TabCount className="count" isTotal={tab.isTotal}>
                  <TabTitle className="title">{tab.title}</TabTitle>

                  {tab.count}
                </TabCount>
              </dl>
            </TabLink>
          </TabItem>
        ))}
      </SalesListTab>
    </>
  );
};

export default SalesBoxComponent;
