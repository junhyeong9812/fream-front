import React from "react";
import styled from "styled-components";
import { FiUser, FiShoppingBag, FiSmartphone, FiGift } from "react-icons/fi"; // 리액트 아이콘 가져오기
import { GoPeople } from "react-icons/go";
import { RiCoupon3Line } from "react-icons/ri";
import { TbHexagonLetterS } from "react-icons/tb";
import { TbCircleLetterP } from "react-icons/tb";

// 컨테이너 스타일
const ShortcutContainer = styled.div``;

// 그리드 스타일
const ShortcutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  padding: 24px;
  border: 1px solid #ebebeb;
  border-radius: 10px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    height: 132px; /* 명시적으로 높이를 설정 */
  }
`;

// 아이템 스타일
const ShortcutItem = styled.a`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// 아이콘 컨테이너
const IconWrap = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
`;

// 아이콘 스타일
const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px; /* 아이콘 크기를 24px로 설정 */
  height: 24px;
`;

// 배지 스타일
const Badge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 6px;
  background: #ef6253;
  border-radius: 50%;
  transform: translate(3px, -3px);
`;

// 이름 스타일
const ShortcutName = styled.p`
  font-size: 12px;
  letter-spacing: -0.06px;
  margin-top: 8px;
  text-align: center;
`;

const ShortcutGridComponent: React.FC = () => {
  const shortcuts = [
    {
      icon: <TbHexagonLetterS size={24} />,
      name: "판매자 등급",
      badge: false,
      url: "/seller-grade",
    },
    { icon: <TbCircleLetterP size={24} />, name: "0P", badge: false, url: "/points" },
    { icon: <RiCoupon3Line size={24} />, name: "쿠폰 30", badge: true, url: "/coupons" },
    {
      icon: <FiSmartphone size={24} />,
      name: "내 폰 시세",
      badge: false,
      url: "/phone-price",
    },
    {
      icon: <GoPeople size={24} />,
      name: "친구 초대",
      badge: false,
      url: "/invite-friends",
    },
    {
      icon: <FiShoppingBag size={24} />,
      name: "공지사항",
      badge: false,
      url: "/announcements",
    },
  ];

  return (
    <ShortcutContainer>
      <ShortcutGrid>
        {shortcuts.map((shortcut, index) => (
          <ShortcutItem key={index} href={shortcut.url}>
            <IconWrap>
              <Icon>{shortcut.icon}</Icon>
              {shortcut.badge && <Badge />}
            </IconWrap>
            <ShortcutName>{shortcut.name}</ShortcutName>
          </ShortcutItem>
        ))}
      </ShortcutGrid>
    </ShortcutContainer>
  );
};

export default ShortcutGridComponent;
