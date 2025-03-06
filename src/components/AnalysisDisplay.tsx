
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import { scaleAnimation } from '@/utils/animation';

interface AnalysisDisplayProps {
  analysis: {
    metrics: {
      revenue: string;
      growth: string;
      customers: string;
      churn: string;
    };
    insights: string[];
  } | null;
}

const ProgressItem = ({ 
  category, 
  isComplete, 
  index 
}: { 
  category: string; 
  isComplete: boolean;
  index: number;
}) => {
  return (
    <motion.div 
      className="flex items-center p-3 rounded-lg bg-white border border-analyst-border mb-2"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
    >
      {isComplete ? (
        <CheckCircle size={18} className="text-green-500 mr-3 flex-shrink-0" />
      ) : (
        <Circle size={18} className="text-analyst-text mr-3 flex-shrink-0" />
      )}
      <span className="text-sm">{category}</span>
    </motion.div>
  );
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  // These would eventually be dynamically updated based on actual conversation progress
  const categories = [
    { name: "Core Concept & Goals", isComplete: true },
    { name: "Features & Prioritization", isComplete: true },
    { name: "Target Audience & User Flow", isComplete: true },
    { name: "Platform & Technology", isComplete: false },
    { name: "Data & Storage", isComplete: false },
    { name: "User Authentication & Security", isComplete: false },
    { name: "Business Model & Monetization", isComplete: false },
    { name: "Integrations & Third-Party Services", isComplete: false },
    { name: "Scalability & Growth", isComplete: false },
    { name: "Constraints & Development Timeline", isComplete: false },
    { name: "Future Expansion & Roadmap", isComplete: false },
    { name: "User Interface & Experience (UI/UX)", isComplete: false }
  ];
  
  // Calculate completion percentage
  const completedCount = categories.filter(cat => cat.isComplete).length;
  const totalCount = categories.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);
  
  return (
    <motion.div 
      className="w-full"
      variants={scaleAnimation}
      initial="initial"
      animate="animate"
    >
      <div className="mb-6">
        <motion.h2 
          className="text-lg font-medium mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Requirement Analysis Progress
        </motion.h2>
        <motion.p 
          className="text-sm text-analyst-text mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {completedCount} of {totalCount} categories explored ({completionPercentage}% complete)
        </motion.p>
        
        <motion.div 
          className="w-full bg-gray-200 rounded-full h-2.5 mb-6"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="bg-analyst-accent h-2.5 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          ></motion.div>
        </motion.div>
      </div>
      
      <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-analyst-border scrollbar-track-transparent">
        {categories.map((category, index) => (
          <ProgressItem 
            key={index} 
            category={category.name} 
            isComplete={category.isComplete} 
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AnalysisDisplay;
