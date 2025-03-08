
import React from 'react';
import { Settings, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onApiKeyClick: () => void;
  isPRDAvailable: boolean;
  completedCategories: number;
  totalCategories: number;
  onTestPRDTrigger?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onApiKeyClick, 
  isPRDAvailable,
  completedCategories,
  totalCategories,
  onTestPRDTrigger
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-analyst-border z-10 w-full">
      <div className="flex items-center space-x-3">
        <h2 className="font-medium">Technical Business Analyst</h2>
        <span className="text-xs px-2 py-1 bg-analyst-light text-analyst-accent rounded-full">
          Progress: {completedCategories}/{totalCategories}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        {onTestPRDTrigger && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onTestPRDTrigger}
            className="h-8 bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300"
          >
            <FileText className="h-3.5 w-3.5 mr-1" />
            Generate Requirements
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onApiKeyClick}
          className="h-8"
        >
          <Settings className="h-3.5 w-3.5 mr-1" />
          API Key
        </Button>
        
        {/* This button should be accessible for programmatic clicking */}
        <button 
          id="generate-prd-trigger" 
          className="hidden"
          type="button"
          aria-hidden="true"
          data-testid="hidden-prd-trigger"
        ></button>
      </div>
    </div>
  );
};

export default ChatHeader;
