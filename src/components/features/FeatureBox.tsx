
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureBoxProps {
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  onClick?: () => void;
  isEnabled?: boolean;
  testId?: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({
  title,
  description,
  icon: Icon,
  bgColor,
  borderColor,
  onClick,
  isEnabled = true,
  testId
}) => {
  return (
    <motion.div 
      className={`flex items-center ${bgColor} ${isEnabled ? '' : 'bg-opacity-70'} p-5 rounded-lg border ${borderColor} shadow-sm hover:shadow-md transition-all duration-300 ${isEnabled && onClick ? 'cursor-pointer' : ''}`}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
      transition={{ duration: 0.3 }}
      onClick={isEnabled ? onClick : undefined}
      role={onClick && isEnabled ? "button" : undefined}
      aria-disabled={!isEnabled}
      tabIndex={onClick && isEnabled ? 0 : -1}
      data-testid={testId}
    >
      <div className="p-3 bg-opacity-70 rounded-xl mr-4" style={{ 
        backgroundColor: bgColor.includes('blue') ? 'rgb(219, 234, 254)' : 
                         bgColor.includes('green') ? 'rgb(220, 252, 231)' : 
                         'rgb(254, 249, 195)' 
      }}>
        <Icon className={`w-6 h-6 ${
          bgColor.includes('blue') ? 'text-blue-500' : 
          bgColor.includes('green') ? 'text-green-500' : 
          'text-yellow-600'
        }`} />
      </div>
      <div>
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs mt-1" style={{
          color: bgColor.includes('blue') ? 'rgb(59, 130, 246, 0.8)' : 
                bgColor.includes('green') ? 'rgb(22, 163, 74, 0.8)' : 
                'rgb(202, 138, 4, 0.8)'
        }}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureBox;
