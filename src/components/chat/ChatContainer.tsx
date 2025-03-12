
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { slideUpAnimation } from '@/utils/animation';
import { BUSINESS_ANALYST_PROMPT } from '@/utils/documentGenerator';
import { OpenAIService } from '@/services/openai';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import PRDManager from '@/components/chat/PRDManager';
import useAnalysisManager from '@/components/chat/AnalysisManager';
import useMessageManager from '@/components/chat/MessageManager';
import ApiKeyManager from '@/components/chat/ApiKeyManager';
import useAnalysisState from '@/hooks/useAnalysisState';
import { Message } from '@/components/ChatInterface';

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
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [openAIService] = useState<OpenAIService>(new OpenAIService(BUSINESS_ANALYST_PROMPT));
  const [selectedModel, setSelectedModel] = useState(openAIService.getSelectedModel());
  
  // Use a ref for the PRD button to ensure consistent access across renders
  const prdButtonRef = useRef<HTMLButtonElement | null>(null);
  
  // Initialize analysis state
  const {
    messages,
    setMessages,
    analysis, 
    setAnalysis,
    isPRDAvailable,
    setIsPRDAvailable
  } = useAnalysisState({ 
    onAnalysisComplete, 
    resetTrigger, 
    openAIService, 
    onMessagesUpdate 
  });
  
  // Setup analysis manager for tracking conversation progress
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

  // Direct test function for the PRD generation
  const handleTestPRDTrigger = () => {
    console.log("Direct test PRD trigger called!");
    // The actual PRD generation is now in PRDManager
    const prdTriggerButton = document.getElementById('generate-prd-trigger');
    if (prdTriggerButton) {
      prdTriggerButton.click();
    }
  };

  // Store reference to the PRD trigger button
  React.useEffect(() => {
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

  const handleModelSelect = (modelId: string) => {
    openAIService.setSelectedModel(modelId);
    setSelectedModel(openAIService.getSelectedModel());
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
      
      <ApiKeyManager
        openAIService={openAIService}
        selectedModel={selectedModel}
        onModelSelect={handleModelSelect}
        showApiKeyInput={showApiKeyInput}
        setShowApiKeyInput={setShowApiKeyInput}
      />
      
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
