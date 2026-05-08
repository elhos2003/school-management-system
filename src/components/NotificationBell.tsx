// src/components/NotificationBell.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.css";

interface Notification {
  id: number;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setUserEmail(user.email || "");
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      const savedNotifications = localStorage.getItem(`notifications_${userEmail}`);
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed);
          const unread = parsed.filter((n: Notification) => !n.read).length;
          setUnreadCount(unread);
        } catch (e) {}
      }
    }
  }, [userEmail]);

  const markAsRead = (id: number, link?: string) => {
    const updated = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updated);
    if (userEmail) {
      localStorage.setItem(`notifications_${userEmail}`, JSON.stringify(updated));
    }
    setUnreadCount(updated.filter(n => !n.read).length);
    if (link) navigate(link);
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updated);
    if (userEmail) {
      localStorage.setItem(`notifications_${userEmail}`, JSON.stringify(updated));
    }
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "news": return "📰";
      case "homework": return "✏️";
      case "grade": return "📊";
      case "behavior": return "🎯";
      case "schedule": return "📅";
      default: return "🔔";
    }
  };

  return (
    <div className="notification-container">
      <div 
        className="notification-bell" 
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </div>

      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                Mark all read
              </button>
            )}
          </div>
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <span className="no-notif-icon">🔕</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 15).map(notif => (
                <div 
                  key={notif.id} 
                  className={`notification-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notif.id, notif.link)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-message">{notif.message}</div>
                    <div className="notification-time">{notif.createdAt}</div>
                  </div>
                  {!notif.read && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}