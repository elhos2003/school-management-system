// src/context/NotificationContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

interface Notification {
  id: number;
  message: string;
  type: "news" | "homework" | "grade" | "behavior" | "schedule";
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string, type: Notification["type"], link?: string) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // تحميل الإشعارات من localStorage
    const saved = localStorage.getItem("system_notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    // حفظ الإشعارات في localStorage
    localStorage.setItem("system_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (message: string, type: Notification["type"], link?: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type,
      read: false,
      createdAt: new Date().toLocaleString(),
      link
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}