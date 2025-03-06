import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { slideUpAnimation } from '@/utils/animation';
import { 
  generatePRD, 
  generateWordDocumentBlob, 
  downloadDocument, 
  BUSINESS_ANALYST_PROMPT 
} from '@/utils/documentGenerator';
import { useToast } from '@/hooks/use-toast';
import { OpenAIService } from '@/services/openai';
import ApiKeyInput from '@/components/ApiKeyInput';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface Category {
  name: string;
  isComplete: boolean;
  keywords: string[];
}

interface AnalysisData {
  metrics: {
    revenue: string;
    growth: string;
    customers: string;
    churn: string;
  };
  insights: string[];
  categories: Category[];
}

interface ChatInterfaceProps {
  onAnalysisComplete: (analysis: any) => void;
  resetTrigger?: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onAnalysisComplete, resetTrigger = 0 }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isPRDAvailable, setIsPRDAvailable] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [openAIService] = useState<OpenAIService>(new OpenAIService(BUSINESS_ANALYST_PROMPT));
  const { toast } = useToast();
  
  const resetAnalysis = () => {
    const initialAnalysis: AnalysisData = {
      metrics: {
        revenue: '$1.2M',
        growth: '+15%',
        customers: '1,250',
        churn: '2.3%'
      },
      insights: [
        'Revenue is growing consistently at 15% QoQ',
        'Customer acquisition cost has decreased by 12%',
        'Enterprise segment shows 3x higher profit margins',
        'Mobile engagement is 34% higher than desktop'
      ],
      categories: [
        { name: "Core Concept & Goals", isComplete: false, keywords: ["goal", "concept", "purpose", "objective"] },
        { name: "Features & Prioritization", isComplete: false, keywords: ["feature", "prioritize", "priority", "important"] },
        { name: "Target Audience & User Flow", isComplete: false, keywords: ["audience", "user", "flow", "customer"] },
        { name: "Platform & Technology", isComplete: false, keywords: ["platform", "technology", "tech stack", "framework"] },
        { name: "Data & Storage", isComplete: false, keywords: ["data", "storage", "database", "information"] },
        { name: "User Authentication & Security", isComplete: false, keywords: ["authentication", "security", "login", "password"] },
        { name: "Business Model & Monetization", isComplete: false, keywords: ["business model", "monetization", "revenue", "pricing"] },
        { name: "Integrations & Third-Party Services", isComplete: false, keywords: ["integration", "third-party", "service", "api"] },
        { name: "Scalability & Growth", isComplete: false, keywords: ["scalability", "growth", "scale", "expand"] },
        { name: "Constraints & Development Timeline", isComplete: false, keywords: ["constraint", "timeline", "deadline", "development time"] },
        { name: "Future Expansion & Roadmap", isComplete: false, keywords: ["future", "expansion", "roadmap", "vision"] },
        { name: "User Interface & Experience (UI/UX)", isComplete: false, keywords: ["interface", "ui", "ux", "experience", "design"] }
      ]
    };
    
    setAnalysis(initialAnalysis);
    onAnalysisComplete(initialAnalysis);
    setIsPRDAvailable(false);
    
    // Set initial welcome message
    setMessages([{
      id: Date.now().toString(),
      content: "Hi there, I'm your business analyst assistant. I'll help you understand and plan your app idea through a series of questions. Once I have a clear picture, I can generate a comprehensive masterplan as a blueprint for your application. Let's start with the basics - could you describe your app idea in simple terms? What problem does it solve?",
      sender: 'agent',
      timestamp: new Date()
    }]);
    
    // Reset conversation in OpenAI service
    openAIService.resetConversation();
    
    console.log("Chat reset with initial message");
  };
  
  // Initialize analysis and messages on first load or reset
  useEffect(() => {
    resetAnalysis();
    console.log("Chat interface initialized");
  }, [resetTrigger, onAnalysisComplete]);
  
  const handleApiKeySet = (apiKey: string) => {
    openAIService.setApiKey(apiKey);
    setShowApiKeyInput(false);
    
    toast({
      title: "API Key Updated",
      description: "Your OpenAI API key has been saved successfully",
    });
  };

  const updateCategoriesBasedOnMessage = (message: string) => {
    if (!analysis) return;
    
    const updatedCategories = [...analysis.categories];
    let categoriesUpdated = false;
    
    updatedCategories.forEach(category => {
      if (!category.isComplete) {
        const foundKeyword = category.keywords.some(keyword => 
          message.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (foundKeyword) {
          category.isComplete = true;
          categoriesUpdated = true;
        }
      }
    });
    
    if (categoriesUpdated) {
      const updatedAnalysis = {
        ...analysis,
        categories: updatedCategories
      };
      
      setAnalysis(updatedAnalysis);
      onAnalysisComplete(updatedAnalysis);
      
      // After 4 categories are complete, make PRD available
      const completedCount = updatedCategories.filter(cat => cat.isComplete).length;
      if (completedCount >= 4 && !isPRDAvailable) {
        setIsPRDAvailable(true);
      }
    }
  };

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    console.log("User message:", userMessage);
    setMessages(prev => [...prev, userMessage]);
    
    // Update categories based on user message
    updateCategoriesBasedOnMessage(input);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Get response from OpenAI
      const response = await openAIService.sendMessage(input);
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add agent response
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'agent',
        timestamp: new Date()
      };
      
      console.log("Agent response:", agentMessage);
      setMessages(prev => [...prev, agentMessage]);
      
      // Update categories based on agent response
      updateCategoriesBasedOnMessage(response);
    } catch (error) {
      console.error("Error getting response:", error);
      setIsTyping(false);
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePRD = () => {
    if (!analysis) return;
    
    try {
      const prdContent = generatePRD(analysis, messages);
      const documentBlob = generateWordDocumentBlob(prdContent);
      downloadDocument(documentBlob, 'Master_Plan.doc');
      
      toast({
        title: "Master Plan Generated",
        description: "Your Product Requirements Document / Master Plan has been downloaded.",
      });
    } catch (error) {
      console.error("Error generating PRD:", error);
      toast({
        title: "Error",
        description: "Failed to generate the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate completed categories for the header
  const completedCategories = analysis?.categories.filter(cat => cat.isComplete).length || 0;
  const totalCategories = analysis?.categories.length || 12;

  return (
    <motion.div 
      className="relative w-full h-full flex flex-col rounded-lg overflow-hidden bg-white bg-opacity-50 glass"
      variants={slideUpAnimation}
      initial="initial"
      animate="animate"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white to-analyst-light opacity-50 z-0"></div>
      
      <ChatHeader 
        onApiKeyClick={() => setShowApiKeyInput(!showApiKeyInput)} 
        onGeneratePRD={handleGeneratePRD}
        isPRDAvailable={isPRDAvailable}
        completedCategories={completedCategories}
        totalCategories={totalCategories}
      />
      
      {showApiKeyInput && (
        <ApiKeyInput 
          onApiKeySet={handleApiKeySet} 
          initialValue={openAIService.getApiKey()}
        />
      )}
      
      <MessageList 
        messages={messages}
        isTyping={isTyping}
      />
      
      <ChatInput onSendMessage={handleSendMessage} />
      
    </motion.div>
  );
};

export default ChatInterface;
