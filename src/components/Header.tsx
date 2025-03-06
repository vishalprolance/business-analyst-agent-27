
import React from 'react';
import { motion } from 'framer-motion';
import { fadeInAnimation } from '@/utils/animation';

interface HeaderProps {
  onNewAnalysis?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewAnalysis }) => {
  return (
    <motion.header 
      className="w-full flex justify-between items-center py-6 px-6 sm:px-8 md:px-12 glass rounded-b-lg border-b border-analyst-border"
      initial="initial"
      animate="animate"
      variants={fadeInAnimation}
    >
      <motion.div 
        className="flex items-center"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 mr-3 bg-gradient-to-br from-analyst-accent to-blue-500 rounded-lg"></div>
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">Business Analyst Agent</h1>
          <p className="text-xs text-analyst-text">Business Intelligence Agent</p>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex items-center space-x-4"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button className="text-sm text-analyst-text hover:text-analyst-accent transition-colors duration-300">
          Dashboard
        </button>
        <button className="text-sm text-analyst-text hover:text-analyst-accent transition-colors duration-300">
          History
        </button>
        <button 
          className="px-4 py-2 text-sm bg-analyst-accent text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
          onClick={onNewAnalysis}
        >
          New Analysis
        </button>
      </motion.div>
    </motion.header>
  );
};

export default Header;
