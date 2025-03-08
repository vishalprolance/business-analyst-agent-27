import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInAnimation } from '@/utils/animation';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import ChatHistory from '@/components/chat/ChatHistory';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import { BarChart2, TrendingUp, Zap, FileText } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Message } from '@/components/ChatInterface';

interface Analysis {
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
}

const Index = () => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleAnalysisComplete = (newAnalysis: Analysis) => {
    setAnalysis(newAnalysis);
  };

  const handleNewAnalysis = () => {
    setResetTrigger(prev => prev + 1);
  };

  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  // Handler to receive messages from ChatInterface
  const handleMessagesUpdate = (messages: Message[]) => {
    setChatMessages(messages);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-analyst-light">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIHN0cm9rZT0iI2YwZjJmNSIgc3Ryb2tlLW9wYWNpdHk9Ii41IiBjeD0iMTAiIGN5PSIxMCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <Header 
          onNewAnalysis={handleNewAnalysis} 
          onHistoryClick={toggleHistory}
        />
        
        <main className="mt-8">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInAnimation}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Technical Business Analyst & Requirements Generator
            </motion.h1>
            <motion.p 
              className="text-analyst-text max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Chat with your friendly technical business analyst to plan your app idea and generate 
              a comprehensive Requirements Document with insights and recommendations.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="flex items-center bg-white p-5 rounded-lg border border-analyst-border"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-3 bg-blue-50 rounded-xl mr-4">
                <BarChart2 className="w-6 h-6 text-analyst-accent" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Requirement Analysis</h3>
                <p className="text-xs text-analyst-text mt-1">Structured information gathering</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center bg-white p-5 rounded-lg border border-analyst-border"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="p-3 bg-green-50 rounded-xl mr-4">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Master Planning</h3>
                <p className="text-xs text-analyst-text mt-1">Strategic development roadmap</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center bg-white p-5 rounded-lg border border-analyst-border"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="p-3 bg-amber-50 rounded-xl mr-4">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">PRD Generation</h3>
                <p className="text-xs text-analyst-text mt-1">Download comprehensive docs</p>
              </div>
            </motion.div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <ChatInterface 
                onAnalysisComplete={handleAnalysisComplete} 
                resetTrigger={resetTrigger}
                onMessagesUpdate={handleMessagesUpdate}
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
          
          <motion.div 
            className="mt-16 text-center text-sm text-analyst-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Powered by advanced product planning algorithms • Updated in real-time
          </motion.div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
