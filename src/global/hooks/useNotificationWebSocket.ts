import { useState, useCallback, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import apiClient from "../services/ApiClient";
import { NotificationDTO } from "../types/notification";

export const useWebSocket = () => {
  const stompClientRef = useRef<Client | null>(null);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const emailRef = useRef<string | null>(null);
  const isConnectingRef = useRef(false);

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

  // 사용자 이메일 가져오기
  const fetchUserEmail = useCallback(async () => {
    try {
      const response = await apiClient.get("/user/email", {
        withCredentials: true,
      });
      emailRef.current = response.data;
      return response.data;
    } catch (error) {
      console.error("사용자 이메일 가져오기 실패:", error);
      return null;
    }
  }, []);

  // WebSocket 구독 설정
  const setupWebSocketSubscriptions = useCallback(
    (client: Client, email: string) => {
      client.subscribe(`/user/${email}/queue/notifications`, (message) => {
        const newNotification: NotificationDTO = JSON.parse(message.body);
        setNotifications((prev) => [newNotification, ...prev]);
        setHasUnread(true);
      });
      loadInitialNotifications();
    },
    [loadInitialNotifications]
  );

  const connect = useCallback(async () => {
    // 이미 연결 중이거나 연결된 상태면 중복 연결 방지
    if (isConnectingRef.current || stompClientRef.current?.active) {
      return;
    }

    isConnectingRef.current = true;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS("/api/ws", null, {
          withCredentials: true,
        }),
      onConnect: async () => {
        console.log("WebSocket 연결됨");
        const email = emailRef.current || (await fetchUserEmail());
        if (email) {
          setupWebSocketSubscriptions(client, email);
        }
        isConnectingRef.current = false;
      },
      onStompError: (frame) => {
        console.error("STOMP 오류:", frame.headers["message"], frame.body);
        isConnectingRef.current = false;
      },
      onWebSocketError: (event) => {
        console.error("WebSocket 오류:", event);
        isConnectingRef.current = false;
      },
      onDisconnect: () => {
        console.log("WebSocket 연결 해제됨");
        isConnectingRef.current = false;
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClientRef.current = client;
    client.activate();
  }, [fetchUserEmail, setupWebSocketSubscriptions]);

  const disconnect = useCallback(() => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    isConnectingRef.current = false;
  }, []);

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
        setHasUnread((prev) =>
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

  // cleanup effect
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
