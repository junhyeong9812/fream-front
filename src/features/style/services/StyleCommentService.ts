import apiClient from "src/global/services/ApiClient";
import {
  StyleCommentResponseDto,
  StyleCommentsResponseDto,
  AddCommentRequestDto,
  UpdateCommentRequestDto,
} from "../types/styleTypes";

const styleCommentService = {
  // 댓글 목록 조회
  getComments: async (
    styleId: number,
    page: number = 1,
    size: number = 10
  ): Promise<StyleCommentsResponseDto> => {
    try {
      const response = await apiClient.get(
        `/styles/comments/queries/${styleId}?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error("댓글 조회 실패:", error);
      throw error;
    }
  },

  // 댓글 추가
  addComment: async (
    requestDto: AddCommentRequestDto
  ): Promise<StyleCommentResponseDto> => {
    try {
      const response = await apiClient.post(
        "/styles/comments/commands",
        requestDto
      );
      return response.data;
    } catch (error) {
      console.error("댓글 추가 실패:", error);
      throw error;
    }
  },

  // 댓글 수정
  updateComment: async (
    commentId: number,
    requestDto: UpdateCommentRequestDto
  ): Promise<void> => {
    try {
      await apiClient.put(`/styles/comments/commands/${commentId}`, requestDto);
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      throw error;
    }
  },

  // 댓글 삭제
  deleteComment: async (commentId: number): Promise<void> => {
    try {
      await apiClient.delete(`/styles/comments/commands/${commentId}`);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      throw error;
    }
  },
};

export default styleCommentService;
