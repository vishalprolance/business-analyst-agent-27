
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { slideUpAnimation } from '@/utils/animation';
import { BUSINESS_ANALYST_PROMPT } from '@/utils/documentGenerator';
import { useToast } from '@/hooks/use-toast';
import { OpenAIService, availableModels, LLMModel } from '@/services/openai';
import ApiKeyInput from '@/components/ApiKeyInput';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import PRDManager from '@/components/chat/PRDManager';
import useAnalysisManager from '@/components/chat/AnalysisManager';
import useMessageManager from '@/components/chat/MessageManager';
import { Message } from '@/components/ChatInterface';

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

interface ChatContainerProps {
  onAnalysisComplete: (analysis: any) => void;
  resetTrigger?: number;
  onMessagesUpdate?: (messages: Message[]) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  onAnalysisComplete, 
  resetTrigger = 0,
  onMessagesUpdate 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isPRDAvailable, setIsPRDAvailable] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [openAIService] = useState<OpenAIService>(new OpenAIService(BUSINESS_ANALYST_PROMPT));
  const [selectedModel, setSelectedModel] = useState<LLMModel>(openAIService.getSelectedModel());
  
  const { toast } = useToast();
  
  // Use a ref for the PRD button to ensure consistent access across renders
  const prdButtonRef = useRef<HTMLButtonElement | null>(null);
  
  // Initialize analysis and messages on first load or reset
  useEffect(() => {
    console.log("ChatContainer reset triggered", resetTrigger);
    resetAnalysis();
  }, [resetTrigger]);
  
  // Send messages to parent component whenever they change
  useEffect(() => {
    if (onMessagesUpdate && messages.length > 0) {
      console.log("Sending updated messages to parent", messages.length);
      onMessagesUpdate(messages);
    }
  }, [messages, onMessagesUpdate]);
  
  // Setup analysis manager
  const { updateCategoriesBasedOnMessage } = useAnalysisManager({
    analysis,
    onAnalysisUpdate: (updatedAnalysis) => {
      setAnalysis(updatedAnalysis);
      onAnalysisComplete(updatedAnalysis);
    },
    setIsPRDAvailable
  });
  
  // Setup message manager
  const { isTyping, handleSendMessage } = useMessageManager({
    openAIService,
    onMessageAdded: (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    },
    updateCategoriesBasedOnMessage
  });
  
  const resetAnalysis = useCallback(() => {
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
    
    // Create initial welcome message with unique ID
    const initialMessage: Message = {
      id: `init-${Date.now().toString()}`,
      content: "Hi there, I'm your business analyst assistant. I'll help you understand and plan your app idea through a series of questions. Once I have a clear picture, I can generate a comprehensive document as a blueprint for your application. Let's start with the basics - could you describe your app idea in simple terms? What problem does it solve?",
      sender: 'agent',
      timestamp: new Date()
    };
    
    console.log("Setting initial message:", JSON.stringify(initialMessage));
    
    // Set messages state with the initial message
    setMessages([initialMessage]);
    
    // Reset conversation in OpenAI service
    openAIService.resetConversation();
    
    // Send initial message to parent
    if (onMessagesUpdate) {
      onMessagesUpdate([initialMessage]);
    }
  }, [onAnalysisComplete, openAIService, onMessagesUpdate]);
  
  const handleApiKeySet = (modelId: string, apiKey: string) => {
    openAIService.setApiKey(modelId, apiKey);
    
    toast({
      title: "API Key Updated",
      description: "Your API key has been saved successfully",
    });
  };

  const handleModelSelect = (modelId: string) => {
    openAIService.setSelectedModel(modelId);
    setSelectedModel(openAIService.getSelectedModel());
    
    toast({
      title: "Model Changed",
      description: `Now using ${openAIService.getSelectedModel().name}`,
    });
  };

  // Direct test function for the PRD generation - no event listener needed
  const handleTestPRDTrigger = () => {
    console.log("Direct test PRD trigger called!");
    // The actual PRD generation is now in PRDManager
    const prdTriggerButton = document.getElementById('generate-prd-trigger');
    if (prdTriggerButton) {
      prdTriggerButton.click();
    }
  };

  // Store reference to the PRD trigger button
  useEffect(() => {
    console.log("Setting up PRD trigger event listener");
    
    setTimeout(() => {
      const prdTriggerButton = document.getElementById('generate-prd-trigger');
      
      if (!prdTriggerButton) {
        console.error("PRD trigger button not found in DOM after timeout");
        return;
      }
      
      console.log("Found PRD trigger button after timeout:", prdTriggerButton);
      prdButtonRef.current = prdTriggerButton as HTMLButtonElement;
    }, 1000);
  }, []);

  // Calculate completed categories for the header
  const completedCategories = analysis?.categories.filter(cat => cat.isComplete).length || 0;
  const totalCategories = analysis?.categories.length || 12;

  return (
    <motion.div 
      className="relative w-full h-full flex flex-col rounded-lg overflow-hidden bg-white bg-opacity-50 glass"
      variants={slideUpAnimation}
      initial="initial"
      animate="animate"
      data-testid="chat-interface"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white to-analyst-light opacity-50 z-0"></div>
      
      <ChatHeader 
        onApiKeyClick={() => setShowApiKeyInput(!showApiKeyInput)} 
        isPRDAvailable={isPRDAvailable}
        completedCategories={completedCategories}
        totalCategories={totalCategories}
        onTestPRDTrigger={handleTestPRDTrigger}
        selectedModel={selectedModel.name}
      />
      
      {showApiKeyInput && (
        <ApiKeyInput 
          onApiKeySet={handleApiKeySet}
          onModelSelect={handleModelSelect}
          initialValues={openAIService.getAllApiKeys()}
          selectedModel={selectedModel}
        />
      )}
      
      <MessageList 
        messages={messages}
        isTyping={isTyping}
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
      />
      
      <PRDManager 
        analysis={analysis}
        messages={messages}
        buttonRef={prdButtonRef}
      />
    </motion.div>
  );
};

export default ChatContainer;
