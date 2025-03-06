import apiClient from "src/global/services/ApiClient";

const styleLikeService = {
  // 스타일 좋아요 토글
  toggleLike: async (styleId: number): Promise<boolean> => {
    try {
      await apiClient.post(`/styles/likes/commands/${styleId}/toggle`);
      return true;
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      return false;
    }
  },
};

export default styleLikeService;
