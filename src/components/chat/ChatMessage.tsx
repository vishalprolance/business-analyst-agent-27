
import React from 'react';
import { motion } from 'framer-motion';

interface MessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage: React.FC<MessageProps> = ({ content, isUser, timestamp }) => {
  // Ensure content isn't undefined or null
  const messageContent = content || "";
  
  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full mb-4`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
          isUser 
            ? 'bg-analyst-accent text-white chat-bubble-user' 
            : 'bg-white border border-analyst-border text-analyst-dark chat-bubble-agent'
        }`}
      >
        <div className="text-sm whitespace-pre-wrap break-words">{messageContent}</div>
        <p className="text-xs mt-2 opacity-70">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
