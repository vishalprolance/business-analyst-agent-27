
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, FileText } from 'lucide-react';
import FeatureBox from './FeatureBox';

interface FeatureBoxesProps {
  isPRDAvailable: boolean;
  onGenerateRoadmap: () => void;
  onGeneratePRD: () => void;
}

const FeatureBoxes: React.FC<FeatureBoxesProps> = ({
  isPRDAvailable,
  onGenerateRoadmap,
  onGeneratePRD
}) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Requirement Analysis Box */}
      <FeatureBox 
        title="Requirement Analysis"
        description="Structured information gathering"
        icon={BarChart2}
        bgColor="bg-[#D3E4FD]"
        borderColor="border-blue-200"
      />
      
      {/* Master Planning Box */}
      <FeatureBox 
        title="Master Planning"
        description={isPRDAvailable ? 'Click to generate development roadmap' : 'Answer more questions to unlock'}
        icon={TrendingUp}
        bgColor="bg-[#F2FCE2]"
        borderColor="border-green-200"
        onClick={onGenerateRoadmap}
        isEnabled={isPRDAvailable}
        testId="master-planning-button"
      />
      
      {/* PRD Generation Box */}
      <FeatureBox 
        title="PRD Generation"
        description={isPRDAvailable ? 'Click to generate requirements document' : 'Answer more questions to unlock'}
        icon={FileText}
        bgColor="bg-[#FEF7CD]"
        borderColor="border-yellow-200"
        onClick={onGeneratePRD}
        isEnabled={isPRDAvailable}
        testId="prd-button"
      />
    </motion.div>
  );
};

export default FeatureBoxes;
