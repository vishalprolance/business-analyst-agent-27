
import React from 'react';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onApiKeyClick: () => void;
  isPRDAvailable: boolean;
  completedCategories: number;
  totalCategories: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onApiKeyClick, 
  isPRDAvailable,
  completedCategories,
  totalCategories
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-analyst-border z-10 w-full">
      <div className="flex items-center space-x-3">
        <h2 className="font-medium">Business Analyst Agent</h2>
        <span className="text-xs px-2 py-1 bg-analyst-light text-analyst-accent rounded-full">
          Progress: {completedCategories}/{totalCategories}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 mr-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-sm text-analyst-text">Online</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onApiKeyClick}
          className="h-8"
        >
          <Settings className="h-3.5 w-3.5 mr-1" />
          API Key
        </Button>
        
        {/* Hidden button that will be clicked by the Index component */}
        <button 
          id="generate-prd-trigger" 
          className="hidden"
          aria-hidden="true"
        ></button>
      </div>
    </div>
  );
};

export default ChatHeader;
