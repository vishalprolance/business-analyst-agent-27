
import React, { useState, useEffect, useRef } from 'react';
import { fadeInAnimation } from '@/utils/animation';
import Header from '@/components/Header';
import { Toaster } from "@/components/ui/toaster";
import { Message } from '@/components/ChatInterface';
import { toast } from "@/components/ui/use-toast";
import { generateDetailedRoadmap, generateMarkdownBlob, downloadDocument } from '@/utils/documentGenerator';
import HeaderSection from '@/components/sections/HeaderSection';
import FeatureBoxes from '@/components/features/FeatureBoxes';
import MainContent from '@/components/sections/MainContent';
import FooterSection from '@/components/sections/FooterSection';

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
          <HeaderSection />
          
          <FeatureBoxes 
            isPRDAvailable={isPRDAvailable}
            onGenerateRoadmap={handleGenerateRoadmap}
            onGeneratePRD={handleGeneratePRD}
          />
          
          <MainContent 
            analysis={analysis}
            resetTrigger={resetTrigger}
            showHistory={showHistory}
            chatMessages={chatMessages}
            onAnalysisComplete={handleAnalysisComplete}
            onMessagesUpdate={handleMessagesUpdate}
            toggleHistory={toggleHistory}
          />
          
          <FooterSection />
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
