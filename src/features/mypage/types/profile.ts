export interface BlockedProfileDto {
  id: number;
  profileName: string;
  profileImage: string;
}

export interface ProfileInfoDto {
  profileImage: string;
  profileName: string;
  realName: string;
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
  profileImage: string;
  profileName: string;
  realName: string;
  email: string;
}
