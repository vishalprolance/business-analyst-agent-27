
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { OpenAIService } from '@/services/openai';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/components/ChatInterface';

interface MessageManagerProps {
  openAIService: OpenAIService;
  onMessageAdded: (message: Message) => void;
  updateCategoriesBasedOnMessage: (message: string) => void;
}

const useMessageManager = ({ 
  openAIService, 
  onMessageAdded, 
  updateCategoriesBasedOnMessage 
}: MessageManagerProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

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
    
    // Add the message to our collection
    onMessageAdded(userMessage);
    
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
        
        // Add the agent message to our collection
        onMessageAdded(agentMessage);
        
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

  return {
    isTyping,
    handleSendMessage
  };
};

export default useMessageManager;
