import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";

interface WSProps {}
const WebsocketComponent: React.FC<WSProps> = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(
        null
    );

    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState<string>("");
    const [user, setUser] = useState<string>("User");

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7164/gamehub")
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    console.log("Connected!");

                    connection.on(
                        "ReceiveMessage",
                        (user: string, message: string) => {
                            setMessages((messages) => [
                                ...messages,
                                `${user}: ${message}`,
                            ]);
                        }
                    );
                })
                .catch((e) => console.log("Connection failed: ", e));
        }
    }, [connection]);

    const sendMessage = async () => {
        if (connection && message) {
            try {
                await connection.send("SendMessage", user, message);
                setMessage("");
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <div>
            <h1>SignalR Chat</h1>
            <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Your name"
            />
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message"
            />
            <button onClick={sendMessage}>Send</button>
            <ul>
                {messages.map((m, index) => (
                    <li key={index}>{m}</li>
                ))}
            </ul>
        </div>
    );
};

export default WebsocketComponent;
