
import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="p-4 border-t border-analyst-border flex items-center space-x-2 z-10">
      <button className="p-2 text-analyst-text hover:text-analyst-accent transition-colors">
        <Mic size={20} />
      </button>
      
      <input
        type="text"
        className="flex-1 p-2 px-4 rounded-full border border-analyst-border bg-white focus:ring-2 focus:ring-analyst-accent focus:border-transparent transition-all"
        placeholder="Tell me about your app idea..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      
      <button 
        className={`p-2 rounded-full ${
          input.trim()
            ? 'bg-analyst-accent text-white hover:bg-blue-600' 
            : 'bg-gray-100 text-gray-400'
        } transition-colors`}
        onClick={handleSend}
        disabled={!input.trim()}
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default ChatInput;
