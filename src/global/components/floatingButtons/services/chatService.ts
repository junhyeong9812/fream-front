import apiClient from "src/global/services/ApiClient";
import {
  ChatHistoryDto,
  QuestionRequestDto,
  QuestionResponseDto,
} from "../types/chatTypes";
import { ErrorHandler } from "src/global/services/errorHandler";
import { toast } from "react-toastify";
import { ApiError, ErrorCodes } from "src/global/types/errors";

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

    // ApiError로 변환되었는지 확인하고 처리
    if (error instanceof ApiError) {
      // GPT 관련 특별 처리
      if (error.code === ErrorCodes.GPT_USAGE_LIMIT_EXCEEDED) {
        toast.warning(
          "GPT 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
        );
      } else if (error.code === ErrorCodes.GPT_API_ERROR) {
        toast.error(
          "AI 서비스 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      } else if (error.code === ErrorCodes.QUESTION_LENGTH_EXCEEDED) {
        toast.warning("질문 길이가 너무 깁니다. 2000자 이내로 작성해주세요.");
      } else if (error.code === ErrorCodes.INVALID_QUESTION_DATA) {
        toast.warning("질문 내용을 입력해주세요.");
      } else {
        // 기본 에러 핸들러를 통한 처리
        ErrorHandler.handleError(error);
      }
    } else {
      // ApiError가 아닌 경우
      toast.error("질문 처리 중 오류가 발생했습니다.");
    }

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

    if (error instanceof ApiError) {
      if (error.code === ErrorCodes.CHAT_HISTORY_QUERY_ERROR) {
        toast.error("채팅 기록을 불러오는 중 오류가 발생했습니다.");
      } else if (error.code === ErrorCodes.QUESTION_PERMISSION_DENIED) {
        toast.warning(
          "채팅 기록을 조회할 권한이 없습니다. 로그인이 필요합니다."
        );
      } else {
        ErrorHandler.handleError(error);
      }
    } else {
      toast.error("채팅 기록 조회 중 오류가 발생했습니다.");
    }

    // 에러 발생 시 빈 결과 반환
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      last: true,
      first: true,
      empty: true,
    };
  }
};

// 총 페이지 수만 조회 (초기 설정용)
export const getChatHistoryPageCount = async (size = 2): Promise<number> => {
  try {
    const response = await apiClient.get(`/chat/history/count?size=${size}`);
    return response.data.data;
  } catch (error) {
    console.error("페이지 수 조회 중 오류 발생:", error);

    if (error instanceof ApiError) {
      if (error.code === ErrorCodes.CHAT_HISTORY_QUERY_ERROR) {
        toast.error("채팅 페이지 정보를 불러오는 중 오류가 발생했습니다.");
      } else if (error.code === ErrorCodes.QUESTION_PERMISSION_DENIED) {
        toast.warning(
          "채팅 정보를 조회할 권한이 없습니다. 로그인이 필요합니다."
        );
      } else {
        ErrorHandler.handleError(error);
      }
    } else {
      toast.error("페이지 정보 조회 중 오류가 발생했습니다.");
    }

    return 0;
  }
};
