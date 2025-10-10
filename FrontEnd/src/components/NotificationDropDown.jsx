// src/components/NotificationDropDown.js

import React from 'react';
import { BellOutlined, DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button } from 'antd';

function NotificationDropDown({ sendMessage}) {
  
  const handleSendTestMessage = () => {
    // Call the function passed from the Navbar parent
    sendMessage("This is a test notification from React!");
  };

  // Build the dropdown items from the notifications prop
    // Add a divider and a button to send a test message
  return (
    <Button onClick={handleSendTestMessage}/>
  );
}

export default NotificationDropDown;