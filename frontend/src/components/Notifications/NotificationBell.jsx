import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiBell } from "react-icons/fi";
import {
  fetchUnreadCount,
  fetchNotifications,
  markAsRead
} from "../../redux/slices/notificationSlice";
import { addNotification } from "../../redux/slices/notificationSlice";
import socketService from "../../services/socket";
import { toast } from "react-toastify";
import "./Notifications.css";

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const { unreadCount, notifications } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchUnreadCount());
    dispatch(fetchNotifications({ limit: 10 }));

    // Listen for real-time notifications
    socketService.on("new_notification", (notification) => {
      dispatch(addNotification(notification));
      toast.info(notification.title);
    });

    return () => {
      socketService.off("new_notification");
    };
  }, [dispatch]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification.id));
    }
    setShowDropdown(false);
  };

  return (
    <div className="notification-bell">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bell-button"
      >
        <FiBell />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <h3>Notifications</h3>
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.isRead ? "unread" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <p className="notification-title">{notification.title}</p>
                  <p className="notification-message">{notification.message}</p>
                </div>
              ))
            ) : (
              <p className="no-notifications">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
