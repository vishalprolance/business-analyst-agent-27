
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

  // Validate messages array and print diagnostics
  const safeMessages = Array.isArray(messages) ? messages : [];
  
  useEffect(() => {
    console.log(`MessageList rendering with ${safeMessages.length} messages`);
    if (safeMessages.length > 0) {
      console.log("First message:", JSON.stringify(safeMessages[0]));
      console.log("Last message:", JSON.stringify(safeMessages[safeMessages.length - 1]));
    }
  }, [safeMessages]);

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 space-y-4 z-10 h-full max-h-[calc(100vh-180px)] bg-slate-50 bg-opacity-60"
      data-testid="message-list-container"
    >
      {safeMessages.length === 0 ? (
        <div className="text-center text-analyst-text py-8">
          No messages yet. Start a conversation!
        </div>
      ) : (
        safeMessages.map((message) => {
          console.log(`Rendering message ID: ${message.id}, Sender: ${message.sender}`);
          return (
            <ChatMessage
              key={message.id}
              content={message.content}
              isUser={message.sender === 'user'}
              timestamp={message.timestamp}
            />
          );
        })
      )}
      
      {isTyping && <TypingIndicator />}
      
      <div ref={messageEndRef} className="h-2" />
    </div>
  );
};

export default MessageList;
