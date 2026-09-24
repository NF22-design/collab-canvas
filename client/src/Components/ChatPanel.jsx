import { useState, useRef, useEffect } from "react";
import socket from "../api/socket.js";

const ChatPanel = ({ roomId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef(null);

    useEffect(() => {
        socket.on("chat-history", (history) => {
            setMessages(history);
        });

        socket.on("chat-message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("chat-history");
            socket.off("chat-message");
        };
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        socket.emit("chat-message", { roomId, text: input.trim() });
        setInput("");
    };

    return (
        <div className="chat-panel">
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`chat-message ${msg.userId === currentUserId ? "own" : ""}`}
                    >
                        <span className="chat-username">{msg.username}</span>
                        <span className="chat-text">{msg.text}</span>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            <form className="chat-input-form" onSubmit={sendMessage}>
                <input
                    type="text"
                    placeholder="Say something..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={500}
                />
                <button type="submit" disabled={!input.trim()}>Send</button>
            </form>
        </div>
    );
};

export default ChatPanel;