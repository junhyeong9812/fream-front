import apiClient from "src/global/services/ApiClient";

const styleBookmarkService = {
  // 스타일 북마크(관심) 토글
  toggleBookmark: async (styleId: number): Promise<boolean> => {
    try {
      await apiClient.post(`/styles/interests/commands/${styleId}/toggle`);
      return true;
    } catch (error) {
      console.error("북마크 토글 실패:", error);
      return false;
    }
  },
};

export default styleBookmarkService;
