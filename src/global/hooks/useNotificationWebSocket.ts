
import { useState, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import apiClient from '../services/ApiClient';
import { NotificationDTO } from '../types/notification';

export const useWebSocket = () => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  // 초기 알림 데이터 로드
  const loadInitialNotifications = useCallback(async () => {
    try {
      const response = await apiClient.get('/notifications/filter/type/read-status', {
        params: {
          type: 'ALL',
          isRead: false,
          page: 0,
          size: 20
        }
      });
      setNotifications(response.data);
      setHasUnread(response.data.some((notif: NotificationDTO) => !notif.isRead));
    } catch (error) {
      console.error('알림 로드 실패:', error);
    }
  }, []);

  const connect = useCallback(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('https://www.pinjun.xyz/api/ws'),
      onConnect: () => {
        console.log('WebSocket 연결됨');
        client.subscribe('/queue/notifications', (message) => {
          const newNotification: NotificationDTO = JSON.parse(message.body);
          setNotifications(prev => [newNotification, ...prev]);
          setHasUnread(true);
        });
        loadInitialNotifications();
      },
      onDisconnect: () => {
        console.log('WebSocket 연결 해제됨');
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    client.activate();
    setStompClient(client);
  }, [loadInitialNotifications]);

  const disconnect = useCallback(() => {
    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
    }
  }, [stompClient]);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await apiClient.post(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setHasUnread(notifications.some(notification => 
        !notification.isRead && notification.id !== notificationId
      ));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  }, [notifications]);

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
    markAsRead
  };
};