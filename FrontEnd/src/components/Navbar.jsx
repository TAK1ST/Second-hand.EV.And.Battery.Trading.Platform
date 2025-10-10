import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { RiAuctionFill } from "react-icons/ri";
import { MdOutlineAttachMoney } from "react-icons/md";
import Logo from '../components/Logo';
import ProfileDropDown from './ProfileDropDown';
import { FaShoppingCart } from "react-icons/fa";
import NotificationDropDown from '../NotificationDropDown';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';


function Navbar() {
const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]); // <-- State for incoming messages
  const [isConnected, setIsConnected] = useState(false);

  // This function is passed down to the child to SEND a message
  const sendNotification = async (message) => {
    if (connection && connection.state === 'Connected') {
      try {
        // Invokes the "SendNotification" method on your C# Hub
        await connection.invoke("SendMessage", message);
        console.log("Notification sent successfully!");
      } catch (e) {
        console.error("Error sending notification: ", e);
      }
    } else {
      alert("Cannot send notification, the connection is not active.");
    }
  };
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7272/notificationHub") // Make sure this URL is correct
      .build();

    setConnection(newConnection);
  }, []); // <-- This effect runs only once to create the connection object

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('SignalR Connected.');
          setIsConnected(true);

          // *** ADD THIS LISTENER ***
          // Listens for messages from the server with the name "ReceiveNotification"
          connection.on("ReceiveMessage", message => {
            console.log("Notification Received: ", message);
              setNotifications(prevNotifications => [message, ...prevNotifications]);
          });
        })
        .catch(e => console.error('Connection failed: ', e));

      connection.onclose(() => {
        console.log('SignalR connection closed.');
        setIsConnected(false);
      });
    }

    // Cleanup on component unmount
    return () => {
      connection?.stop();
    };
  }, [connection]); // <-- This effect runs when the connection object is set


  const leftmenu = [
    { name: 'Home', link: '/', icon: <IoMdHome /> },
    { name: 'Auction', link: '/auctions', icon: <RiAuctionFill /> }
  ]
  const rightmenu = [
    { name: <NotificationDropDown 
              sendMessage={sendNotification} 
            />, icon: <IoMdHome /> },
    { name: 'Support', link: '/support' }]
  return (

    <div>
      <div className="w-full flex flex-col items-center justify-between p-4 bg-maincolor text-white left-0">
        <div className="flex items-center w-full justify-around h-5">
          <div className="left-header flex w-full" >
            {leftmenu.map((item, index) => (
              <Link to={item.link} key={index} className="mx-4 hover:text-green-300 flex items-center">
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            {data.data && data.data.role == "Manager" ? (
              <Link to="/manage" className="mx-4 hover:text-green-300 flex items-center">
                <FaSuitcase />
                <span className="ml-2">Manager</span>
              </Link>
            ) : (
              <Link to="/seller" className="mx-4 hover:text-green-300 flex items-center">
                <FaSuitcase />
                <span className="ml-2">Seller</span>
              </Link>
            )
            }

          </div>
          <div className="right-header flex w-full justify-end" >
            {rightmenu.map((item, index) => (
              <Link to={item.link} key={index} className="mx-4 hover:text-green-300 flex items-center">
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            {data.data ? (
              <div className="ml-4 pt-5">
                <ProfileDropDown users={data.data} />
              </div>
            )
              : (
                <div className="flex">
                  <Link to="/login" className="mx-4 hover:text-green-300 flex items-center">
                    Login
                  </Link>
                  <Link to="/register" className="mx-4 hover:text-green-300 flex items-center">
                    Register
                  </Link>
                </div>
              )
            }
          </div>
        </div>
        <div className="w-full flex h-20 items-center align-middle content-center">
          <div className="w-1/4 h-full flex justify-start"><Logo></Logo></div>
          <div className="content-center align-middle w-2/4">
            <form action='/search' method='GET' className="w-full p-2 rounded-lg text-black bg-white relative">
                <input type="text" name="query" placeholder="Search..." className="w-5/6"/>
                <select className="bg-maincolor-darker w-1/6 absolute right-0 top-0 h-full align-middle text-center font-bold border-1" name="itemType">
                <option value="EV">Vehicle</option>
                <option value="Battery">Battery</option>
                </select>
              <button type="submit" className="hidden">Search</button>
            </form>
          </div>
          <div className="w-1/4 flex justify-end">
            <Link to={'/cart'} className="mx-4 hover:text-green-300 flex items-center">
              {<FaShoppingCart />}
              <span className="ml-2">Cart</span>
            </Link>
            <Link to={'/purchase'} className="mx-4 hover:text-green-300 flex items-center">
              {<LuShoppingBag />}
              <span className="ml-2">Purchase</span>
            </Link>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Navbar