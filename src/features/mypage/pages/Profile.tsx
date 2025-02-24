import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BlockedProfilesModal from "../components/BlockedProfilesModal";
import { ProfileInfoDto, BlockedProfileDto } from "../types/profile";
import {
  getBlockedProfiles,
  getProfileInfo,
  unblockProfile,
  updateProfile,
} from "../services/ProfileService";
// 페이지 컨테이너
const PageContainer = styled.div`
  padding: 0 20px;
`;

// 페이지 헤더
const PageHeader = styled.div`
  display: flex;
  border-bottom: 3px solid #222;
  padding-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 24px;
  line-height: 29px;
  letter-spacing: -0.36px;
  margin: 0;
`;

// 사용자 프로필 섹션
const UserProfile = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 38px 0;
  border-bottom: 1px solid #ebebeb;
`;

const ProfileThumb = styled.div`
  flex: none;
  border-radius: 100%;
  overflow: hidden;
  height: 80px;
  width: 80px;
  margin-right: 12px;

  @media (min-width: 768px) {
    height: 90px;
    width: 90px;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileDetail = styled.div`
  flex: 1;
`;

const UserName = styled.strong`
  color: #000;
  font-size: 18px;
  letter-spacing: -0.27px;
  line-height: 1.222;
`;

const ButtonBox = styled.div`
  margin-top: 12px;
  font-size: 0;

  .btn + .btn {
    margin-left: 8px;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  color: rgba(34, 34, 34, 0.8);
  cursor: pointer;
  text-align: center;
  font-size: 12px;
  height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  vertical-align: middle;

  &:hover {
    background-color: #f5f5f5;
  }
`;

// 프로필 정보 섹션
const ProfileInfoContainer = styled.div`
  max-width: 480px;
  padding-top: 38px;
`;

const ProfileGroup = styled.div`
  padding-top: 48px;

  &:first-of-type {
    padding-top: 0;
  }
`;

const GroupTitle = styled.h4`
  font-size: 18px;
  letter-spacing: -0.27px;
  margin: 0;
`;

const ProfileUnit = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ebebeb;
  padding: 25px 0 12px;
  position: relative;
`;

const TitleLabel = styled.h5`
  color: rgba(34, 34, 34, 0.5);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: -0.07px;
  margin: 0;
`;

const UnitContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Description = styled.p<{ isPlaceholder?: boolean }>`
  flex: 1;
  font-size: 16px;
  letter-spacing: -0.16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin: 0;
  padding-top: 8px;
  padding-bottom: 8px;

  color: ${(props) => (props.isPlaceholder ? "rgba(34, 34, 34, 0.5)" : "#000")};
`;

const ModifyButton = styled(Button)`
  position: absolute;
  right: 0;
`;

const BlockedProfile = styled.p`
  flex: 1;
  font-size: 16px;
  letter-spacing: -0.16px;
  overflow: hidden;
  padding-bottom: 8px;
  padding-top: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #222;
  &:hover {
    text-decoration: underline;
  }
`;

// 스위치 스타일
const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SwitchLabel = styled.p`
  flex: 1;
  font-size: 16px;
  letter-spacing: -0.16px;
  overflow: hidden;
  padding-bottom: 8px;
  padding-top: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
`;

const SwitchWrapper = styled.div<{ isActive: boolean }>`
  background-color: ${(props) => (props.isActive ? "#222222" : "#e4e4e4")};
  border-radius: 15.5px;
  width: 51px;
  height: 31px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SwitchCircle = styled.div<{ isActive: boolean }>`
  background-color: #fff;
  border-radius: 50%;
  width: 27px;
  height: 27px;
  position: absolute;
  top: 50%;
  left: ${(props) => (props.isActive ? "22px" : "2px")};
  transform: translateY(-50%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Profile: React.FC = () => {
  // const [isProfileHidden, setIsProfileHidden] = useState(false);

  // const toggleProfileVisibility = () => {
  //   setIsProfileHidden((prev) => !prev);
  // };
  // // 프로필 정보 상태
  // const [profileInfo, setProfileInfo] = useState({
  //   profileName: "홍길동",
  //   realName: "홍길동",
  //   introduction: "안녕하세요, 저는 홍길동입니다.",
  //   imageUrl: "https://via.placeholder.com/80",
  // });

  // const [blockedProfiles, setBlockedProfiles] = useState([
  //   {
  //     id: 1,
  //     profileName: "ljhun__",
  //     realName: "이준",
  //     imageUrl: "https://via.placeholder.com/44",
  //   },
  //   {
  //     id: 2,
  //     profileName: "eoagt5z",
  //     realName: "김철수",
  //     imageUrl: "https://via.placeholder.com/44",
  //   },
  // ]);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // // 변경 함수
  // const handleModify = (key: keyof typeof profileInfo) => {
  //   const newValue = prompt(`새로운 ${key}를 입력하세요:`, profileInfo[key]);
  //   if (newValue) {
  //     setProfileInfo({ ...profileInfo, [key]: newValue });
  //   }
  // };
  // const handleUnblock = (id: number) => {
  //   setBlockedProfiles((prev) => prev.filter((profile) => profile.id !== id));
  // };
  const [profileInfo, setProfileInfo] = useState<ProfileInfoDto | null>(null);
  const [blockedProfiles, setBlockedProfiles] = useState<BlockedProfileDto[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileHidden, setIsProfileHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const profileData = await getProfileInfo();
        setProfileInfo(profileData);
        setIsProfileHidden(!profileData.isPublic);

        const blockedProfiles = await getBlockedProfiles();
        setBlockedProfiles(blockedProfiles);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
        setError("프로필 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const toggleProfileVisibility = async () => {
    if (!profileInfo) return;

    try {
      await updateProfile({
        profileName: profileInfo.profileName,
        Name: profileInfo.realName,
        bio: profileInfo.bio,
        isPublic: !isProfileHidden,
      });
      setIsProfileHidden((prev) => !prev);
    } catch (error) {
      console.error("Failed to update profile visibility", error);
      setError("프로필 공개 설정 변경 중 오류가 발생했습니다.");
    }
  };

  const handleModify = async (key: keyof ProfileInfoDto) => {
    if (!profileInfo) return;

    const newValue = prompt(
      `새로운 ${key}를 입력하세요:`,
      profileInfo[key] as string
    );
    if (newValue) {
      try {
        await updateProfile({
          profileName:
            key === "profileName" ? newValue : profileInfo.profileName,
          Name: key === "realName" ? newValue : profileInfo.realName,
          bio: key === "bio" ? newValue : profileInfo.bio,
          isPublic: profileInfo.isPublic,
        });

        setProfileInfo((prev) => (prev ? { ...prev, [key]: newValue } : null));
      } catch (error) {
        console.error(`Failed to update ${key}`, error);
        setError(`${key} 업데이트 중 오류가 발생했습니다.`);
      }
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await updateProfile(
        {
          profileName: profileInfo?.profileName || "",
          Name: profileInfo?.realName || "",
          bio: profileInfo?.bio || "",
          isPublic: profileInfo?.isPublic || false,
        },
        file
      );

      // 프로필 정보 다시 불러오기
      const updatedProfileInfo = await getProfileInfo();
      setProfileInfo(updatedProfileInfo);
    } catch (error) {
      console.error("Failed to upload profile image", error);
      setError("프로필 이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleUnblockProfile = async (profileId: number) => {
    try {
      // 차단 해제 로직
      const updatedBlockedProfiles = await getBlockedProfiles();
      setBlockedProfiles(updatedBlockedProfiles);
    } catch (error) {
      console.error("Failed to unblock profile", error);
      setError("프로필 차단 해제 중 오류가 발생했습니다.");
    }
  };
  const handleUnblock = async (profileId: number) => {
    try {
      // 프로필 차단 해제 API 호출
      await unblockProfile(profileId);

      // 차단된 프로필 목록 다시 불러오기
      const updatedBlockedProfiles = await getBlockedProfiles();
      setBlockedProfiles(updatedBlockedProfiles);
    } catch (error) {
      console.error("Failed to unblock profile", error);
      setError("프로필 차단 해제 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!profileInfo) return null;

  return (
    <PageContainer>
      {/* 페이지 헤더 */}
      <PageHeader>
        <Title>프로필 관리</Title>
      </PageHeader>

      {/* 사용자 프로필 섹션 */}
      <UserProfile>
        <ProfileThumb>
          <ProfileImage
            src={
              `https://www.pinjun.xyz/api/profiles/${profileInfo.profileImage}/image` ||
              "https://via.placeholder.com/80"
            }
            alt="사용자 이미지"
          />
        </ProfileThumb>
        <ProfileDetail>
          <UserName>{profileInfo.profileName}</UserName>
          <ButtonBox>
            <Button>이미지 변경</Button>
            <Button>삭제</Button>
          </ButtonBox>
        </ProfileDetail>
      </UserProfile>

      {/* 프로필 정보 섹션 */}
      <ProfileInfoContainer>
        <ProfileGroup>
          <GroupTitle>프로필 정보</GroupTitle>

          {/* 프로필 이름 */}
          <ProfileUnit>
            <TitleLabel>프로필 이름</TitleLabel>
            <UnitContent>
              <Description>{profileInfo.profileName}</Description>
              <ModifyButton onClick={() => handleModify("profileName")}>
                변경
              </ModifyButton>
            </UnitContent>
          </ProfileUnit>

          {/* 이름 */}
          <ProfileUnit>
            <TitleLabel>이름</TitleLabel>
            <UnitContent>
              <Description>{profileInfo.realName}</Description>
              <ModifyButton onClick={() => handleModify("realName")}>
                변경
              </ModifyButton>
            </UnitContent>
          </ProfileUnit>

          {/* 소개 */}
          <ProfileUnit>
            <TitleLabel>소개</TitleLabel>
            <UnitContent>
              <Description isPlaceholder={!profileInfo.bio}>
                {profileInfo.bio || "나를 소개하세요"}
              </Description>
              <ModifyButton onClick={() => handleModify("bio")}>
                변경
              </ModifyButton>
            </UnitContent>
          </ProfileUnit>
        </ProfileGroup>

        {/* 프로필 차단/해제 */}
        <ProfileGroup>
          <GroupTitle>프로필 차단/해제</GroupTitle>
          <ProfileUnit>
            <BlockedProfile role="button" onClick={() => setIsModalOpen(true)}>
              차단한 프로필
            </BlockedProfile>
          </ProfileUnit>
        </ProfileGroup>
        <ProfileGroup>
          <GroupTitle>프로필 공개 범위</GroupTitle>
          <ProfileUnit>
            <SwitchContainer>
              <SwitchLabel role="button" onClick={toggleProfileVisibility}>
                관심 브랜드에서 숨기기
              </SwitchLabel>
              <SwitchWrapper
                isActive={isProfileHidden}
                onClick={toggleProfileVisibility}
              >
                <SwitchCircle isActive={isProfileHidden} />
              </SwitchWrapper>
            </SwitchContainer>
          </ProfileUnit>
        </ProfileGroup>
        {/* 모달 렌더링 */}
        {isModalOpen && (
          <BlockedProfilesModal
            profiles={blockedProfiles}
            onClose={() => setIsModalOpen(false)}
            onUnblock={handleUnblock}
          />
        )}
      </ProfileInfoContainer>
    </PageContainer>
  );
};

export default Profile;
