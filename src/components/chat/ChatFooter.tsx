
import React from 'react';
import { BarChart3, ChevronRight } from 'lucide-react';

const ChatFooter: React.FC = () => {
  return (
    <div className="p-4 bg-analyst-highlight border-t border-analyst-border flex items-center justify-between z-10">
      <div className="flex items-center text-sm text-analyst-text">
        <BarChart3 size={16} className="mr-2" />
        <span>Advanced Analytics Available</span>
      </div>
      <button className="flex items-center text-sm text-analyst-accent hover:text-blue-600 transition-colors">
        <span>Open Charts</span>
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
};

export default ChatFooter;
