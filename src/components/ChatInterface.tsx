
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { slideUpAnimation } from '@/utils/animation';
import { 
  generatePRD, 
  generateWordDocumentBlob,
  generateMarkdownBlob,
  downloadDocument, 
  BUSINESS_ANALYST_PROMPT 
} from '@/utils/documentGenerator';
import { useToast } from '@/hooks/use-toast';
import { OpenAIService, availableModels, LLMModel } from '@/services/openai';
import ApiKeyInput from '@/components/ApiKeyInput';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import PRDPreview from '@/components/PRDPreview';

// Make this interface available for import by other components
export interface Message {
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
  onMessagesUpdate?: (messages: Message[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onAnalysisComplete, 
  resetTrigger = 0,
  onMessagesUpdate 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isPRDAvailable, setIsPRDAvailable] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [openAIService] = useState<OpenAIService>(new OpenAIService(BUSINESS_ANALYST_PROMPT));
  const [selectedModel, setSelectedModel] = useState<LLMModel>(openAIService.getSelectedModel());
  
  // Add missing state variables for PRD preview
  const [showPRDPreview, setShowPRDPreview] = useState(false);
  const [prdContent, setPrdContent] = useState('');
  
  const { toast } = useToast();
  
  // Use a ref for the PRD button to ensure consistent access across renders
  const prdButtonRef = useRef<HTMLButtonElement | null>(null);
  
  // Initialize analysis and messages on first load or reset
  useEffect(() => {
    console.log("ChatInterface reset triggered", resetTrigger);
    resetAnalysis();
  }, [resetTrigger]);
  
  // Send messages to parent component whenever they change
  useEffect(() => {
    if (onMessagesUpdate && messages.length > 0) {
      console.log("Sending updated messages to parent", messages.length);
      onMessagesUpdate(messages);
    }
  }, [messages, onMessagesUpdate]);
  
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
    
    // Set messages state with the initial message - use function form to ensure state updates correctly
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
    
    console.log("handleSendMessage called with:", input);
    
    // Add user message with unique ID
    const userMessage: Message = {
      id: `user-${Date.now().toString()}`,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    console.log("Adding user message:", JSON.stringify(userMessage));
    
    // Important: Use functional update to ensure we're working with the latest state
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Update categories based on user message
    updateCategoriesBasedOnMessage(input);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Get response from the current selected model
      const response = await openAIService.sendMessage(input);
      
      // Important: Don't hide typing indicator too soon to ensure state updates properly
      setTimeout(() => {
        setIsTyping(false);
        
        // Add agent response with unique ID
        const agentMessage: Message = {
          id: `agent-${Date.now().toString()}`,
          content: response,
          sender: 'agent',
          timestamp: new Date()
        };
        
        console.log("Adding agent response:", JSON.stringify(agentMessage));
        
        // Use functional update to ensure we have the latest messages array
        setMessages(prevMessages => [...prevMessages, agentMessage]);
        
        // Update categories based on agent response
        updateCategoriesBasedOnMessage(response);
      }, 500); // Small delay to ensure smooth UI transitions
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
      console.log("ChatInterface.handleGeneratePRD: Generating PRD content...");
      
      // Use the original messages without adding the additional prompt
      // Generate the PRD content with the messages as they are
      const content = generatePRD(analysis, messages);
      setPrdContent(content);
      setShowPRDPreview(true);
      console.log("PRD preview ready to show");
    } catch (error) {
      console.error("Error generating PRD preview:", error);
      toast({
        title: "Error",
        description: "Failed to generate the document preview. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Direct test function for the PRD generation - no event listener needed
  const handleTestPRDTrigger = () => {
    console.log("Direct test PRD trigger called!");
    handleGeneratePRD();
  };

  // Set up the event listener for the PRD trigger button
  useEffect(() => {
    console.log("Setting up PRD trigger event listener");
    
    // Cleanup function to prevent memory leaks
    const cleanupListener = () => {
      console.log("Cleaning up PRD trigger event listener");
      if (prdButtonRef.current) {
        prdButtonRef.current.removeEventListener('click', handlePRDTriggerClick);
      }
    };
    
    // Define the handler function
    const handlePRDTriggerClick = () => {
      console.log("PRD trigger button clicked from event listener!");
      handleGeneratePRD();
    };
    
    // Wait for the DOM to fully render
    setTimeout(() => {
      // Get the button element
      const prdTriggerButton = document.getElementById('generate-prd-trigger');
      
      if (!prdTriggerButton) {
        console.error("PRD trigger button not found in DOM after timeout");
        return cleanupListener;
      }
      
      console.log("Found PRD trigger button after timeout:", prdTriggerButton);
      
      // Store button in ref for cleanup
      prdButtonRef.current = prdTriggerButton as HTMLButtonElement;
      
      // Remove any existing listeners to prevent duplicates
      prdButtonRef.current.removeEventListener('click', handlePRDTriggerClick);
      
      // Add the event listener
      prdButtonRef.current.addEventListener('click', handlePRDTriggerClick);
      
      console.log("Successfully added event listener to PRD trigger button");
    }, 1000);
    
    // Return cleanup function
    return cleanupListener;
  }, [analysis, messages]); // Re-run when analysis or messages change

  const handlePRDConfirmation = (updatedContent: string) => {
    try {
      // Generate and download both files
      const markdownBlob = generateMarkdownBlob(updatedContent);
      const wordDocBlob = generateWordDocumentBlob(updatedContent);
      
      // Download both files
      downloadDocument(markdownBlob, 'PRD.md');
      downloadDocument(wordDocBlob, 'PRD.doc');
      
      setShowPRDPreview(false);
      
      toast({
        title: "Documents Generated",
        description: "Your PRD files have been downloaded in both markdown and Word formats.",
      });
    } catch (error) {
      console.error("Error generating documents:", error);
      toast({
        title: "Error",
        description: "Failed to generate the documents. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePRDCancellation = () => {
    setShowPRDPreview(false);
    setPrdContent('');
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
      
      {showPRDPreview && (
        <PRDPreview 
          content={prdContent} 
          onConfirm={handlePRDConfirmation} 
          onCancel={handlePRDCancellation} 
        />
      )}
    </motion.div>
  );
};

export default ChatInterface;
