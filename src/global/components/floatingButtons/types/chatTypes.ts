export interface QuestionRequestDto {
  question: string;
}

export interface QuestionResponseDto {
  question: string;
  answer: string;
  createdAt: string;
}

export interface ChatHistoryDto {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
}

// 메시지 인터페이스 (UI용)
export interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp?: string;
}
