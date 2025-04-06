// 관리자 프로필 정보 타입
export interface AdminProfileInfo {
  profileId: number;
  profileImage: string | null;
  profileName: string;
  realName: string;
  email: string;
  bio: string;
  isPublic: boolean;
  blockedProfiles?: Array<{
    profileId: number;
    profileName: string;
  }>;
}

// 사이드바 메뉴 아이템 타입
export interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  link?: string;
  submenus?: Array<{
    id: string;
    title: string;
    link: string;
  }>;
}
