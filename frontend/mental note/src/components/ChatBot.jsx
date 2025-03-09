import React, { useState } from "react";
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box 
} from "@mui/material";
import sendMessageToChatbot from "./api/chatbot";

const ChatBot = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        const botReply = await sendMessageToChatbot(message);
        setResponse(botReply);
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
            <p>Bot: {response}</p>
        </div>
    );
}

export default ChatBot;