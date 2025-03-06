
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
import ChatFooter from '@/components/chat/ChatFooter';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onAnalysisComplete: (analysis: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onAnalysisComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isPRDAvailable, setIsPRDAvailable] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [openAIService] = useState<OpenAIService>(new OpenAIService(BUSINESS_ANALYST_PROMPT));
  const { toast } = useToast();
  
  // Initialize chat with welcome message
  useEffect(() => {
    // Add initial assistant message
    setMessages([{
      id: '1',
      content: "Hi there, I'm your business analyst assistant. I'll help you understand and plan your app idea through a series of questions. Once I have a clear picture, I can generate a comprehensive masterplan as a blueprint for your application. Let's start with the basics - could you describe your app idea in simple terms? What problem does it solve?",
      sender: 'agent',
      timestamp: new Date()
    }]);
  }, []);

  const handleApiKeySet = (apiKey: string) => {
    openAIService.setApiKey(apiKey);
    setShowApiKeyInput(false);
    
    toast({
      title: "API Key Updated",
      description: "Your OpenAI API key has been saved successfully",
    });
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
    
    setMessages(prev => [...prev, userMessage]);
    
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
      
      setMessages(prev => [...prev, agentMessage]);
      
      // After a few messages, make PRD available
      if (messages.length > 6) {
        const sampleAnalysis = {
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
          ]
        };
        
        setAnalysis(sampleAnalysis);
        onAnalysisComplete(sampleAnalysis);
        setIsPRDAvailable(true);
      }
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
      downloadDocument(documentBlob, 'Product_Requirements_Document.doc');
      
      toast({
        title: "PRD Generated",
        description: "Your Product Requirements Document has been downloaded.",
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
      
      <ChatFooter />
    </motion.div>
  );
};

export default ChatInterface;
