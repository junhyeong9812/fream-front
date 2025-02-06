import React from "react";
import styled from "styled-components";
import { FiX } from "react-icons/fi";
import ConfirmUnblockModal from "./ConfirmUnblockModal";

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(34, 34, 34, 0.5);
  z-index: 1010;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  width: 448px;
  position: relative;
`;

const CloseButton = styled(FiX)`
  position: absolute;
  right: 20px;
  top: 14px;
  cursor: pointer;
  width: 24px;
  height: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  margin-top: 24px;
`;
const ContentContainer = styled.div`
  height: 446px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-left: 32px;
  padding-right: 32px;
`;

const BlockedList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
`;

const BlockedItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ebebeb;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-right: 12px;
`;

const ProfileName = styled.span`
  font-size: 16px;
  font-weight: 600;
`;
const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Subtitle = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2px;
`;

const UserSubName = styled.span`
  color: rgba(34, 34, 34, 0.5);
  font-size: 12px;
  letter-spacing: -0.06px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  max-width: 300px;
`;

const UnblockButton = styled.button`
  background: #222;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #444;
  }
`;

interface BlockedProfilesModalProps {
  profiles: {
    id: number;
    profileName: string;
    realName: string;
    imageUrl: string;
  }[];
  onClose: () => void;
  onUnblock: (id: number) => void;
}

const BlockedProfilesModal: React.FC<BlockedProfilesModalProps> = ({
  profiles,
  onClose,
  onUnblock,
}) => {
  const [selectedProfile, setSelectedProfile] = React.useState<{
    id: number;
    realName: string;
  } | null>(null);

  const handleUnblockClick = (id: number, realName: string) => {
    setSelectedProfile({ id, realName });
  };

  const closeConfirmModal = () => setSelectedProfile(null);
  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={onClose} />
          <ModalTitle>차단한 프로필</ModalTitle>
          <ContentContainer>
            <BlockedList>
              {profiles.map((profile) => (
                <BlockedItem key={profile.id}>
                  <ProfileInfo>
                    <ProfileImage src={profile.imageUrl} alt="프로필 이미지" />
                    <InfoBox>
                      <ProfileName>{profile.profileName}</ProfileName>
                      <Subtitle>
                        <UserSubName>{profile.realName}</UserSubName>
                      </Subtitle>
                    </InfoBox>
                  </ProfileInfo>
                  <UnblockButton
                    onClick={() =>
                      handleUnblockClick(profile.id, profile.realName)
                    }
                  >
                    차단 해제
                  </UnblockButton>
                </BlockedItem>
              ))}
            </BlockedList>
          </ContentContainer>
        </ModalContent>
      </ModalOverlay>
      {selectedProfile && (
        <ConfirmUnblockModal
          realName={selectedProfile.realName}
          onConfirm={() => {
            onUnblock(selectedProfile.id);
            closeConfirmModal();
          }}
          onCancel={closeConfirmModal}
        />
      )}
    </>
  );
};

export default BlockedProfilesModal;
