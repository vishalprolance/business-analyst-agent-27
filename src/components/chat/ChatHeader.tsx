
import React from 'react';
import { Settings, FileText, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  onApiKeyClick: () => void;
  onGeneratePRD: () => void;
  isPRDAvailable: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onApiKeyClick, 
  onGeneratePRD, 
  isPRDAvailable 
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-analyst-border z-10">
      <div className="flex items-center space-x-3">
        <h2 className="font-medium">Business Analyst Agent</h2>
        <span className="text-xs px-2 py-1 bg-analyst-light text-analyst-accent rounded-full">
          Progress: 3/12
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-sm text-analyst-text">Online</span>
        </div>
        
        <motion.button 
          className="flex items-center space-x-1 text-xs px-3 py-1 bg-gray-100 text-analyst-text rounded-full hover:bg-gray-200 transition-colors"
          onClick={onApiKeyClick}
        >
          <Settings size={12} />
          <span>API Key</span>
        </motion.button>
        
        {isPRDAvailable && (
          <motion.button 
            className="flex items-center space-x-1 text-xs px-3 py-1 bg-analyst-accent text-white rounded-full hover:bg-blue-600 transition-colors"
            onClick={onGeneratePRD}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <FileText size={12} />
            <span>Generate PRD</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
