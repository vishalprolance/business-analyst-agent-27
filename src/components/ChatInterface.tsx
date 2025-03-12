
import React from 'react';
import ChatContainer from '@/components/chat/ChatContainer';

// Export the Message interface for use by other components
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onAnalysisComplete: (analysis: any) => void;
  resetTrigger?: number;
  onMessagesUpdate?: (messages: Message[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = (props) => {
  // Simply pass through all props to the container component
  return <ChatContainer {...props} />;
};

export default ChatInterface;
