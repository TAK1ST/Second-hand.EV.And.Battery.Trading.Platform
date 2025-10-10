    // Example: SignalRService.js or within a React component
    import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

    const createSignalRConnection = (hubUrl, onReceiveMessage) => {
        const connection = new HubConnectionBuilder()
            .withUrl(hubUrl) // e.g., "https://localhost:5001/myhub"
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        connection.on("ReceiveMessage", (user, message) => {
            onReceiveMessage(user, message);
        });

        connection.start()
            .then(() => console.log('SignalR Connection started'))
            .catch(err => console.error('Error starting SignalR connection:', err));

        return connection;
    };

    export default createSignalRConnection;