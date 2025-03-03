import apiClient from "src/global/services/ApiClient";
import {
  ChatHistoryDto,
  QuestionRequestDto,
  QuestionResponseDto,
} from "../types/chatTypes";

// 질문 전송 및 응답 받기
export const sendQuestion = async (
  question: string
): Promise<QuestionResponseDto> => {
  try {
    const requestData: QuestionRequestDto = { question };
    const response = await apiClient.post("/chat/question", requestData);
    return response.data.data;
  } catch (error) {
    console.error("질문 전송 중 오류 발생:", error);
    throw error;
  }
};

// 채팅 히스토리 페이징 조회
export const getChatHistory = async (
  page = 0,
  size = 2
): Promise<{
  content: ChatHistoryDto[];
  totalElements: number;
  totalPages: number;
  number: number; // 현재 페이지 번호
  last: boolean;
  first: boolean;
  empty: boolean;
}> => {
  try {
    const response = await apiClient.get(
      `/chat/history?page=${page}&size=${size}`
    );
    return response.data.data;
  } catch (error) {
    console.error("채팅 히스토리 조회 중 오류 발생:", error);
    throw error;
  }
};

// 총 페이지 수만 조회 (초기 설정용)
export const getChatHistoryPageCount = async (size = 2): Promise<number> => {
  try {
    const response = await apiClient.get(`/chat/history/count?size=${size}`);
    return response.data.data;
  } catch (error) {
    console.error("페이지 수 조회 중 오류 발생:", error);
    return 0;
  }
};
