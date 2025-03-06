
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { Message } from '@/components/ChatInterface';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Debug message rendering
  useEffect(() => {
    console.log("MessageList rendering with messages:", messages);
    if (!Array.isArray(messages)) {
      console.error("Messages is not an array!", messages);
    } else if (messages.length === 0) {
      console.log("Messages array is empty");
    } else {
      console.log("First message:", messages[0]);
      console.log("Last message:", messages[messages.length - 1]);
      console.log("Total message count:", messages.length);
    }
  }, [messages]);

  // Create a safe copy of messages to prevent rendering issues
  const validMessages = Array.isArray(messages) ? [...messages] : [];
  
  console.log("About to render MessageList with:", validMessages.length, "messages");

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10 h-full max-h-[calc(100vh-180px)] bg-slate-50 bg-opacity-60">
      {validMessages.length === 0 ? (
        <div className="text-center text-analyst-text py-8">
          No messages yet. Start a conversation!
        </div>
      ) : (
        validMessages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isUser={message.sender === 'user'}
            timestamp={message.timestamp}
          />
        ))
      )}
      
      {isTyping && <TypingIndicator />}
      
      <div ref={messageEndRef} className="h-2" />
    </div>
  );
};

export default MessageList;
