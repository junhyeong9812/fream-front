import React from "react";
import styled from "styled-components";
import SubTitle from "./SubList";
import SubList from "./SubTitle";

const NavContainer = styled.nav`
  float: left;
  margin-right: 40px;
  width: 160px;
`;

const SubNav: React.FC = () => {
  const subItems = [
    { name: "공지사항", link: "/support/notice" },
    { name: "자주 묻는 질문", link: "/support/faq" },
    { name: "검수 기준", link: "/support/inspection" },
  ];

  return (
    <NavContainer>
      <SubTitle title="고객센터" />
      <SubList items={subItems} />
    </NavContainer>
  );
};

export default SubNav;
