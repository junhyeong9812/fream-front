import { useState, useEffect, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import apiClient from "../services/ApiClient";
import { NotificationDTO } from "../types/notification";

export const useWebSocket = () => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null); // ✅ 사용자 이메일 상태 추가

  // 초기 알림 데이터 로드
  const loadInitialNotifications = useCallback(async () => {
    try {
      const response = await apiClient.get(
        "/notifications/filter/type/read-status",
        {
          params: { type: "ALL", isRead: false, page: 0, size: 20 },
        }
      );
      setNotifications(response.data);
      setHasUnread(
        response.data.some((notif: NotificationDTO) => !notif.isRead)
      );
    } catch (error) {
      console.error("알림 로드 실패:", error);
    }
  }, []);

  // 사용자 이메일 가져오기 (WebSocket 연결 후)
  const fetchUserEmail = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/user/email", {
        withCredentials: true,
      });
      setUserEmail(response.data);
      return response.data;
    } catch (error) {
      console.error("사용자 이메일 가져오기 실패:", error);
      return null;
    }
  }, []);

  const connect = useCallback(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS("https://www.pinjun.xyz/api/ws", null, {
          transports: ["websocket"],
          withCredentials: true,
        }),
      onConnect: async () => {
        console.log("WebSocket 연결됨");

        // ✅ WebSocket 연결 후 사용자 이메일 가져오기
        const email = await fetchUserEmail();
        if (email) {
          setupWebSocketSubscriptions(client, email);
        }
      },
      onDisconnect: () => {
        console.log("WebSocket 연결 해제됨");
      },
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.activate();
    setStompClient(client);
  }, [fetchUserEmail]);

  // ✅ 이메일을 기반으로 개별 알림 구독 설정
  const setupWebSocketSubscriptions = useCallback(
    (client: Client, email: string) => {
      // 사용자 개별 알림 채널 구독
      client.subscribe(`/user/${email}/queue/notifications`, (message) => {
        const newNotification: NotificationDTO = JSON.parse(message.body);
        setNotifications((prev) => [newNotification, ...prev]);
        setHasUnread(true);
      });

      // 초기 알림 로드
      loadInitialNotifications();
    },
    [loadInitialNotifications]
  );

  const disconnect = useCallback(() => {
    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
    }
  }, [stompClient]);

  const markAsRead = useCallback(
    async (notificationId: number) => {
      try {
        await apiClient.post(`/notifications/${notificationId}/read`);
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setHasUnread(
          notifications.some(
            (notification) =>
              !notification.isRead && notification.id !== notificationId
          )
        );
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
      }
    },
    [notifications]
  );

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    notifications,
    hasUnread,
    connect,
    disconnect,
    markAsRead,
  };
};
