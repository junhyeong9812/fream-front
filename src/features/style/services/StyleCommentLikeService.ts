import apiClient from "src/global/services/ApiClient";

const styleCommentLikeService = {
  // 댓글 좋아요 토글
  toggleCommentLike: async (commentId: number): Promise<boolean> => {
    try {
      await apiClient.post(
        `/styles/comments/likes/commands/${commentId}/toggle`
      );
      return true;
    } catch (error) {
      console.error("댓글 좋아요 토글 실패:", error);
      return false;
    }
  },
};

export default styleCommentLikeService;
