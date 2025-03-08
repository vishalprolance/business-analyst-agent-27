
import React from 'react';
import { motion } from 'framer-motion';

const FooterSection: React.FC = () => {
  return (
    <motion.div 
      className="mt-16 text-center text-sm text-analyst-text"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      Powered by advanced product planning algorithms • Updated in real-time
    </motion.div>
  );
};

export default FooterSection;
