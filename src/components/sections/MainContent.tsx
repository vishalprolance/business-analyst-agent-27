
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import ChatHistory from '@/components/chat/ChatHistory';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import { Message } from '@/components/ChatInterface';

interface MainContentProps {
  analysis: {
    metrics: {
      revenue: string;
      growth: string;
      customers: string;
      churn: string;
    };
    insights: string[];
    categories?: {
      name: string;
      isComplete: boolean;
      keywords: string[];
    }[];
  } | null;
  resetTrigger: number;
  showHistory: boolean;
  chatMessages: Message[];
  onAnalysisComplete: (analysis: any) => void;
  onMessagesUpdate: (messages: Message[]) => void;
  toggleHistory: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  analysis,
  resetTrigger,
  showHistory,
  chatMessages,
  onAnalysisComplete,
  onMessagesUpdate,
  toggleHistory
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="relative">
        <ChatInterface 
          onAnalysisComplete={onAnalysisComplete} 
          resetTrigger={resetTrigger}
          onMessagesUpdate={onMessagesUpdate}
        />
        <ChatHistory
          messages={chatMessages}
          isOpen={showHistory}
          onClose={toggleHistory}
        />
      </div>
      
      <div className="flex flex-col justify-center">
        {analysis ? (
          <AnalysisDisplay analysis={analysis} />
        ) : (
          <motion.div 
            className="text-center p-10 rounded-lg border border-dashed border-analyst-border bg-white bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-analyst-light rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-analyst-accent" />
            </div>
            <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
            <p className="text-analyst-text text-sm max-w-md mx-auto">
              Tell your business analyst about your app idea. Share your vision and requirements
              to generate a comprehensive Product Requirements Document with actionable insights.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
