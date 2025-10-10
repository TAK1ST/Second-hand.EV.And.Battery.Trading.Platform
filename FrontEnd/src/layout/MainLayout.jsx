
import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import userApi from '../api/userApi';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
function MainLayout() {

  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Effect for setting up and managing the SignalR connection
  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7272/notificationHub", {
        // Send the token as a query string parameter
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('SignalR Connected!');

          // Set up listener for incoming messages
          connection.on("ReceiveMessage", message => {
            console.log("Notification Received: ", message);
            const newNotification = {
              id: Date.now(),
              text: message,
              read: false,
            };
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          });
        })
        .catch(e => console.error('Connection failed: ', e));

      // Cleanup on component unmount
      return () => {
        connection.stop();
      };
    }
  }, [connection]);

  // Function to send a message to the hub
  const sendMessage = async (message) => {
    if (connection && connection.state === HubConnectionState.Connected) {
      try {
        await connection.invoke("SendMessage", message);
      } catch (e) {
        console.error("Error sending notification: ", e);
        throw e; // Re-throw to be caught in the component
      }
    } else {
      alert("Cannot send notification, the connection is not active.");
    }
  };

  // Function to mark notifications as read
  const markAsRead = () => {
    setUnreadCount(0);
    setNotifications(currentNotifications =>
      currentNotifications.map(n => ({ ...n, read: true }))
    );
  };

  const userData = localStorage.getItem('userId');
  const [userProfile, setUser] = useState(null);
  console.log(userProfile)
  const fetchUser = async () => {
    try {
      const userByID = await userApi.getUserByID(userData);
      setUser(userByID)
    } catch (error) {
      console.error("Error fetching items", error);
    }
  }


  useEffect(() => {
    fetchUser();
  }, []);
  const mainRef = useRef(null);
  return (
    <div className="h-screen w-screen flex flex-col m-0 p-0 bg-gray-200">
      <ScrollToTop scrollRef={mainRef} />

      <Navbar className="w-full h-16 sticky top-0 z-50" data={userProfile} notifications={notifications}
        unreadCount={unreadCount}
        markAsRead={markAsRead} />
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        <Outlet context={{sendMessage}} />
      </main>
    </div>
  );
}

export default MainLayout