import React from "react";
import styled from "styled-components";

const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  margin-bottom: 10px;

  a {
    color: rgba(34, 34, 34, 0.5);
    font-size: 15px;
    letter-spacing: -0.15px;
    line-height: 18px;
    text-decoration: none;

    &:hover {
      color: #000;
    }
  }
`;

interface SubListProps {
  items: { name: string; link: string }[];
}

const SubList: React.FC<SubListProps> = ({ items }) => {
  return (
    <ListContainer>
      {items.map((item, index) => (
        <ListItem key={index}>
          <a href={item.link}>{item.name}</a>
        </ListItem>
      ))}
    </ListContainer>
  );
};

export default SubList;
