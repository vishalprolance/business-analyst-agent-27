
import React from 'react';
import { Key, BarChart2, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatHeaderProps {
  onApiKeyClick: () => void;
  isPRDAvailable?: boolean;
  completedCategories: number;
  totalCategories: number;
  onTestPRDTrigger?: () => void;
  selectedModel?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onApiKeyClick, 
  isPRDAvailable = false,
  completedCategories,
  totalCategories,
  onTestPRDTrigger,
  selectedModel = "GPT-4o"
}) => {
  // Calculate progress percentage
  const progress = Math.round((completedCategories / totalCategories) * 100);
  
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white bg-opacity-75 border-b border-analyst-border z-10">
      <div className="flex items-center">
        <motion.div 
          className="mr-2 flex items-center bg-gradient-to-r from-analyst-accent to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <BarChart2 size={12} className="mr-1" />
          <span>{progress}%</span>
        </motion.div>
        
        <span className="text-sm font-medium text-analyst-text hidden md:block">
          Topics covered: {completedCategories}/{totalCategories}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-xs text-analyst-text opacity-75">
          Using: <span className="font-semibold">{selectedModel}</span>
        </span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onApiKeyClick}
                className="text-analyst-text hover:text-analyst-accent transition-colors p-1 rounded"
                aria-label="Set API Key"
              >
                <Key size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Set your API Key</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Hidden PRD trigger button for programmatic use */}
        <button 
          id="generate-prd-trigger" 
          data-testid="hidden-prd-trigger"
          className="hidden"
          onClick={onTestPRDTrigger}
        >
          Generate PRD
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
