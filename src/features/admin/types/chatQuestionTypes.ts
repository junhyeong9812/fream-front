/**
 * 채팅 질문 관련 타입 정의
 */

// 질문 요청 DTO
export interface QuestionRequestDto {
  question: string;
}

// 질문 응답 DTO
export interface QuestionResponseDto {
  question: string;
  answer: string;
  createdAt: string;
}

// 채팅 기록 DTO
export interface ChatHistoryDto {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
}

// 페이지네이션된 채팅 기록 응답
export interface PaginatedChatHistoryResponse {
  content: ChatHistoryDto[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// GPT 사용량 로그 DTO
export interface GPTUsageLogDto {
  id: number;
  userName: string;
  requestType: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  modelName: string;
  requestDate: string;
  questionContent: string;
}

// GPT 일별 사용량 DTO
export interface DailyUsageDto {
  date: string;
  tokenCount: number;
}

// GPT 사용량 통계 DTO
export interface GPTUsageStatsDto {
  totalTokensUsed: number;
  estimatedCost: number;
  dailyUsage: DailyUsageDto[];
  usageByModel: { [key: string]: number };
  usageByRequestType: { [key: string]: number };
}

// 페이지네이션된 GPT 사용량 로그 응답
export interface PaginatedGPTUsageLogResponse {
  content: GPTUsageLogDto[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// 검색 옵션
export interface GPTSearchParams {
  startDate?: string;
  endDate?: string;
  modelName?: string;
  requestType?: string;
  userName?: string;
  page?: number;
  size?: number;
}

// 정렬 옵션
export interface SortOption {
  field: string;
  order: "asc" | "desc";
}
