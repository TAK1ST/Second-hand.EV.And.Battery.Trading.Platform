import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, Send } from 'lucide-react';

// --- Notification Dropdown Component ---
// This component displays the notifications received in real-time.
const NotificationDropDown = ({ notifications, unreadCount, markAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAsRead(); // Mark as read when opening the dropdown
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      >
        <Bell className="h-6 w-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-lg z-20 origin-top-right">
          <div className="py-2 px-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="py-1 max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                   <p className={`text-sm text-gray-700 ${!notif.read ? 'font-bold' : 'font-normal'}`}>
                    {notif.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notif.id).toLocaleTimeString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500">You have no new notifications.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default NotificationDropDown