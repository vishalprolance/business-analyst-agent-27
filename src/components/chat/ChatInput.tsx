
import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    console.log("Sending message from input:", trimmedInput);
    onSendMessage(trimmedInput);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-analyst-border flex items-center space-x-2 z-10 bg-white bg-opacity-90">
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-9 w-9 text-analyst-text hover:text-analyst-accent"
        aria-label="Voice input"
      >
        <Mic size={18} />
      </Button>
      
      <input
        type="text"
        className="flex-1 p-2 px-4 rounded-full border border-analyst-border bg-white focus:ring-2 focus:ring-analyst-accent focus:border-transparent transition-all"
        placeholder="Tell me about your app idea..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Message input"
        data-testid="chat-input"
      />
      
      <Button 
        variant={input.trim() ? "default" : "secondary"}
        size="icon"
        className={`rounded-full h-9 w-9 ${
          input.trim()
            ? 'bg-analyst-accent hover:bg-blue-600' 
            : 'bg-gray-100 text-gray-400'
        }`}
        onClick={handleSend}
        disabled={!input.trim()}
        aria-label="Send message"
        data-testid="send-button"
      >
        <Send size={18} />
      </Button>
    </div>
  );
};

export default ChatInput;
