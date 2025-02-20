import apiClient from "src/global/services/ApiClient";
import {
  BlockedProfileDto,
  ProfileInfoDto,
  ProfileUpdateDto,
} from "../types/profile";

export const getProfileInfo = async (): Promise<ProfileInfoDto> => {
  try {
    const response = await apiClient.get<ProfileInfoDto>("/profiles");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch profile info:", error);
    throw error;
  }
};

export const updateProfile = async (
  profileData: ProfileUpdateDto,
  profileImage?: File
): Promise<string> => {
  try {
    const formData = new FormData();
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }
    formData.append("dto", JSON.stringify(profileData));

    const response = await apiClient.put<string>("/profiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

export const getBlockedProfiles = async (): Promise<BlockedProfileDto[]> => {
  try {
    const response = await apiClient.get<BlockedProfileDto[]>(
      "/profiles/blocked"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch blocked profiles:", error);
    throw error;
  }
};

export const unblockProfile = async (
  blockedProfileId: number
): Promise<string> => {
  try {
    const response = await apiClient.delete<string>(
      `/profiles/blocked?blockedProfileId=${blockedProfileId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to unblock profile:", error);
    throw error;
  }
};
