
import React from 'react';
import { motion } from 'framer-motion';
import { History, ArrowLeft } from 'lucide-react';
import { Message } from '@/components/ChatInterface';

interface ChatHistoryProps {
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isOpen, onClose }) => {
  if (!isOpen) return null;

  const safeMessages = Array.isArray(messages) ? messages : [];
  const hasChatHistory = safeMessages.length > 0;

  return (
    <motion.div 
      className="absolute inset-0 bg-white z-20 flex flex-col rounded-lg overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      data-testid="chat-history-panel"
    >
      <div className="flex items-center justify-between p-4 border-b border-analyst-border">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-analyst-light rounded-full transition-colors"
            aria-label="Close history"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center">
            <History size={18} className="mr-2 text-analyst-accent" />
            <h2 className="font-medium">Chat History</h2>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {hasChatHistory ? (
          <div className="space-y-6">
            {safeMessages.map((message, index) => {
              // Group messages by date
              const messageDate = message.timestamp instanceof Date 
                ? message.timestamp.toLocaleDateString() 
                : 'Unknown date';
              
              // Only show date heading for first message or when date changes
              const showDateHeading = index === 0 || 
                (safeMessages[index-1].timestamp instanceof Date && 
                 message.timestamp instanceof Date && 
                 safeMessages[index-1].timestamp.toLocaleDateString() !== messageDate);
              
              return (
                <React.Fragment key={message.id}>
                  {showDateHeading && (
                    <div className="sticky top-0 bg-white py-2 border-b border-analyst-border mb-4">
                      <p className="text-sm font-medium text-analyst-text">{messageDate}</p>
                    </div>
                  )}
                  <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-analyst-light ml-8' : 'bg-white border border-analyst-border mr-8'}`}>
                    <p className="text-xs font-medium mb-1">
                      {message.sender === 'user' ? 'You' : 'Business Analyst'}
                    </p>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-analyst-text mt-2">
                      {message.timestamp instanceof Date 
                        ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : 'Unknown time'}
                    </p>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <History size={48} className="text-analyst-text opacity-20 mb-4" />
            <p className="text-analyst-text">No chat history available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatHistory;
