export enum NotificationCategory {
  SHOP = "SHOP",
  STYLE = "STYLE",
}

export enum NotificationType {
  TRADE = "거래",
  BID = "입찰",
  STORAGE = "보관판매",
  INTEREST = "관심/발매",
  BENEFIT = "혜택",
  OTHER = "기타",
}

export interface NotificationDTO {
  id: number;
  category: NotificationCategory;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}
