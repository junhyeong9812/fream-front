export interface BlockedProfileDto {
  profileId: number;
  profileName: string;
  profileImageUrl: string;
}

export interface ProfileInfoDto {
  profileId: number;
  profileImage: string;
  profileName: string;
  realName: string;
  email: string;
  bio: string;
  isPublic: boolean;
  blockedProfiles: BlockedProfileDto[];
}

export interface ProfileUpdateDto {
  profileName: string;
  Name: string; // 백엔드 DTO와 일치하도록 수정
  bio: string;
  isPublic: boolean;
}

export interface ProfileData {
  profileId: number;
  profileImage: string;
  profileName: string;
  realName: string;
  email: string;
}
