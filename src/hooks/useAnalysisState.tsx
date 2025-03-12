
import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/components/ChatInterface';
import { OpenAIService } from '@/services/openai';

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

interface UseAnalysisStateProps {
  onAnalysisComplete: (analysis: any) => void;
  resetTrigger?: number;
  openAIService: OpenAIService;
  onMessagesUpdate?: (messages: Message[]) => void;
}

const useAnalysisState = ({
  onAnalysisComplete,
  resetTrigger = 0,
  openAIService,
  onMessagesUpdate
}: UseAnalysisStateProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isPRDAvailable, setIsPRDAvailable] = useState(false);

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

  // Initialize analysis and messages on first load or reset
  useEffect(() => {
    console.log("Analysis state reset triggered", resetTrigger);
    resetAnalysis();
  }, [resetTrigger, resetAnalysis]);

  // Send messages to parent component whenever they change
  useEffect(() => {
    if (onMessagesUpdate && messages.length > 0) {
      console.log("Sending updated messages to parent", messages.length);
      onMessagesUpdate(messages);
    }
  }, [messages, onMessagesUpdate]);

  return {
    messages,
    setMessages,
    analysis, 
    setAnalysis,
    isPRDAvailable,
    setIsPRDAvailable,
    resetAnalysis
  };
};

export default useAnalysisState;
