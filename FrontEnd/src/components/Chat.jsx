    import React, { useEffect, useState } from 'react';
    import createSignalRConnection from '../api/signalRService';

    function ChatComponent() {
        const [messages, setMessages] = useState([]);
        const [connection, setConnection] = useState(null);

        useEffect(() => {
            const newConnection = createSignalRConnection(
                "https://localhost:5001/myhub", // Replace with your backend URL
                (user, message) => {
                    setMessages(prevMessages => [...prevMessages, { user, message }]);
                }
            );
            setConnection(newConnection);

            return () => {
                if (newConnection) {
                    newConnection.stop();
                }
            };
        }, []);

        const sendMessage = async () => {
            if (connection) {
                await connection.invoke("SendMessage", "React User", "Hello from React!");
            }
        };

        return (
            <div>
                <h1>Chat</h1>
                <button onClick={sendMessage}>Send Message</button>
                <div>
                    {messages.map((msg, index) => (
                        <p key={index}><strong>{msg.user}:</strong> {msg.message}</p>
                    ))}
                </div>
            </div>
        );
    }

    export default ChatComponent;