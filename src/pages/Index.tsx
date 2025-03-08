import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeInAnimation } from '@/utils/animation';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import ChatHistory from '@/components/chat/ChatHistory';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import { BarChart2, TrendingUp, Zap, FileText, TestTube } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Message } from '@/components/ChatInterface';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { generateDetailedRoadmap, generateMarkdownBlob, downloadDocument } from '@/utils/documentGenerator';

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
  const [isPRDAvailable, setIsPRDAvailable] = useState(false);
  
  // Add a ref for the PRD trigger button
  const prdTriggerRef = useRef<HTMLButtonElement | null>(null);

  const handleAnalysisComplete = (newAnalysis: Analysis) => {
    setAnalysis(newAnalysis);
    
    // Check if PRD is available based on completed categories
    if (newAnalysis.categories) {
      const completedCount = newAnalysis.categories.filter(cat => cat.isComplete).length;
      setIsPRDAvailable(completedCount >= 4);
      console.log(`Completed categories: ${completedCount}, PRD Available: ${completedCount >= 4}`);
    }
  };

  const handleNewAnalysis = () => {
    setResetTrigger(prev => prev + 1);
    setIsPRDAvailable(false);
  };

  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  // Handler to receive messages from ChatInterface
  const handleMessagesUpdate = (messages: Message[]) => {
    setChatMessages(messages);
  };

  // Handler for Master Planning button click - updated for better debugging
  const handleGenerateRoadmap = () => {
    console.log("handleGenerateRoadmap called, isPRDAvailable:", isPRDAvailable);
    
    if (!isPRDAvailable) {
      toast({
        title: "Not enough information",
        description: "Please answer more questions to unlock the Master Planning feature.",
        duration: 3000,
      });
      return;
    }
    
    try {
      console.log("Generating roadmap content...");
      // Generate the detailed roadmap content
      const roadmapContent = generateDetailedRoadmap({}, chatMessages);
      
      // Create a markdown blob and download it
      const blob = generateMarkdownBlob(roadmapContent);
      downloadDocument(blob, 'markdownplan.md');
      
      // Show success toast
      toast({
        title: "Development Roadmap Generated",
        description: "Your detailed task-level development plan has been downloaded.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast({
        title: "Error Generating Roadmap",
        description: "There was a problem creating your development roadmap.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Updated handler to trigger PRD generation in the ChatInterface
  const handleGeneratePRD = () => {
    console.log("handleGeneratePRD called, isPRDAvailable:", isPRDAvailable);
    
    if (!isPRDAvailable) {
      toast({
        title: "Not enough information",
        description: "Please answer more questions to unlock the PRD generation feature.",
        duration: 3000,
      });
      return;
    }
    
    // Find the PRD trigger button and click it
    const prdButton = document.getElementById('generate-prd-trigger');
    console.log("PRD button found:", prdButton);
    
    if (prdButton) {
      console.log("Clicking PRD button...");
      prdButton.click();
    } else {
      console.error("PRD button not found - trying to manually trigger event");
      
      // Fallback: Create and dispatch a click event
      try {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        
        // Try to find the button again using querySelector
        const altButton = document.querySelector('[data-testid="hidden-prd-trigger"]');
        
        if (altButton) {
          console.log("Found button via querySelector, clicking it");
          altButton.dispatchEvent(clickEvent);
        } else {
          console.error("Still couldn't find the PRD button using alternative methods");
          toast({
            title: "Error",
            description: "PRD generation button not found. Please try refreshing the page.",
            variant: "destructive",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error dispatching click event:", error);
      }
    }
  };

  // Store a reference to the PRD trigger button after component mounts
  useEffect(() => {
    // Wait for the DOM to be ready
    setTimeout(() => {
      prdTriggerRef.current = document.getElementById('generate-prd-trigger') as HTMLButtonElement;
      console.log("PRD trigger button reference stored:", prdTriggerRef.current);
    }, 500);
  }, []);

  // Use effect to log when isPRDAvailable changes
  useEffect(() => {
    console.log("isPRDAvailable changed:", isPRDAvailable);
  }, [isPRDAvailable]);

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
          
          {/* Test Buttons Area */}
          <div className="flex justify-center mb-6 gap-4">
            <Button 
              onClick={handleGenerateRoadmap}
              className="bg-green-500 hover:bg-green-600"
              disabled={!isPRDAvailable}
            >
              <TestTube className="mr-2 h-4 w-4" />
              Test Master Planning
            </Button>
            
            <Button 
              onClick={() => {
                console.log("Clicking PRD button directly");
                const prdButton = document.getElementById('generate-prd-trigger');
                if (prdButton) {
                  console.log("Found PRD button, clicking it");
                  prdButton.click();
                } else {
                  console.error("PRD button not found");
                  toast({
                    title: "Testing Error",
                    description: "PRD button element not found",
                    variant: "destructive"
                  });
                }
              }}
              className="bg-amber-500 hover:bg-amber-600"
              disabled={!isPRDAvailable}
            >
              <TestTube className="mr-2 h-4 w-4" />
              Test PRD Generation
            </Button>
          </div>
          
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
              className={`flex items-center bg-white p-5 rounded-lg border ${isPRDAvailable ? 'border-green-500 cursor-pointer' : 'border-analyst-border'}`}
              whileHover={isPRDAvailable ? { y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' } : {}}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={isPRDAvailable ? handleGenerateRoadmap : undefined}
              role={isPRDAvailable ? "button" : undefined}
              aria-disabled={!isPRDAvailable}
              tabIndex={isPRDAvailable ? 0 : -1}
              data-testid="master-planning-button"
            >
              <div className={`p-3 ${isPRDAvailable ? 'bg-green-50' : 'bg-gray-50'} rounded-xl mr-4`}>
                <TrendingUp className={`w-6 h-6 ${isPRDAvailable ? 'text-green-500' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className={`font-medium text-sm ${isPRDAvailable ? '' : 'text-gray-400'}`}>Master Planning</h3>
                <p className={`text-xs ${isPRDAvailable ? 'text-analyst-text' : 'text-gray-400'} mt-1`}>
                  {isPRDAvailable ? 'Click to generate development roadmap' : 'Answer more questions to unlock'}
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className={`flex items-center bg-white p-5 rounded-lg border ${isPRDAvailable ? 'border-amber-500 cursor-pointer' : 'border-analyst-border'}`}
              whileHover={isPRDAvailable ? { y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' } : {}}
              transition={{ duration: 0.3, delay: 0.15 }}
              onClick={isPRDAvailable ? handleGeneratePRD : undefined}
              role={isPRDAvailable ? "button" : undefined}
              aria-disabled={!isPRDAvailable}
              tabIndex={isPRDAvailable ? 0 : -1}
              data-testid="prd-button"
            >
              <div className={`p-3 ${isPRDAvailable ? 'bg-amber-50' : 'bg-gray-50'} rounded-xl mr-4`}>
                <FileText className={`w-6 h-6 ${isPRDAvailable ? 'text-amber-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className={`font-medium text-sm ${isPRDAvailable ? '' : 'text-gray-400'}`}>PRD Generation</h3>
                <p className={`text-xs ${isPRDAvailable ? 'text-analyst-text' : 'text-gray-400'} mt-1`}>
                  {isPRDAvailable ? 'Click to generate requirements document' : 'Answer more questions to unlock'}
                </p>
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
