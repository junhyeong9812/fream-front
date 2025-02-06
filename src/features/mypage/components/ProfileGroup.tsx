import React from "react";
import styled from "styled-components";
import Unit from "./Unit";

const GroupContainer = styled.div<{ paddingTop?: boolean }>`
  max-width: 480px;
  padding-top: ${(props) => (props.paddingTop ? "58px" : "38px")};
`;

const GroupTitle = styled.h4`
  font-size: 18px;
  letter-spacing: -0.27px;
  margin-bottom: 16px;
`;

interface ProfileGroupProps {
  title: string;
  units: { title: string; content: string; onModify: () => void }[];
  paddingTop?: boolean;
}

const ProfileGroup: React.FC<ProfileGroupProps> = ({
  title,
  units,
  paddingTop = false,
}) => {
  return (
    <GroupContainer paddingTop={paddingTop}>
      <GroupTitle>{title}</GroupTitle>
      {units.map((unit, index) => (
        <Unit
          key={index}
          title={unit.title}
          content={unit.content}
          onModify={unit.onModify}
        />
      ))}
    </GroupContainer>
  );
};

export default ProfileGroup;
