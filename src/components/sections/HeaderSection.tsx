
import React from 'react';
import { motion } from 'framer-motion';
import { fadeInAnimation } from '@/utils/animation';

const HeaderSection: React.FC = () => {
  return (
    <motion.div 
      className="text-center mb-12"
      variants={fadeInAnimation}
      initial="initial"
      animate="animate"
    >
      <motion.h1 
        className="text-3xl md:text-4xl font-bold mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Technical Business Analyst & Requirements Generator
      </motion.h1>
      <motion.p 
        className="text-analyst-text max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Chat with your friendly technical business analyst to plan your app idea and generate 
        a comprehensive Product Requirements Document with insights and recommendations.
      </motion.p>
    </motion.div>
  );
};

export default HeaderSection;
