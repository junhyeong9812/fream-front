import apiClient from "src/global/services/ApiClient";
import { NotificationDTO } from "src/global/types/notification";

export const notificationService = {
  // 읽지 않은 알림 조회
  getUnreadNotifications: async (): Promise<NotificationDTO[]> => {
    const response = await apiClient.get(
      "/notifications/filter/type/read-status",
      {
        params: {
          type: "ALL",
          isRead: false,
          page: 0,
          size: 20,
        },
      }
    );
    return response.data;
  },

  // 알림 읽음 처리
  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.post(`/notifications/${notificationId}/read`);
  },
};
