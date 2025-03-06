import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, BarChart3, ChevronRight, FileText } from 'lucide-react';
import { slideUpAnimation } from '@/utils/animation';
import { 
  generatePRD, 
  generateWordDocumentBlob, 
  downloadDocument, 
  BUSINESS_ANALYST_PROMPT 
} from '@/utils/documentGenerator';
import { useToast } from '@/hooks/use-toast';

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
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there, I'm your professional CTO advisor. I'll help you understand and plan your app idea through a series of questions. Once I have a clear picture, I can generate a comprehensive masterplan as a blueprint for your application. Let's start with the basics - could you describe your app idea in simple terms? What problem does it solve?",
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isPRDAvailable, setIsPRDAvailable] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Questions from the refined role-play prompt
  const questions = [
    "What problem does your app solve?",
    "Who are the primary users of your app, and what benefits will they get?",
    "How do you define success for this app?",
    "What are the core features of the app?",
    "Which features are essential for the MVP (Minimum Viable Product)?",
    "Can you rank your features in order of priority?",
    "Who is your ideal user (demographics, profession, behavior)?",
    "Can you describe a typical user journey step by step?",
    "Will this be a web app, mobile app, desktop app, or a combination?",
    "Do you have any preferences for frameworks or technologies?",
    "What kind of data will your app handle?",
    "How do you plan to store and manage data?",
    "How will users sign in? (Email/password, Google, LinkedIn, etc.)",
    "Is this app free, paid, or freemium?",
    "Does your app need to integrate with other services?",
    "How many users do you expect initially? What about long-term?",
    "What is your ideal timeline for development and launch?",
    "Do you see this app expanding to other markets or industries?",
    "Do you have any design references or inspiration?"
  ];
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate agent typing
    setIsTyping(true);
    
    // Simulate agent response after delay
    setTimeout(() => {
      setIsTyping(false);
      
      let agentResponse: string;
      
      // If we're in the structured question flow and there are more questions
      if (currentQuestionIndex < questions.length) {
        agentResponse = questions[currentQuestionIndex];
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Otherwise, provide a contextual response based on the conversation
        // These are concluding responses for the demo
        const contextualResponses = [
          "Thank you for sharing all this valuable information! This gives me a comprehensive understanding of your app vision.",
          "Based on everything you've shared, I can now help create a detailed Product Requirements Document for your application.",
          "I've gathered enough information to generate a comprehensive masterplan for your app development process.",
          "With all these details, I can now compile a complete PRD that will serve as a blueprint for your application.",
          "Thank you for providing such thorough information about your app idea. I'm ready to generate your Product Requirements Document now."
        ];
        
        agentResponse = contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
      }
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: agentResponse,
        sender: 'agent',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // After a few messages, simulate analysis completion
      if (messages.length > 6 || currentQuestionIndex >= Math.floor(questions.length / 2)) {
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
    }, 1500);
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
      
      <div className="flex items-center justify-between p-4 border-b border-analyst-border z-10">
        <h2 className="font-medium">Business Analyst</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-analyst-text">Online</span>
          </div>
          
          {isPRDAvailable && (
            <motion.button 
              className="flex items-center space-x-1 text-xs px-3 py-1 bg-analyst-accent text-white rounded-full hover:bg-blue-600 transition-colors"
              onClick={handleGeneratePRD}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <FileText size={12} />
              <span>Generate PRD</span>
            </motion.button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className={`max-w-[80%] p-3 ${
                message.sender === 'user' 
                  ? 'bg-analyst-accent text-white chat-bubble-user' 
                  : 'bg-white border border-analyst-border text-analyst-dark chat-bubble-agent'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div 
            className="flex justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white border border-analyst-border p-3 rounded-lg chat-bubble-agent">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messageEndRef} />
      </div>
      
      <div className="p-4 border-t border-analyst-border flex items-center space-x-2 z-10">
        <button className="p-2 text-analyst-text hover:text-analyst-accent transition-colors">
          <Mic size={20} />
        </button>
        
        <input
          type="text"
          className="flex-1 p-2 px-4 rounded-full border border-analyst-border bg-white focus:ring-2 focus:ring-analyst-accent focus:border-transparent transition-all"
          placeholder="Tell me about your app idea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        
        <button 
          className={`p-2 rounded-full ${
            input.trim() 
              ? 'bg-analyst-accent text-white hover:bg-blue-600' 
              : 'bg-gray-100 text-gray-400'
          } transition-colors`}
          onClick={handleSendMessage}
          disabled={!input.trim()}
        >
          <Send size={20} />
        </button>
      </div>
      
      <div className="p-4 bg-analyst-highlight border-t border-analyst-border flex items-center justify-between z-10">
        <div className="flex items-center text-sm text-analyst-text">
          <BarChart3 size={16} className="mr-2" />
          <span>Advanced Analytics Available</span>
        </div>
        <button className="flex items-center text-sm text-analyst-accent hover:text-blue-600 transition-colors">
          <span>Open Charts</span>
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </motion.div>
  );
};

export default ChatInterface;
