export interface BlockedProfileDto {
  id: number;
  profileName: string;
  profileImage: string;
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
  realName: string;
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
